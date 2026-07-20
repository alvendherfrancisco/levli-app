// Duplicate active-ingredient detection — minimal standalone safety check.
// Uses the brand→generic map to flag two entries of the same active ingredient
// within a lookback window. Non-blocking: only adds a warning, never alters a dose.

import { DRUG_CLASS, getDosingInterval } from "@/lib/medicationData";
import { parseShotDate } from "@/lib/dateUtils";

export function detectDuplicateActiveIngredient(newMedication, shots) {
  const newGeneric = DRUG_CLASS[newMedication] || newMedication;
  if (!newGeneric) return { duplicate: false };

  const interval = getDosingInterval(newMedication) || 7;
  const lookbackDays = Math.max(interval * 2, 14);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const s of shots) {
    const generic = DRUG_CLASS[s.medication] || s.medication;
    if (generic !== newGeneric) continue;
    if (s.medication === newMedication) continue; // same brand handled by caller if needed
    const sd = parseShotDate(s.date);
    if (!sd) continue;
    const daysSince = Math.round((now - sd) / 86400000);
    if (daysSince >= 0 && daysSince <= lookbackDays) {
      return { duplicate: true, existingBrand: s.medication, generic, lastDoseDate: s.date };
    }
  }
  return { duplicate: false };
}