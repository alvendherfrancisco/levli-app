import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { sendWebPush } from '../../shared/webPush.ts';

// Scheduled job: checks each user with push notifications enabled,
// calculates their next scheduled shot, and sends a reminder push
// on the morning of the shot day. Uses ReminderLog to prevent duplicate
// notifications for the same shot instance.

const MONTH_IDX = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

function parseShotDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length < 3) return null;
  return new Date(parseInt(parts[2]), MONTH_IDX[parts[0]] ?? 0, parseInt(parts[1]));
}

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

// Common GLP-1 / injectable dosing intervals in days (by generic name).
// Falls back to the user's profile.days_between for anything not listed.
const DOSING_INTERVAL_BY_GENERIC: Record<string, number> = {
  'semaglutide': 7,
  'liraglutide': 1,
  'tirzepatide': 7,
  'dulaglutide': 7,
  'exenatide': 1,
  'lixisenatide': 1,
  'cagrilintide': 7,
  'retatrutide': 7,
  'survodutide': 7,
  'mazdutide': 7,
  'orforglipron': 1,
};

function getDosingInterval(medication: string, drugClass: string): number | null {
  if (drugClass) {
    const key = drugClass.toLowerCase();
    if (DOSING_INTERVAL_BY_GENERIC[key]) return DOSING_INTERVAL_BY_GENERIC[key];
  }
  if (medication) {
    const key = medication.toLowerCase();
    if (DOSING_INTERVAL_BY_GENERIC[key]) return DOSING_INTERVAL_BY_GENERIC[key];
  }
  return null;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const publicKey = secrets.get('VAPID_PUBLIC_KEY');
    const privateKey = secrets.get('VAPID_PRIVATE_KEY');
    const subject = (secrets.get('VAPID_SUBJECT') || 'mailto:alvendherfrancisco01@gmail.com')
      .replace(/[<>]/g, '').replace(/mailto:\s*/i, 'mailto:').trim();

    if (!publicKey || !privateKey) {
      console.error('VAPID keys not configured');
      return Response.json({ success: false, error: 'VAPID keys not configured' });
    }

    // 1. Get all user profiles (service role bypasses RLS)
    const allProfiles = await base44.asServiceRole.entities.UserProfile.list("", 1000);
    const profiles = allProfiles.filter((p) => p.notifications_enabled === true);
    console.log(`Found ${profiles.length} users with notifications enabled`);

    if (profiles.length === 0) {
      return Response.json({ success: true, sent: 0, failed: 0, skipped: 0, total: 0 });
    }

    // 2. Get all push subscriptions grouped by user
    const allSubs = await base44.asServiceRole.entities.PushSubscription.list();
    const subsByUser: Record<string, any[]> = {};
    for (const sub of allSubs) {
      if (!subsByUser[sub.created_by_id]) subsByUser[sub.created_by_id] = [];
      subsByUser[sub.created_by_id].push(sub);
    }
    console.log(`Found ${allSubs.length} push subscriptions across ${Object.keys(subsByUser).length} users`);

    // 3. Get all reminder logs to prevent duplicates
    const existingLogs = await base44.asServiceRole.entities.ReminderLog.list();
    const loggedKeys = new Set(existingLogs.map((l) => `${l.created_by_id}|${l.shot_date_key}|${l.reminder_type}`));
    console.log(`Found ${existingLogs.length} existing reminder logs`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sent = 0, failed = 0, skipped = 0;

    for (const profile of profiles) {
      try {
        const userId = profile.created_by_id;
        const userSubs = subsByUser[userId];
        if (!userSubs || userSubs.length === 0) { skipped++; continue; }

        // Get this user's most recent shots (sorted by creation date)
        const userShots = await base44.asServiceRole.entities.Shot.filter(
          { created_by_id: userId },
          "-created_date",
          50
        );

        if (userShots.length === 0) { skipped++; continue; }

        // Sort by shot date (descending) to find the most recent shot
        userShots.sort((a, b) => {
          const da = parseShotDate(a.date);
          const db = parseShotDate(b.date);
          if (!da) return 1;
          if (!db) return -1;
          return db.getTime() - da.getTime();
        });

        const lastShot = userShots[0];
        const lastDate = parseShotDate(lastShot.date);
        if (!lastDate) { skipped++; continue; }

        // Calculate dosing interval
        const interval = getDosingInterval(lastShot.medication, lastShot.drug_class)
          || parseInt(profile.days_between || "7")
          || 7;

        // Calculate next shot date
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + interval);
        const nextDateKey = toDayKey(nextDate);

        // Check if due today or overdue
        const daysLeft = Math.round((nextDate.getTime() - today.getTime()) / 86400000);
        if (daysLeft > 0) { skipped++; continue; } // Not due yet

        // Check if already reminded for this shot instance
        const reminderKey = `${userId}|${nextDateKey}|due_today`;
        if (loggedKeys.has(reminderKey)) { skipped++; continue; }

        // Build notification content
        const medication = lastShot.medication || "your medication";
        const body = daysLeft === 0
          ? `Your ${medication} shot is due today.`
          : `Your ${medication} shot is overdue — please log it when you can.`;

        const payload = JSON.stringify({
          title: 'Levli Reminder',
          body,
        });

        // Send to all of this user's subscriptions
        let userSent = false;
        for (const sub of userSubs) {
          const subscription = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
          };
          const result = await sendWebPush(subscription, payload, publicKey, privateKey, subject);
          if (result.success) {
            userSent = true;
            sent++;
          } else {
            console.error(`Push failed for sub ${sub.id} (user ${userId}): ${result.error}`);
            failed++;
            // If subscription is gone (410/404), delete it so future runs skip it
            if (result.statusCode === 410 || result.statusCode === 404) {
              try {
                await base44.asServiceRole.entities.PushSubscription.delete(sub.id);
                console.log(`Deleted expired subscription ${sub.id}`);
              } catch (e) {
                console.error(`Failed to delete expired sub ${sub.id}: ${e.message}`);
              }
            }
          }
        }

        // Log the reminder if at least one push succeeded
        if (userSent) {
          try {
            await base44.asServiceRole.entities.ReminderLog.create({
              shot_date_key: nextDateKey,
              reminder_type: 'due_today',
              medication: lastShot.medication || '',
            });
          } catch (e) {
            console.error(`Failed to log reminder for user ${userId}: ${e.message}`);
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${profile.created_by_id}: ${userError.message}`);
        failed++;
      }
    }

    console.log(`Shot reminders complete: ${sent} sent, ${failed} failed, ${skipped} skipped`);
    return Response.json({ success: true, sent, failed, skipped, total: profiles.length });
  } catch (error) {
    console.error('send-shot-reminders error:', error.message, error.stack);
    return Response.json({ success: false, error: error.message });
  }
}