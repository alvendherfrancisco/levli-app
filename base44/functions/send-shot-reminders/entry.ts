import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import {
  getVapidConfig, parseShotDate, toDayKey,
  isWithinDays, sendPushToUserSubs,
} from '../../shared/reminderHelpers.ts';

// Scheduled job: checks each user with push notifications enabled and
// evaluates reminder conditions based on individual notification toggles.
// All use ReminderLog for deduplication to prevent duplicate notifications.
//
// Notification types (GLP-1/wellness-relevant only):
//   1. Shot due today / overdue (core, always on unless explicitly disabled)
//   2. Missed dose follow-up (24h+ past due, no shot logged)
//   3. Refill / running low (≤2 doses remaining in inventory)
//   4. Symptom/mood check-in (Mon/Wed/Fri only, no activity in 3 days)
//   5. Weigh-in reminder (no weight in 7 days, staggered with check-in)
//   6. Re-engagement nudge (5+ days no activity, capped at once per 5 days)
//
// Excluded: weekly summary (gamification-adjacent), generic engagement spam,
// calorie/food guilt notifications, marketing pushes.
//
// All notifications are personalized with the user's first name when available,
// include deep-link URLs for tap-through navigation, respect quiet hours
// (7am–9pm Manila time for non-critical types), and are staggered to prevent
// notification fatigue (max one non-critical notification per run per user).

