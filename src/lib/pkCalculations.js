// Pharmacokinetic calculation helpers — first-order elimination model.
// All values are modelled relative exposure, never blood concentration.
// Each function exposes its calculation version for auditability.

export const PK_CALCULATION_VERSION = "pk-v1";

/**
 * First-order elimination: relative amount remaining at time t after a dose.
 * A(t) = D × 0.5^(t / t½)
 */
export function remainingAtDays(dose, halfLifeDays, daysSinceDose) {
  if (daysSinceDose < 0 || !halfLifeDays || halfLifeDays <= 0) return 0;
  return dose * Math.pow(0.5, daysSinceDose / halfLifeDays);
}

/**
 * Superposition of all doses at time t (relative exposure).
 * Sums the remaining contribution of each historical dose.
 */
export function superposition(doses, halfLifeDays, atDate) {
  if (!halfLifeDays || halfLifeDays <= 0) return 0;
  let total = 0;
  for (const d of doses) {
    const daysSince = (atDate - d.date) / 86400000;
    if (daysSince >= 0) {
      total += remainingAtDays(d.dose, halfLifeDays, daysSince);
    }
  }
  return total;
}

/**
 * Steady-state fraction reached after n doses at fixed interval τ.
 * Fraction_SS(n) = 1 − e^(−k × nτ), where k = ln(2) / t½
 * Returns a value 0..1. For continuous time, pass n as t/τ.
 */
export function steadyStateFraction(halfLifeDays, intervalDays, nDoses) {
  if (!halfLifeDays || halfLifeDays <= 0 || !intervalDays || intervalDays <= 0) return null;
  const k = Math.LN2 / halfLifeDays;
  return 1 - Math.exp(-k * intervalDays * nDoses);
}

/**
 * Accumulation ratio at steady state for fixed-interval dosing.
 * R = 1 / (1 − e^(−kτ))
 */
export function accumulationRatio(halfLifeDays, intervalDays) {
  if (!halfLifeDays || halfLifeDays <= 0 || !intervalDays || intervalDays <= 0) return null;
  const k = Math.LN2 / halfLifeDays;
  return 1 / (1 - Math.exp(-k * intervalDays));
}

/**
 * Returns descriptive thresholds for steady-state progress.
 */
export function steadyStateThresholds(halfLifeDays, intervalDays) {
  const fraction = steadyStateFraction(halfLifeDays, intervalDays);
  if (fraction == null) return [];
  // How many doses to reach each threshold
  const k = Math.LN2 / halfLifeDays;
  const dosesFor = (thresh) => Math.ceil(Math.log(1 / (1 - thresh)) / (k * intervalDays));
  return [
    { threshold: 0.50, doses: dosesFor(0.50), label: "50%" },
    { threshold: 0.75, doses: dosesFor(0.75), label: "75%" },
    { threshold: 0.90, doses: dosesFor(0.90), label: "90%" },
    { threshold: 0.95, doses: dosesFor(0.95), label: "95%" },
  ];
}