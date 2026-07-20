// Weight and dose unit conversions — keeps historical entries stable when the
// user toggles units.

export function weightToKg(value, unit) {
  if (value == null) return null;
  return unit === "kg" ? value : value * 0.453592;
}

export function kgToUnit(kg, unit) {
  if (kg == null) return null;
  return unit === "kg" ? kg : kg / 0.453592;
}

export function convertWeight(value, fromUnit, toUnit) {
  if (value == null) return null;
  if (fromUnit === toUnit) return value;
  return kgToUnit(weightToKg(value, fromUnit), toUnit);
}

// ── Dose unit conversions ───────────────────────────────────────────────────
// Supports mg, mcg, units, IU, mL, MBq. Dose-max comparisons and PK calculations
// internally use mg for mass-based units; non-mass units (units, IU, mL, MBq,
// sprays, tablets) are passed through without conversion.

export const DOSE_UNITS = ["mg", "mcg", "units", "IU", "mL", "MBq", "sprays", "tablets"];

const MASS_UNITS = new Set(["mg", "mcg"]);

/** Converts a dose value from one unit to another. Returns the value unchanged
 *  for non-mass units or unsupported conversions. */
export function convertDose(value, fromUnit, toUnit) {
  if (value == null) return null;
  if (fromUnit === toUnit) return value;
  if (MASS_UNITS.has(fromUnit) && MASS_UNITS.has(toUnit)) {
    if (fromUnit === "mcg" && toUnit === "mg") return value / 1000;
    if (fromUnit === "mg" && toUnit === "mcg") return value * 1000;
  }
  // Non-mass units or cross-type: no conversion possible
  return value;
}

/** Converts a dose to mg for dose-max comparison. Returns null if the unit is
 *  not a mass unit (can't compare units/IU/mL to mg). */
export function doseToMg(value, unit) {
  if (value == null) return null;
  if (unit === "mg") return value;
  if (unit === "mcg") return value / 1000;
  return null; // units, IU, mL, MBq — not comparable to mg
}

/** Returns an appropriate input step for the given dose unit. */
export function doseStep(unit) {
  switch (unit) {
    case "mcg": return 1;
    case "mg": return 0.25;
    case "units": return 1;
    case "IU": return 1;
    case "mL": return 0.1;
    case "MBq": return 50;
    case "sprays": return 1;
    case "tablets": return 1;
    default: return 0.25;
  }
}