const DOSING_INTERVAL_BY_GENERIC: Record<string, number> = {
  'semaglutide': 7, 'liraglutide': 1, 'tirzepatide': 7, 'dulaglutide': 7,
  'exenatide': 1, 'lixisenatide': 1, 'cagrilintide': 7, 'retatrutide': 7,
  'survodutide': 7, 'mazdutide': 7, 'orforglipron': 1,
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

function groupBy(arr: any[]): Record<string, any[]> {
  const map: Record<string, any[]> = {};
  for (const item of arr) {
    if (!map[item.created_by_id]) map[item.created_by_id] = [];
    map[item.created_by_id].push(item);
  }
  return map;
}

// Personalized greeting — falls back gracefully when no name is set.
function greet(firstName: string): string {
  return firstName ? `Hi ${firstName}` : "Hi there";
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const vapidConfig = getVapidConfig(secrets);
    if (!vapidConfig) {
      console.error('VAPID keys not configured');
      return Response.json({ success: false, error: 'VAPID keys not configured' });
    }

    // Batch-fetch all data upfront (service role bypasses RLS)
    const [allProfiles, allSubs, allLogs, allShots, allAdverse, allMetrics, allJournal, allInventory] = await Promise.all([
      base44.asServiceRole.entities.UserProfile.list("", 1000),
      base44.asServiceRole.entities.PushSubscription.list(),
      base44.asServiceRole.entities.ReminderLog.list(),
      base44.asServiceRole.entities.Shot.list("", 1000),
      base44.asServiceRole.entities.AdverseEvent.list("", 1000),
      base44.asServiceRole.entities.DayMetric.list("", 1000),
      base44.asServiceRole.entities.JournalEntry.list("", 1000),
      base44.asServiceRole.entities.Inventory.list("", 1000),
    ]);

    const profiles = allProfiles.filter((p) => p.notifications_enabled === true);
    console.log(`Found ${profiles.length} users with notifications enabled`);

    if (profiles.length === 0) {
      return Response.json({ success: true, sent: 0, failed: 0, skipped: 0, total: 0 });
    }

    // Group all data by user
    const subsByUser = groupBy(allSubs);
    const shotsByUser = groupBy(allShots);
    const adverseByUser = groupBy(allAdverse);
    const metricsByUser = groupBy(allMetrics);
    const journalByUser = groupBy(allJournal);
    const inventoryByUser = groupBy(allInventory);

    // Dedup: exact key match (user|instanceKey|reminder_type)
    const loggedKeys = new Set(allLogs.map((l) => `${l.created_by_id}|${l.shot_date_key}|${l.reminder_type}`));

    // Dedup: by user+type for time-window checks (check-in, weigh-in, re-engagement)
    const logsByUserType: Record<string, any[]> = {};
    for (const l of allLogs) {
      const key = `${l.created_by_id}|${l.reminder_type}`;
      if (!logsByUserType[key]) logsByUserType[key] = [];
      logsByUserType[key].push(l);
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Manila time (UTC+8) for scheduling and quiet hours
    const manilaNow = new Date(now.getTime() + 8 * 3600000);
    const manilaHour = manilaNow.getUTCHours();
    const manilaDay = manilaNow.getUTCDay(); // 0 = Sunday
    const isQuietHours = manilaHour < 7 || manilaHour > 21;

    let sent = 0, failed = 0, skipped = 0;

    for (const profile of profiles) {
      try {
        const userId = profile.created_by_id;
        const userSubs = subsByUser[userId];
        if (!userSubs || userSubs.length === 0) { skipped++; continue; }

        const firstName = profile.first_name || "";
        const userShots = (shotsByUser[userId] || []).sort((a, b) => {
          const da = parseShotDate(a.date), db = parseShotDate(b.date);
          if (!da) return 1; if (!db) return -1;
          return db.getTime() - da.getTime();
        });

        // Track which notifications were sent this run (for staggering)
        const sentThisRun = new Set<string>();

        // ── 1. Shot due today / overdue (core reminder) ─────────────
        if (profile.notif_shot_reminders !== false) {
          if (userShots.length > 0) {
            const lastShot = userShots[0];
            const lastDate = parseShotDate(lastShot.date);
            if (lastDate) {
              const interval = getDosingInterval(lastShot.medication, lastShot.drug_class)
                || parseInt(profile.days_between || "7") || 7;
              const nextDate = new Date(lastDate);
              nextDate.setDate(nextDate.getDate() + interval);
              const nextDateKey = toDayKey(nextDate);
              const daysLeft = Math.round((nextDate.getTime() - today.getTime()) / 86400000);

              if (daysLeft <= 0) {
                const reminderKey = `${userId}|${nextDateKey}|due_today`;
                if (!loggedKeys.has(reminderKey)) {
                  const medication = lastShot.medication || "your medication";
                  const body = daysLeft === 0
                    ? `${greet(firstName)}, it's time for your ${medication} shot today 😊`
                    : `${greet(firstName)}, your ${medication} shot is overdue — please log it when you can.`;
                  const payload = JSON.stringify({ title: 'Levli Reminder', body, url: '/shots?action=log' });
                  const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                    created_by_id: userId, shot_date_key: nextDateKey, reminder_type: 'due_today', medication: lastShot.medication || '',
                  });
                  sent += result.sent; failed += result.failed;
                  sentThisRun.add('shot');
                }
              }

              // ── 2. Missed dose follow-up (24h+ past due, no shot logged) ─
              if (daysLeft <= -1) {
                const missedKey = `${userId}|${nextDateKey}|missed_dose`;
                if (!loggedKeys.has(missedKey)) {
                  const shotOnDueDate = userShots.some((s) => {
                    const d = parseShotDate(s.date);
                    return d && toDayKey(d) === nextDateKey;
                  });
                  if (!shotOnDueDate) {
                    const medication = lastShot.medication || "your medication";
                    const body = `${greet(firstName)}, just checking in — did you get your ${medication} shot yet?`;
                    const payload = JSON.stringify({ title: 'Missed a dose?', body, url: '/shots?action=log' });
                    const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                      created_by_id: userId, shot_date_key: nextDateKey, reminder_type: 'missed_dose', medication: lastShot.medication || '',
                    });
                    sent += result.sent; failed += result.failed;
                    sentThisRun.add('shot');
                  }
                }
              }
            }
          }
        }

        // ── 3. Refill / running low (≤2 doses remaining) ────────────
        if (profile.notif_inventory_alerts !== false) {
          const userInventory = inventoryByUser[userId] || [];
          for (const inv of userInventory) {
            if (inv.status !== 'active') continue;
            const unit = (inv.quantity_unit || 'doses').toLowerCase();
            if (unit !== 'doses') continue;
            if (inv.remaining_quantity == null || inv.remaining_quantity > 2) continue;

            const invKey = `${userId}|inventory:${inv.id}|refill_low`;
            if (loggedKeys.has(invKey)) continue;

            const medication = inv.product_name || "your medication";
            const doses = inv.remaining_quantity;
            const body = `${greet(firstName)}, you're down to about ${doses} dose${doses === 1 ? '' : 's'} of ${medication}. Might be time to refill your prescription.`;
            const payload = JSON.stringify({ title: 'Running low', body, url: '/inventory' });
            const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
              created_by_id: userId, shot_date_key: `inventory:${inv.id}`, reminder_type: 'refill_low', medication: inv.product_name || '',
            });
            sent += result.sent; failed += result.failed;
            sentThisRun.add('inventory');
          }
        }

        // Skip non-critical notifications during quiet hours (7am–9pm Manila).
        // Shot reminders and missed-dose follow-ups are always allowed.
        if (!isQuietHours) {

          // ── 4. Symptom/mood check-in (Mon/Wed/Fri, no activity in 3 days) ─
          if (profile.notif_checkin_reminders === true) {
            // Only on Mon(1), Wed(3), Fri(5) to avoid daily nagging
            if (manilaDay === 1 || manilaDay === 3 || manilaDay === 5) {
              // Stagger: don't send if a shot reminder was sent this run
              if (!sentThisRun.has('shot')) {
                const checkinLogs = logsByUserType[`${userId}|side_effect_checkin`] || [];
                const recentCheckin = checkinLogs.some((l) => isWithinDays(l.created_date, 3, now));
                if (!recentCheckin) {
                  const recentAdverse = (adverseByUser[userId] || []).some((a) => isWithinDays(a.created_date, 3, now));
                  const recentSideEffects = (metricsByUser[userId] || []).some((m) => isWithinDays(m.created_date, 3, now) && m.side_effects);
                  const recentJournal = (journalByUser[userId] || []).some((j) => isWithinDays(j.created_date, 3, now));
                  if (!recentAdverse && !recentSideEffects && !recentJournal) {
                    const body = `${greet(firstName)}, how are you feeling today?`;
                    const payload = JSON.stringify({ title: 'Levli', body, url: '/journal' });
                    const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                      created_by_id: userId, shot_date_key: toDayKey(today), reminder_type: 'side_effect_checkin',
                    });
                    sent += result.sent; failed += result.failed;
                    sentThisRun.add('checkin');
                  }
                }
              }
            }
          }

          // ── 5. Weigh-in reminder (no weight in 7 days) ──────────────
          if (profile.notif_weight_reminders === true) {
            // Stagger: don't send if a check-in or shot reminder was sent this run
            if (!sentThisRun.has('checkin') && !sentThisRun.has('shot')) {
              const weighInLogs = logsByUserType[`${userId}|weigh_in`] || [];
              const recentWeighIn = weighInLogs.some((l) => isWithinDays(l.created_date, 7, now));
              if (!recentWeighIn) {
                const recentWeight = (metricsByUser[userId] || []).some((m) => isWithinDays(m.created_date, 7, now) && m.weight != null);
                if (!recentWeight) {
                  const body = `${greet(firstName)}, it's been a week since your last weigh-in. Log your weight to keep your progress chart up to date.`;
                  const payload = JSON.stringify({ title: 'Weekly weigh-in', body, url: '/' });
                  const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                    created_by_id: userId, shot_date_key: toDayKey(today), reminder_type: 'weigh_in',
                  });
                  sent += result.sent; failed += result.failed;
                  sentThisRun.add('weighin');
                }
              }
            }
          }

          // ── 6. Re-engagement nudge (5+ days no activity) ────────────
          if (profile.notif_reengagement === true) {
            // Only send if no other notification was sent this run
            if (sentThisRun.size === 0) {
              const reengagementLogs = logsByUserType[`${userId}|reengagement`] || [];
              const recentReengagement = reengagementLogs.some((l) => isWithinDays(l.created_date, 5, now));
              if (!recentReengagement) {
                // Check last activity across all entity types
                const allActivityDates = [
                  ...(shotsByUser[userId] || []).map((s) => s.created_date),
                  ...(journalByUser[userId] || []).map((j) => j.created_date),
                  ...(metricsByUser[userId] || []).map((m) => m.created_date),
                ].filter(Boolean);

                let daysSinceActivity = Infinity;
                if (allActivityDates.length > 0) {
                  const sorted = allActivityDates.map((d) => new Date(d).getTime()).sort((a, b) => b - a);
                  daysSinceActivity = (now.getTime() - sorted[0]) / 86400000;
                }

                if (daysSinceActivity >= 5) {
                  const body = `${greet(firstName)}, it's been a few days — we're here whenever you're ready.`;
                  const payload = JSON.stringify({ title: 'Levli', body, url: '/' });
                  const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                    created_by_id: userId, shot_date_key: toDayKey(today), reminder_type: 'reengagement',
                  });
                  sent += result.sent; failed += result.failed;
                }
              }
            }
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${profile.created_by_id}: ${userError.message}`);
        failed++;
      }
    }

    console.log(`Reminders complete: ${sent} sent, ${failed} failed, ${skipped} skipped`);
    return Response.json({ success: true, sent, failed, skipped, total: profiles.length });
  } catch (error) {
    console.error('send-shot-reminders error:', error.message, error.stack);
    return Response.json({ success: false, error: error.message });
  }
}