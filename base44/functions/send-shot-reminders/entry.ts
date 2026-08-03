import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import {
  getVapidConfig, parseShotDate, toDayKey, getWeekKey, getWeekStart,
  isWithinDays, isAfterDate, sendPushToUserSubs,
} from '../../shared/reminderHelpers.ts';

// Scheduled job: checks each user with push notifications enabled and
// evaluates six reminder conditions:
//   1. Shot due today / overdue (existing)
//   2. Missed dose (24h past due date, no shot logged)
//   3. Refill / running low (≤2 doses remaining in inventory)
//   4. Weekly progress summary (Sunday evening, premium only)
//   5. Side effect check-in (no symptoms logged in 3 days)
//   6. Weigh-in reminder (no weight logged in 7 days)
// All use ReminderLog for deduplication to prevent duplicate notifications.

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

    // Dedup: by user+type for time-window checks (check-in, weigh-in)
    const logsByUserType: Record<string, any[]> = {};
    for (const l of allLogs) {
      const key = `${l.created_by_id}|${l.reminder_type}`;
      if (!logsByUserType[key]) logsByUserType[key] = [];
      logsByUserType[key].push(l);
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Manila time (UTC+8) for weekly summary scheduling
    const manilaNow = new Date(now.getTime() + 8 * 3600000);
    const manilaDay = manilaNow.getUTCDay(); // 0 = Sunday
    const manilaHour = manilaNow.getUTCHours();
    const isSundayEvening = manilaDay === 0 && manilaHour >= 18;
    const manilaToday = new Date(manilaNow);
    manilaToday.setUTCHours(0, 0, 0, 0);
    const weekKey = getWeekKey(manilaToday);
    const weekStart = getWeekStart(manilaToday);

    let sent = 0, failed = 0, skipped = 0;

    for (const profile of profiles) {
      try {
        const userId = profile.created_by_id;
        const userSubs = subsByUser[userId];
        if (!userSubs || userSubs.length === 0) { skipped++; continue; }

        const userShots = (shotsByUser[userId] || []).sort((a, b) => {
          const da = parseShotDate(a.date), db = parseShotDate(b.date);
          if (!da) return 1; if (!db) return -1;
          return db.getTime() - da.getTime();
        });

        // ── 1. Shot due today / overdue ──────────────────────────────
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
                  ? `Your ${medication} shot is due today.`
                  : `Your ${medication} shot is overdue — please log it when you can.`;
                const payload = JSON.stringify({ title: 'Levli Reminder', body });
                const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                  created_by_id: userId, shot_date_key: nextDateKey, reminder_type: 'due_today', medication: lastShot.medication || '',
                });
                sent += result.sent; failed += result.failed;
              }
            }

            // ── 2. Missed dose (24h past due, no shot logged) ─────────
            if (daysLeft <= -1) {
              const missedKey = `${userId}|${nextDateKey}|missed_dose`;
              if (!loggedKeys.has(missedKey)) {
                // Skip if user already logged a shot for the due date
                const shotOnDueDate = userShots.some((s) => {
                  const d = parseShotDate(s.date);
                  return d && toDayKey(d) === nextDateKey;
                });
                if (!shotOnDueDate) {
                  const medication = lastShot.medication || "your medication";
                  const dateStr = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const body = `Looks like your ${medication} shot from ${dateStr} hasn't been logged yet. If you took it, log it now — if not, check in with your prescriber.`;
                  const payload = JSON.stringify({ title: 'Missed a dose?', body });
                  const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                    created_by_id: userId, shot_date_key: nextDateKey, reminder_type: 'missed_dose', medication: lastShot.medication || '',
                  });
                  sent += result.sent; failed += result.failed;
                }
              }
            }
          }
        }

        // ── 3. Refill / running low (≤2 doses remaining) ────────────
        const userInventory = inventoryByUser[userId] || [];
        for (const inv of userInventory) {
          if (inv.status !== 'active') continue;
          const unit = (inv.quantity_unit || 'doses').toLowerCase();
          if (unit !== 'doses') continue; // only check dose-based inventory
          if (inv.remaining_quantity == null || inv.remaining_quantity > 2) continue;

          const invKey = `${userId}|inventory:${inv.id}|refill_low`;
          if (loggedKeys.has(invKey)) continue;

          const medication = inv.product_name || "your medication";
          const doses = inv.remaining_quantity;
          const body = `You're down to about ${doses} dose${doses === 1 ? '' : 's'} of ${medication}. Might be time to refill your prescription.`;
          const payload = JSON.stringify({ title: 'Running low', body });
          const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
            created_by_id: userId, shot_date_key: `inventory:${inv.id}`, reminder_type: 'refill_low', medication: inv.product_name || '',
          });
          sent += result.sent; failed += result.failed;
        }

        // ── 4. Weekly progress summary (Sunday evening, premium) ────
        if (isSundayEvening) {
          const weeklyKey = `${userId}|week:${weekKey}|weekly_summary`;
          if (!loggedKeys.has(weeklyKey)) {
            const isPremium = profile.plan_type && profile.plan_type !== 'free';
            if (isPremium) {
              const weekShots = (shotsByUser[userId] || []).filter((s) => isAfterDate(s.created_date, weekStart));
              const weekJournal = (journalByUser[userId] || []).filter((j) => isAfterDate(j.created_date, weekStart));
              const weekAdverse = (adverseByUser[userId] || []).filter((a) => isAfterDate(a.created_date, weekStart));
              const weekMetrics = (metricsByUser[userId] || []).filter((m) => isAfterDate(m.created_date, weekStart) && m.weight != null);

              const shotCount = weekShots.length;
              const checkInCount = weekJournal.length + weekAdverse.length;

              let weightChangeStr = '';
              if (weekMetrics.length >= 2) {
                const sorted = [...weekMetrics].sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
                const firstW = sorted[0].weight;
                const lastW = sorted[sorted.length - 1].weight;
                const diff = firstW - lastW; // positive = lost weight
                if (diff > 0) {
                  const unit = profile.weight_unit || 'lb';
                  weightChangeStr = ` You're down ${diff.toFixed(1)} ${unit}.`;
                }
              }

              const body = `You logged ${shotCount} shot${shotCount === 1 ? '' : 's'}, ${checkInCount} check-in${checkInCount === 1 ? '' : 's'}, and stayed consistent with your schedule.${weightChangeStr} Nice work.`;
              const payload = JSON.stringify({ title: 'Your week in review', body });
              const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                created_by_id: userId, shot_date_key: `week:${weekKey}`, reminder_type: 'weekly_summary',
              });
              sent += result.sent; failed += result.failed;
            }
          }
        }

        // ── 5. Side effect check-in (no symptoms in 3 days) ─────────
        {
          const checkinLogs = logsByUserType[`${userId}|side_effect_checkin`] || [];
          const recentCheckin = checkinLogs.some((l) => isWithinDays(l.created_date, 3, now));
          if (!recentCheckin) {
            const recentAdverse = (adverseByUser[userId] || []).some((a) => isWithinDays(a.created_date, 3, now));
            const recentSideEffects = (metricsByUser[userId] || []).some((m) => isWithinDays(m.created_date, 3, now) && m.side_effects);
            if (!recentAdverse && !recentSideEffects) {
              const body = `It's been a few days since your last check-in. Take a moment to log how you're feeling today.`;
              const payload = JSON.stringify({ title: 'How are you feeling?', body });
              const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                created_by_id: userId, shot_date_key: toDayKey(today), reminder_type: 'side_effect_checkin',
              });
              sent += result.sent; failed += result.failed;
            }
          }
        }

        // ── 6. Weigh-in reminder (no weight in 7 days) ──────────────
        {
          const weighInLogs = logsByUserType[`${userId}|weigh_in`] || [];
          const recentWeighIn = weighInLogs.some((l) => isWithinDays(l.created_date, 7, now));
          if (!recentWeighIn) {
            const recentWeight = (metricsByUser[userId] || []).some((m) => isWithinDays(m.created_date, 7, now) && m.weight != null);
            if (!recentWeight) {
              const body = `It's been a week since your last weigh-in. Log your weight to keep your progress chart up to date.`;
              const payload = JSON.stringify({ title: 'Weekly weigh-in', body });
              const result = await sendPushToUserSubs(base44, userSubs, payload, vapidConfig, {
                created_by_id: userId, shot_date_key: toDayKey(today), reminder_type: 'weigh_in',
              });
              sent += result.sent; failed += result.failed;
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