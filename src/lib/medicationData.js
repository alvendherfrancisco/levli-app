// Centralized medication data — single source of truth for brand/generic mapping,
// dosing intervals, half-lives, investigational flags, and missed-dose rules.
// Values sourced from FDA USPI / EMA EPAR clinical pharmacology sections for approved
// products. Investigational products have no validated PK parameters here.

import { parseShotDate, fromDayKey } from "@/lib/dateUtils";

// Brand → generic active ingredient
export const DRUG_CLASS = {
  "Ozempic®": "Semaglutide",
  "Wegovy®": "Semaglutide",
  "Semaglutide": "Semaglutide",
  "Mounjaro®": "Tirzepatide",
  "Zepbound®": "Tirzepatide",
  "Tirzepatide": "Tirzepatide",
  "Retatrutide": "Retatrutide",
  "Saxenda®": "Liraglutide",
  "Liraglutide": "Liraglutide",
};

export const MEDICATIONS = [
  "Zepbound®", "Mounjaro®", "Tirzepatide", "Wegovy®", "Ozempic®",
  "Semaglutide", "Retatrutide", "Saxenda®", "Liraglutide",
];

// Per-generic dosing interval in days (label-sourced for approved products).
export const DOSING_INTERVAL_DAYS = {
  "Semaglutide": 7,
  "Tirzepatide": 7,
  "Liraglutide": 1, // Saxenda is daily
  // Retatrutide: investigational — no schedule
};

// Half-lives in days, sourced from USPI clinical pharmacology.
export const HALF_LIFE_DAYS = {
  "Semaglutide": 7,
  "Tirzepatide": 5,
  "Liraglutide": 0.5, // ~13h per Saxenda USPI
  // Retatrutide: investigational — no validated value; PK disabled
};

export const INVESTIGATIONAL = new Set(["Retatrutide"]);

export function isInvestigational(medicationOrClass) {
  if (!medicationOrClass) return false;
  return INVESTIGATIONAL.has(medicationOrClass) || INVESTIGATIONAL.has(DRUG_CLASS[medicationOrClass]);
}

export function getDosingInterval(medication) {
  const generic = DRUG_CLASS[medication] || medication;
  return DOSING_INTERVAL_DAYS[generic] || null;
}

// Missed-dose rules for approved GLP-1s (label-sourced).
export const MISSED_DOSE_RULES = {
  "Semaglutide": {
    weekly: true,
    retitrationDays: 5,
    advice: "If more than 5 days have passed, skip this dose and contact your prescriber — you may need to restart the dose escalation.",
  },
  "Tirzepatide": {
    weekly: true,
    retitrationDays: 5,
    advice: "If more than 5 days have passed, take it as soon as you remember and contact your prescriber; you may need to restart titration.",
  },
  "Liraglutide": {
    weekly: false,
    retitrationDays: 0,
    advice: "If you miss a daily dose, skip it and take the next dose at the usual time — do not take a double dose.",
  },
};

export function getMissedDoseRule(medication) {
  const generic = DRUG_CLASS[medication] || medication;
  return MISSED_DOSE_RULES[generic] || null;
}

// Returns the most relevant medication for a given day (most recent shot on or before dayKey).
export function getRecentMedication(shots, dayKey) {
  if (!shots || !shots.length) return null;
  if (!dayKey) return shots[0].medication;
  const target = fromDayKey(dayKey);
  for (const s of shots) {
    const sd = parseShotDate(s.date);
    if (sd && sd <= target) return s.medication;
  }
  return shots[0].medication;
}