// Adherence calculation helpers.
// Doses logged / doses scheduled over a period, using the per-medication
// dosing interval already stored in the catalogue. No clinical interpretation.

import { getDosingInterval } from "@/lib/medicationData";
import { parseShotDate, calendarDaysBetween, todayKey, fromDayKey } from "@/lib/dateUtils";

/**
 * Calculates adherence for a given medication over a period.
 * @param {Array} shots — all shot records
 * @param {string} medication — brand name
 * @param {number} periodDays — window length (e.g. 30, 90)
 * @returns {{ logged: number, scheduled: number, adherencePct: number|null }}
 */
export function calcAdherence(shots, medication, periodDays) {
  const interval = getDosingInterval(medication);
  if (!interval || interval <= 0 || periodDays <= 0) {
    return { logged: 0, scheduled: 0, adherencePct: null };
  }
  const today = fromDayKey(todayKey());
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - periodDays);

  const logged = shots.filter((s) => {
    if (s.medication !== medication) return false;
    const d = parseShotDate(s.date);
    if (!d) return false;
    return d >= cutoff && d <= today;
  }).length;

  const scheduled = Math.floor(periodDays / interval);
  const adherencePct = scheduled > 0 ? Math.min(100, Math.round((logged / scheduled) * 100)) : null;
  return { logged, scheduled, adherencePct };
}