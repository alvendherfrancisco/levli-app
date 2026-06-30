// Shared date utilities

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_IDX = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

/** "Jun 29, 2026" → Date at midnight local */
export function parseShotDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.replace(",", "").split(" ");
  return new Date(parseInt(parts[2]), MONTH_IDX[parts[0]] ?? 0, parseInt(parts[1]));
}

/** Date → "Jun 29, 2026" */
export function formatShotDate(date) {
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2,"0")}, ${date.getFullYear()}`;
}

/** Date → "YYYY-MM-DD" */
export function toDayKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/** "YYYY-MM-DD" → Date at midnight local */
export function fromDayKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "Jun 29, 2026" + N days → "Jun 29, 2026" */
export function addDaysToShotDate(dateStr, days) {
  const d = parseShotDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatShotDate(d);
}

/** days until a "Jun 29, 2026" date from today */
export function daysUntilShotDate(dateStr) {
  const d = parseShotDate(dateStr);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

/** how many days ago a "Jun 29, 2026" date was */
export function daysAgoLabel(dateStr) {
  const diff = -daysUntilShotDate(dateStr);
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export function todayKey() {
  return toDayKey(new Date());
}