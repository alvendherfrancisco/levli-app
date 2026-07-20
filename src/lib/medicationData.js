// Centralized medication data — single source of truth.
// All data is derived from the comprehensive medication catalogue
// (medicationCatalogue.js) which includes molecular classification,
// routes, approval status, capability profiles, and PK parameters.
//
// This module re-exports the flat maps that existing code depends on,
// sourced from the catalogue for maintainability.

import { parseShotDate, fromDayKey } from "@/lib/dateUtils";
import {
  MEDICATION_CATALOGUE,
  NAME_TO_ENTRY,
  ALL_MEDICATION_NAMES,
  ROUTES,
} from "@/lib/medicationCatalogue";

// ── Brand/generic → generic active ingredient (DRUG_CLASS) ─────────────────
// Built from catalogue: every brand name and generic name maps to the generic.
export const DRUG_CLASS = (() => {
  const map = {};
  MEDICATION_CATALOGUE.forEach((m) => {
    map[m.generic_name] = m.generic_name;
    if (m.brand_names) m.brand_names.forEach((b) => { map[b] = m.generic_name; });
  });
  return map;
})();

// ── Displayable medication names ───────────────────────────────────────────
// Flat list of brand + generic names for dropdowns.
// Filtered to approved + investigational (exclude cosmetic-only and unapproved
// research peptides from the default list; they can be accessed via search).
export const MEDICATIONS = (() => {
  const names = [];
  MEDICATION_CATALOGUE.forEach((m) => {
    const usStatus = m.approval?.US?.status;
    // Skip cosmetic-only and unapproved research peptides from the main list
    if (m.capability?.cosmetic_only) return;
    if (m.capability?.research_only && usStatus === "unapproved") return;
    if (m.brand_names?.length) {
      m.brand_names.forEach((b) => names.push(b));
    } else {
      names.push(m.generic_name);
    }
  });
  return names;
})();

// Extended list including ALL entries (for an "all medications" view)
export const ALL_MEDICATIONS = ALL_MEDICATION_NAMES;

// ── Per-generic dosing interval in days ───────────────────────────────────
// Extracted from the catalogue's dosing_interval_days map (first route).
export const DOSING_INTERVAL_DAYS = (() => {
  const map = {};
  MEDICATION_CATALOGUE.forEach((m) => {
    if (!m.dosing_interval_days) return;
    const routes = Object.keys(m.dosing_interval_days);
    for (const r of routes) {
      const val = m.dosing_interval_days[r];
      if (typeof val === "number") {
        map[m.generic_name] = val;
        break;
      }
      // If it's a brand-specific object, take the first brand's value
      if (val && typeof val === "object") {
        const firstBrand = Object.keys(val)[0];
        if (firstBrand) { map[m.generic_name] = val[firstBrand]; break; }
      }
    }
  });
  return map;
})();

// ── Half-life lookup (brand- and route-aware) ───────────────────────────────
// Keys by the specific brand+route when the catalogue provides brand-specific
// values (e.g. Byetta vs Bydureon have different half-lives). Falls back to
// generic name, then to the primary route's value.
//
// HALF_LIFE_DAYS (flat map keyed by generic) is kept for backward compat but
// callers should prefer getHalfLife(medication, route).
export const HALF_LIFE_DAYS = (() => {
  const map = {};
  MEDICATION_CATALOGUE.forEach((m) => {
    if (!m.half_life_days) return;
    if (m.capability?.research_only || m.capability?.cosmetic_only) return;
    if (m.capability?.supports_pk_estimation === false) return;
    const routes = Object.keys(m.half_life_days);
    for (const r of routes) {
      const val = m.half_life_days[r];
      if (typeof val === "number") {
        map[m.generic_name] = val;
        break;
      }
      if (val && typeof val === "object") {
        const firstBrand = Object.keys(val)[0];
        if (firstBrand) { map[m.generic_name] = val[firstBrand]; break; }
      }
    }
  });
  return map;
})();

/** Brand- and route-aware half-life in days. Returns null if not established. */
export function getHalfLife(medication, route) {
  const entry = NAME_TO_ENTRY[medication];
  if (!entry || !entry.half_life_days) return null;
  if (entry.capability?.research_only || entry.capability?.cosmetic_only) return null;
  if (entry.capability?.supports_pk_estimation === false) return null;
  const r = route || entry.routes[0];
  const val = entry.half_life_days[r] ?? entry.half_life_days[entry.routes[0]];
  if (val == null) return null;
  if (typeof val === "number") return val;
  if (typeof val === "object") {
    // Brand-specific: look up the exact brand, fall back to first brand
    return val[medication] ?? Object.values(val)[0] ?? null;
  }
  return null;
}

// ── Per-brand max maintenance dose in mg ───────────────────────────────────
export const DOSE_MAX = (() => {
  const map = {};
  MEDICATION_CATALOGUE.forEach((m) => {
    if (!m.dose_max) return;
    Object.entries(m.dose_max).forEach(([brand, max]) => { map[brand] = max; });
  });
  return map;
})();

export function getDoseMax(medication) {
  return DOSE_MAX[medication] || 100;
}

// ── Investigational / unapproved set ────────────────────────────────────────
export const INVESTIGATIONAL = (() => {
  const set = new Set();
  MEDICATION_CATALOGUE.forEach((m) => {
    const usStatus = m.approval?.US?.status;
    if (usStatus === "investigational" || usStatus === "unapproved" || usStatus === "discontinued") {
      set.add(m.generic_name);
      if (m.brand_names) m.brand_names.forEach((b) => set.add(b));
    }
  });
  return set;
})();

export function isInvestigational(medicationOrClass) {
  if (!medicationOrClass) return false;
  return INVESTIGATIONAL.has(medicationOrClass) || INVESTIGATIONAL.has(DRUG_CLASS[medicationOrClass]);
}

export function getDosingInterval(medication) {
  const generic = DRUG_CLASS[medication] || medication;
  return DOSING_INTERVAL_DAYS[generic] || null;
}

// ── Missed-dose rules (per generic, primary route) ─────────────────────────
export const MISSED_DOSE_RULES = (() => {
  const map = {};
  MEDICATION_CATALOGUE.forEach((m) => {
    if (!m.missed_dose) return;
    if (m.capability?.supports_missed_dose_guidance === false) return;
    const routes = Object.keys(m.missed_dose);
    for (const r of routes) {
      const rule = m.missed_dose[r];
      if (rule && typeof rule.advice === "string") {
        map[m.generic_name] = rule;
        break;
      }
    }
  });
  return map;
})();

export function getMissedDoseRule(medication) {
  const generic = DRUG_CLASS[medication] || medication;
  return MISSED_DOSE_RULES[generic] || null;
}

// ── Route helpers ─────────────────────────────────────────────────────────
export function getMedicationRoutes(medication) {
  const entry = NAME_TO_ENTRY[medication];
  return entry?.routes || [];
}

export function getPrimaryRoute(medication) {
  const routes = getMedicationRoutes(medication);
  return routes[0] || ROUTES.SC;
}

// ── Molecular class ────────────────────────────────────────────────────────
export function getMolecularClass(medication) {
  return NAME_TO_ENTRY[medication]?.molecular_class || null;
}

// ── Approval status ───────────────────────────────────────────────────────
export function getApprovalStatus(medication, jurisdiction = "US") {
  return NAME_TO_ENTRY[medication]?.approval?.[jurisdiction] || null;
}

// ── Returns the most relevant medication for a given day ───────────────────
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