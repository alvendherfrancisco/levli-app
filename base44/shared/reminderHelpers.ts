import { sendWebPush } from './webPush.ts';

// ── VAPID config ──────────────────────────────────────────────────────
export function getVapidConfig(secrets: any): { publicKey: string; privateKey: string; subject: string } | null {
  const publicKey = secrets.get('VAPID_PUBLIC_KEY');
  const privateKey = secrets.get('VAPID_PRIVATE_KEY');
  const rawSubject = secrets.get('VAPID_SUBJECT') || 'mailto:alvendherfrancisco01@gmail.com';
  const subject = rawSubject.replace(/[<>]/g, '').replace(/mailto:\s*/i, 'mailto:').trim();
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey, subject };
}

// ── Date utilities ────────────────────────────────────────────────────
const MONTH_IDX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function parseShotDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // "Mon DD, YYYY" format (e.g., "Jan 15, 2026")
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length >= 3 && MONTH_IDX[parts[0]] !== undefined) {
    return new Date(parseInt(parts[2]), MONTH_IDX[parts[0]], parseInt(parts[1]));
  }
  // "YYYY-MM-DD" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
}

export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// ISO week key using UTC methods (for Manila-adjusted dates)
export function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// Monday of the current week (UTC methods, for Manila-adjusted dates)
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

// Check if an ISO created_date is within the last N days
export function isWithinDays(createdDate: string, days: number, now: Date): boolean {
  if (!createdDate) return false;
  const d = new Date(createdDate);
  if (isNaN(d.getTime())) return false;
  const diff = (now.getTime() - d.getTime()) / 86400000;
  return diff <= days && diff >= 0;
}

// Check if an ISO created_date is on or after a given date
export function isAfterDate(createdDate: string, date: Date): boolean {
  if (!createdDate) return false;
  const d = new Date(createdDate);
  if (isNaN(d.getTime())) return false;
  return d >= date;
}

// ── Push + log helper ──────────────────────────────────────────────────
export async function sendPushToUserSubs(
  base44: any,
  userSubs: any[],
  payload: string,
  vapidConfig: { publicKey: string; privateKey: string; subject: string },
  logData: { created_by_id: string; shot_date_key: string; reminder_type: string; medication?: string } | null
): Promise<{ sent: number; failed: number; userSent: boolean }> {
  let sent = 0, failed = 0;
  let userSent = false;

  for (const sub of userSubs) {
    const subscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
    };
    const result = await sendWebPush(subscription, payload, vapidConfig.publicKey, vapidConfig.privateKey, vapidConfig.subject);
    if (result.success) {
      userSent = true;
      sent++;
    } else {
      console.error(`Push failed for sub ${sub.id}: ${result.error}`);
      failed++;
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

  if (userSent && logData) {
    try {
      await base44.asServiceRole.entities.ReminderLog.create(logData);
    } catch (e) {
      console.error(`Failed to log reminder: ${e.message}`);
    }
  }

  return { sent, failed, userSent };
}