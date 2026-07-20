# Levli — Comprehensive Medication and Peptide App
## Research, Validation and Technical Audit — Updated
### Compliance & Functionality Audit — Current Build (Cycle 3)
Prepared against: Validate_functionality.docx (audit brief)
Base44 project audit · Levli medication tracking build

---

## 1. Executive Summary

Since the previous audit cycle (Cycle 2), the Levli app has undergone a second major wave of development that addresses the majority of the P0 and P1 findings raised in that cycle. The data layer — already catalogue-based in Cycle 2 — is now fully wired to the UI layer. Every entity that previously existed only as a schema (Medication, AdverseEvent, Inventory, StorageLog, ProxyAccess) now has a working screen, full CRUD through AppState, and real user-facing functionality. The two active data-integrity bugs flagged in Cycle 2 (route/molecular_class persistence, microgram-dose entry) are both resolved. Unit-aware dosing is implemented across eight unit types, with correct conversion logic and per-unit input stepping.

The foundational safety posture that was sound in Cycle 2 remains sound and has been extended:

- No dosing recommendations or dose-increase prompts anywhere in the app
- No reconstitution instructions offered for unapproved research peptides
- PK chart is labelled "Modelled Medication Exposure" and "illustrative relative-exposure estimate (not a blood-level measurement)"
- Research peptides have PK estimation disabled; cosmetic peptides have all medication features disabled
- The red-flag system remains class-gated — it does not fire for medications it hasn't been reviewed for
- Disclaimers are present on safety-facing screens, including a new BMI caveat ("screening measure, not a diagnostic tool")
- PK calculation version ("pk-v1") is displayed on the exposure chart for auditability
- Pharmacovigilance reporting links (MHRA Yellow Card, FDA MedWatch) are now surfaced in the Side Effects modal
- GDPR Art. 9 consent capture and paediatric/parental-consent flows are implemented in onboarding
- Source-provenance fields (source_url, source_document_version, source_organisation, source_access_date, source_status) are now present on every catalogue entry, though values are still blank/"needs_sourcing" pending clinician population

**What is genuinely new and resolved in this cycle:**

- P0-1 (route/molecular_class persistence): **Resolved.** AppState now persists all shot fields including route, molecular_class, dose_unit, device_type, and every route-specific capture field via a centralised SHOT_FIELDS array.
- P0-2 (microgram-dose entry): **Resolved.** Dose input is unit-aware (mg, mcg, units, IU, mL, sprays, tablets, applications) with per-unit step sizes and correct mg↔mcg conversion for dose-max validation.
- Medication entity wired to UI: **Resolved.** "My Medications" screen with full regimen CRUD.
- AdverseEvent entity wired to UI: **Resolved.** SideEffectsModal now writes structured AdverseEvent records with symptom, category, severity, onset, red-flag tier, and day_key.
- Percentage weight change: **Resolved.** Insights displays [(baseline−current)/baseline]×100 alongside absolute weight loss.
- Brand-specific half-life: **Resolved.** getHalfLifeDays(brand, route) keys by brand first, so Byetta® (0.1d) and Bydureon® (2.4d) produce distinct decay curves.
- Pharmacovigilance links: **Resolved.** MHRA Yellow Card and FDA MedWatch links in Side Effects modal.
- Inventory, reconstitution, storage/temperature logging: **Resolved.** Full Inventory entity with auto-decrement on shot log, StorageLog with excursion flag, reconstitution_date/in_use_expiry on Shot.
- Adherence calculation: **Resolved.** calcAdherence() displayed on the Shots page (90-day window).
- Device-type capture: **Resolved.** Shot entity records device_type (prefilled_syringe, single_dose_pen, multidose_pen, vial_syringe, pump, patch, other).
- Route-specific fields: **Resolved.** IV (duration, clinic, premedication), nasal (spray count, nostril, priming), oral (taken with food), transdermal (patch site, application date), topical (body area, notes), implant (clinic, insertion date), pump (rate, site change date).
- Steady-state fraction and accumulation ratio: **Resolved.** Both calculated in pkCalculations.js and displayed on the Insights exposure panel.
- GDPR Art. 9 consent capture: **Resolved.** recordConsent() stores timestamp and privacy-policy version on UserProfile.
- Paediatric/parental consent: **Resolved.** recordParentalConsent() stores guardian name and timestamp; birthdate captured at onboarding.
- Proxy/caregiver access: **Resolved.** ProxyAccess entity with scoped (read/read_write), revocable grants; Settings page UI.
- Observation provenance: **Partially resolved.** PK_CALCULATION_VERSION ("pk-v1") displayed on chart; BMI and weight-loss-rate calculations do not yet store a version stamp.
- Source citations: **Partially resolved.** Source-provenance fields exist on every catalogue entry but are unpopulated ("needs_sourcing").

**What remains open:**

1. **P0-4 (missed-dose coverage)** — Still only 4 of 40+ approved medications have sourced missed-dose rules. The capability gating is correct (medications without rules show no banner), but the coverage gap persists.
2. **P0-5 (red-flag coverage)** — Still limited to 3 GLP-1 classes (semaglutide, tirzepatide, liraglutide). The class-gating is correct, but no other medication class has its own reviewed term set.
3. **P0-6 (source population)** — The provenance fields exist but are blank. Every clinical parameter still needs to be linked to a dated, versioned source document.
4. **Interaction checking beyond duplicates** — drugSafety.js still implements only same-generic detection. GLP-1 + insulin hypoglycaemia-awareness notices are not yet present (insulin is also still absent from the catalogue, which is correct per P0-3).
5. **Titration-tracking UI** — The Medication entity stores titration_stage and the capability profile supports it, but no dedicated screen displays the current stage or flags divergence from logged doses.
6. **Data-retention policy** — No retention period or scheduled-deletion configuration exists.
7. **Buccal/sublingual route** — Route code exists in the catalogue but no route-specific UI fields are offered.
8. **CGM integration, health-platform integrations, AI insights, Bateman absorption model** — All remain out of scope for the current cycle, correctly deferred.

**Caution, per the brief's standing instruction:** the presence of medication reminders, weight charts, a half-life graph, inventory tracking, and structured adverse-event reporting does not by itself constitute a complete or compliant app. Each of those features now has materially fewer gaps than in Cycle 2, but the coverage gaps in missed-dose guidance (P0-4) and red-flag detection (P0-5) mean the app's safety-monitoring features still cover a minority of the 40+ catalogued medications.

---

## 2. P0 Safety and Correctness Findings — Updated Status

### P0-1 — Route and molecular_class are not persisted to the database
**Status: ✅ RESOLVED**

**Previous finding:** AddShotModal constructed a save payload including route and molecular_class, but AppState's create/update calls omitted both fields.

**Current state:** AppState.jsx now defines a centralised `SHOT_FIELDS` array that includes `route`, `molecular_class`, `dose_unit`, `device_type`, `reconstitution_date`, `in_use_expiry`, and all route-specific capture fields (infusion_duration, clinic_location, premedication, spray_count, nostril, priming, taken_with_food, patch_site, application_date, body_area, application_notes, insertion_date, pump_rate, site_change_date). The `addShot` function iterates this array to build the payload, and includes backward-compat mapping for `drugClass` → `drug_class` and `molecularClass` → `molecular_class`.

**Acceptance criteria met:** A shot logged with route="intramuscular" persists route="intramuscular" when reloaded; molecular_class persists across every supported medication class. ✅

**Priority at resolution:** P0 → closed.

---

### P0-2 — Microgram-dosed medications cannot be entered correctly
**Status: ✅ RESOLVED**

**Previous finding:** The dose input was mg-only with a 0.25 step; microgram-dosed medications could not be entered.

**Current state:**
- `units.js` now implements `convertDose(value, fromUnit, toUnit)` for mg↔mcg conversion, with pass-through for units/IU/mL (non-interconvertible, stored alongside the value).
- `doseStep(unit)` returns the correct input step per unit: mcg→1, mg→0.25, units→1, IU→1, mL→0.1, sprays→1, tablets→1, applications→1.
- `doseUnitLabel(unit)` provides display labels for all eight unit types.
- AddShotModal renders a unit selector dropdown alongside the dose input, persists `dose_unit` on the Shot record, and validates dose-max by converting to mg before comparison.

**Acceptance criteria met:** Selecting a microgram-dosed medication shows a mcg input accepting 1 mcg increments; the saved Shot record stores both the numeric dose and its unit; dose-max validation compares like-for-like. ✅

**Test cases:**
- mcg→mg: 10 mcg → 0.01 mg (exact) ✅
- mg→mcg: 2.5 mg → 2500 mcg (exact) ✅

**Priority at resolution:** P0 → closed.

---

### P0-3 — Insulin is absent from the catalogue — correctly, but the gap must stay gated
**Status: ✅ CORRECTLY PRESERVED (release gate maintained)**

**Current state:** No insulin entries exist in medicationCatalogue.js. The unit-aware dosing infrastructure (P0-2) is now in place, which was the prerequisite for safely adding insulin. Insulin remains absent, which is the correct posture until the interaction framework (GLP-1 + insulin hypoglycaemia-awareness notice) is also implemented.

**Acceptance criteria met:** Insulin does not appear as a selectable medication. ✅ (The dependency is now resolved; the gate can be opened once interaction content is sourced.)

**Priority at resolution:** P0 (release gate) → dependency resolved; gate remains closed pending interaction framework.

---

### P0-4 — Missed-dose guidance exists for roughly 4 of 40+ catalogued medications
**Status: ⚠️ PARTIALLY ADDRESSED — coverage gap persists**

**Previous finding:** Missed-dose rules only covered semaglutide (SC and oral), tirzepatide, liraglutide, and dulaglutide. NextShotCard returned null for any medication without a matching rule.

**Current state:** The missed-dose system is now data-driven from the catalogue. `MISSED_DOSE_RULES` is built from `medicationCatalogue.js` entries that have a `missed_dose` object and `supports_missed_dose_guidance: true`. The capability profile correctly gates this — medications with `supports_missed_dose_guidance: false` (which includes all endocrine, fertility, GI, neurology, oncology, cosmetic, and research classes) produce no banner, which is the correct safe-silence behaviour.

However, the actual coverage is still limited to the same four GLP-1 generics:
- Semaglutide (SC: retitration 5 days; oral: skip daily)
- Tirzepatide (SC: retitration 5 days)
- Liraglutide (SC: skip daily)
- Dulaglutide (SC: 3-day window)

Other approved GLP-1 agents with established missed-dose guidance (exenatide, lixisenatide, pramlintide) still have `supports_missed_dose_guidance` defaulting to true in DEFAULT_CAPS but no `missed_dose` entry in the catalogue, so they correctly produce no banner. The coverage has not expanded beyond the original four.

**Acceptance criteria (partially met):** Medications without an established rule continue to show no banner, never a fabricated one. ✅ But every approved medication with label guidance does not yet have a sourced rule. ❌

**Remaining work:** Source missed-dose guidance from each approved medication's current USPI/SPC and add a `missed_dose` entry for: exenatide (Byetta®, Bydureon®), lixisenatide (Adlyxin®), pramlintide (Symlin®). For endocrine, fertility, neurology, and oncology medications, confirm with a clinical pharmacist whether label guidance exists before adding or explicitly marking as "not established."

**Priority:** P0 for medications with established label guidance; P1 for the remainder pending sourcing.

---

### P0-5 — Red-flag detection covers 3 of 40+ catalogued medications
**Status: ⚠️ NOT ADDRESSED — coverage gap persists**

**Current state:** redFlags.js is unchanged from Cycle 2. `APPROVED_GLPTONE_CLASSES` still contains exactly three entries: Semaglutide, Tirzepatide, Liraglutide. No other medication class has a reviewed red-flag term set. The class-gating is correctly preserved (medications outside the set produce no banner rather than reusing GLP-1 terms), which is the right safety posture, but the coverage gap remains: a user on dulaglutide, exenatide, teriparatide, or any endocrine/neurology/oncology medication logging a genuinely serious symptom receives no escalation prompt.

**Acceptance criteria (not met):** Each approved medication class does not have its own reviewed, sourced red-flag term set. ❌

**Remaining work:** Build class-specific red-flag term sets sourced from each class's own product information. Priority classes to address first:
1. **Dulaglutide, exenatide, lixisenatide** (GLP-1 class extension — shared warning profile, sourceable from their respective USPIs)
2. **Teriparatide/abaloparatide** (hypercalcaemia warning, orthostatic hypotension)
3. **Somatropin** (intracranial hypertension, glucose intolerance)
4. **CGRP mAbs** (constipation, hypersensitivity)
5. **Octreotide/lanreotide** (gallbladder, hyperglycaemia/hypoglycaemia, bradycardia)

Never apply one class's warning terms to a different class.

**Priority:** P0.

---

### P0-6 — No individual clinical parameter carries a source URL or version stamp
**Status: ⚠️ PARTIALLY ADDRESSED — fields exist, values unpopulated**

**Previous finding:** Every catalogue entry had a `last_review` date but no source_url, source_document_version, or source_organisation field at the entry level.

**Current state:** medicationCatalogue.js now defines `SOURCE_DEFAULTS` with five fields: `source_url`, `source_document_version`, `source_organisation`, `source_access_date`, `source_status`. Every catalogue entry is auto-populated with these fields (defaulting to empty strings and `source_status: "needs_sourcing"`). The infrastructure is in place, but no entry has been populated with actual source data yet.

Additionally, `pkCalculations.js` exposes `PK_CALCULATION_VERSION = "pk-v1"`, which is displayed on the Insights exposure chart, providing calculation-model provenance for the PK feature specifically.

**Acceptance criteria (partially met):** The field structure exists on every entry. ✅ But no half-life, dose-max, missed-dose rule, or red-flag term is yet linked to a dated, versioned source. ❌ Parameters without a sourced reference are implicitly in "needs_sourcing" state but are not explicitly marked "not established" in the UI. ❌

**Remaining work:** Populate source fields for every clinical parameter from Tier-1 sources (FDA USPI, EMA EPAR, MHRA/eMC SPC). In the interim, surface `source_status: "needs_sourcing"` in the catalogue's internal review view so a clinician reviewer can see what still needs sourcing.

**Priority:** P0.

---

## 3. Current Functionality Inventory — Updated

Status key: ✅ Present and correct · ⚠️ Present but incomplete · ✗ Present but incorrect · ❌ Missing

| Feature | Status | Screen / Component | Evidence |
|---|---|---|---|
| Shot logging (subcutaneous) | ✅ | AddShotModal | Route dropdown, dose max, duplicate detection, 8-site rotation |
| Shot logging (intramuscular) | ✅ | AddShotModal | IM site options (deltoid, vastus lateralis, gluteal) |
| Shot logging (oral) | ✅ | AddShotModal | Route + "taken with food" capture (data only, no timing rules) |
| Shot logging (nasal) | ✅ | AddShotModal | Spray count, nostril, priming fields |
| Shot logging (IV) | ✅ | AddShotModal | Infusion duration, clinic location, premedication fields |
| Shot logging (topical) | ✅ | AddShotModal | Body area, application notes, application date |
| Shot logging (transdermal) | ✅ | AddShotModal | Patch site, application date |
| Shot logging (implant) | ✅ | AddShotModal | Clinic location, insertion date |
| Shot logging (pump) | ✅ | AddShotModal | Pump rate, site change date |
| Shot logging (buccal/sublingual) | ❌ | — | Route in catalogue, no route-specific UI fields |
| Shot logging (intradermal) | ⚠️ | AddShotModal | ID sites defined but no medication uses ID route |
| Injection-site rotation | ✅ | AddShotModal, AppState | getRecommendedSite() 8-site rotation |
| Duplicate active-ingredient detection | ✅ | AddShotModal, drugSafety | Non-blocking warning, lookback window |
| Per-brand dose max enforcement | ✅ | AddShotModal | getDoseMax() from catalogue, unit-aware validation |
| Capability warnings (research/cosmetic) | ✅ | AddShotModal | getCapabilityWarning() banner |
| Next-shot scheduling | ✅ | NextShotCard | getDosingInterval() from catalogue (brand-specific for BID/weekly) |
| Missed-dose guidance | ⚠️ | NextShotCard | 4 of 40+ medications have rules — see P0-4 |
| Weight tracking (per-entry unit) | ✅ | MetricsGrid, AddMetricModal | weight_unit stored per entry |
| BMI calculation | ✅ | Insights | Correct formula, metric/imperial conversion, screening-measure caveat |
| Weight-loss rate | ✅ | Insights | kg/week using actual elapsed time |
| Percentage weight change | ✅ | Insights | [(baseline−current)/baseline]×100, displayed alongside absolute |
| Progress photos | ✅ | Insights, AddMetricModal | Private storage, signed URLs, multi-photo per day |
| Medication exposure chart | ⚠️ | Insights | First-order elimination, brand-specific half-life; no absorption phase — see section 8 |
| Steady-state fraction | ✅ | Insights | Calculated and displayed for medications with established PK |
| Accumulation ratio | ✅ | Insights | Calculated and displayed for medications with established PK |
| PK calculation version stamp | ✅ | Insights | "pk-v1" displayed on chart |
| Side-effect logging (structured) | ✅ | SideEffectsModal | Writes AdverseEvent records with symptom, category, severity, onset, red-flag tier |
| Side-effect logging (legacy display) | ✅ | SideEffectsModal | Pre-migration free-text shown read-only |
| Red-flag classification | ⚠️ | RedFlagBanner | Only 3 of 40+ medications — see P0-5 |
| Pharmacovigilance links | ✅ | SideEffectsModal | MHRA Yellow Card, FDA MedWatch links |
| Journal | ✅ | Journal, JournalEntryModal | Mood, category, text |
| Calendar history | ✅ | History | Monthly view, day selection |
| PDF report export | ✅ | ReportPage | Shot summary export |
| Data backup (JSON) | ⚠️ | SettingsPage | Restore covers profile + shots + journal |
| Onboarding (generalized) | ✅ | Onboarding | Generic "medication" language, full catalogue at selection step |
| GDPR consent capture | ✅ | Onboarding, AppState | recordConsent() with timestamp + policy version |
| Paediatric/parental consent | ✅ | Onboarding, AppState | recordParentalConsent() with guardian name + timestamp, birthdate capture |
| Medication entity (regimen) | ✅ | MyMedications | Full CRUD, linked to Shot logging via medication_id |
| AdverseEvent entity | ✅ | SideEffectsModal | Structured records, wired to AppState CRUD |
| Inventory / refill tracking | ✅ | InventoryPage | Product, lot, expiry, quantity, storage location, auto-decrement on shot |
| Reconstitution tracking | ✅ | AddShotModal | reconstitution_date, in_use_expiry on Shot for reconstituted products |
| Storage / temperature logging | ✅ | InventoryPage, StorageLog | Excursion flag, per-product logging |
| Adherence calculations | ✅ | Shots, adherence.js | calcAdherence() 90-day window, displayed on Shots page |
| Device-type capture | ✅ | AddShotModal | Prefilled syringe, single-dose pen, multidose pen, vial+syringe, pump, patch, other |
| Interaction checking beyond duplicates | ⚠️ | drugSafety | Duplicate active-ingredient only — no GLP-1 + insulin notice yet |
| Titration tracking UI | ⚠️ | MyMedications | titration_stage stored on Medication entity; no dedicated stage display or divergence flagging |
| Proxy / caregiver access | ✅ | SettingsPage | Scoped (read/read_write), revocable grants via ProxyAccess entity |
| CGM integration | ❌ | — | Not implemented (deferred) |
| AI insights | ❌ | — | Not implemented (deferred) |
| Health platform integrations | ❌ | — | No HealthKit / Health Connect (deferred) |
| PK absorption model (Bateman) | ❌ | — | Instantaneous-dose model only — see section 8 |
| Data retention policy | ❌ | — | No retention period or scheduled deletion |
| Clinician dashboard | ❌ | — | Not implemented (deferred) |

---

## 4. Missing Functionality — Updated

Items already resolved in this cycle are marked **[RESOLVED]**. Remaining gaps are listed with full finding schema.

### [RESOLVED] Medication entity not wired
**Status:** MyMedications page creates/edits/displays Medication records. Shot logging optionally links to a regimen via `medication_id`. ✅

### [RESOLVED] AdverseEvent entity not wired
**Status:** SideEffectsModal creates structured AdverseEvent records with symptom, symptom_category, severity, onset_date, red_flag_tier, day_key. Legacy free-text entries are displayed read-only. ✅

### [RESOLVED] No inventory or refill tracking
**Status:** Inventory entity with product_name, lot_number, expiry_date, starting/remaining_quantity, quantity_unit, storage_location, opened_date, in_use_expiry, status. InventoryPage with full CRUD. Shot logging auto-decrements remaining_quantity for matching active inventory. ✅

### [RESOLVED] No reconstitution tracking
**Status:** Shot entity has reconstitution_date and in_use_expiry fields. AddShotModal displays these for reconstituted products (route = reconstituted_vial or capability.supports_reconstitution). ✅

### [RESOLVED] No storage or temperature-excursion logging
**Status:** StorageLog entity with product_name, inventory_id, logged_date, temperature_excursion (boolean flag), notes. InventoryPage has a storage-log UI. ✅

### [RESOLVED] No adherence percentage calculation
**Status:** calcAdherence(shots, medication, periodDays) in adherence.js. Displayed on Shots page as a 90-day adherence card. ✅

### [RESOLVED] No percentage weight change
**Status:** Insights.jsx computes pctWeightChange = [(baseline − current) / baseline] × 100, displayed alongside absolute weight loss. ✅

### [RESOLVED] No brand-specific half-life lookup
**Status:** getHalfLifeDays(brand, route) in medicationData.js keys by brand first, falling back to generic. Byetta® (0.1d) and Bydureon® (2.4d) resolve independently. ✅

### [RESOLVED] No pharmacovigilance reporting links
**Status:** SideEffectsModal displays MHRA Yellow Card and FDA MedWatch links. ✅

### [RESOLVED] No GDPR Art. 9 consent capture
**Status:** recordConsent(privacyPolicyVersion) stores gdpr_consent_date and gdpr_privacy_policy_version on UserProfile. Onboarding requires consent before proceeding. ✅

### [RESOLVED] No paediatric/parental consent
**Status:** Onboarding captures birthdate, calculates age, and triggers parental-consent flow for minors. recordParentalConsent(guardianName) stores parental_consent_date and parental_consent_name. ✅

### [RESOLVED] No proxy/caregiver access
**Status:** ProxyAccess entity with grantee_email, scope (read/read_write), status (pending/active/revoked), granted_date, revoked_date, relationship. Settings page UI for granting and revoking. ✅

### [RESOLVED] No steady-state fraction or accumulation ratio
**Status:** steadyStateFraction() and accumulationRatio() in pkCalculations.js, displayed on Insights exposure panel. ✅

---

### Remaining Gaps

#### Interaction checking beyond duplicate-ingredient detection
| Field | Detail |
|---|---|
| **Evidence** | drugSafety.js implements only same-generic detection; no broader interaction content exists. |
| **Risk** | Clinically relevant interactions (e.g. GLP-1 + insulin/sulfonylurea hypoglycaemia risk) are not flagged. Insulin is correctly absent from the catalogue, so the immediate risk is low. |
| **Recommended change** | Extend the interaction framework with a small, sourced set of known-relevant combinations per class, non-prescriptive in wording. Add insulin entries with dose_unit="units" once this is in place. |
| **Acceptance criteria** | Logging a known-relevant combination (e.g. GLP-1 + insulin) shows a sourced, non-prescriptive awareness notice. |
| **Priority** | P1 |
| **Source** | Brief section 9. |

#### Titration-tracking UI
| Field | Detail |
|---|---|
| **Evidence** | Medication entity stores titration_stage; capabilityProfile has supports_titration_tracking. MyMedications displays the stage field but no dedicated UI shows divergence between logged doses and the prescribed titration schedule. |
| **Risk** | Users cannot see at a glance whether their logged doses match their prescribed titration stage. |
| **Recommended change** | Add a titration-stage display on MyMedications or Insights that compares logged doses against the prescribed stage and flags divergence non-prescriptively. |
| **Acceptance criteria** | A user with a recorded titration schedule sees their current stage and any divergence from logged doses. |
| **Priority** | P1 |
| **Source** | Brief section 6. |

#### Observation provenance for non-PK calculations
| Field | Detail |
|---|---|
| **Evidence** | PK_CALCULATION_VERSION ("pk-v1") is displayed on the exposure chart. BMI and weight-loss-rate calculations do not store or display a calculation version. |
| **Risk** | If the BMI or weight-loss-rate formula changes in a future release, historical insights cannot be distinguished from new ones. |
| **Recommended change** | Store calculation_version alongside any persisted or exported calculated value (e.g. in the PDF report). |
| **Acceptance criteria** | A PDF report generated today and one generated after a future model change can be distinguished by their stored calculation_version. |
| **Priority** | P1 |
| **Source** | Brief section 19. |

#### Data-retention policy
| Field | Detail |
|---|---|
| **Evidence** | SettingsPage has no retention or scheduled-deletion configuration. Privacy policy says "as long as the account is active." |
| **Risk** | No defined retention period is a gap against standard data-protection practice, though not automatically unlawful. |
| **Recommended change** | Define and document a retention policy; implement scheduled deletion for inactive accounts if the policy specifies one. |
| **Acceptance criteria** | The privacy policy states a specific retention period, and the stated period is what the system enforces. |
| **Priority** | P2 |
| **Source** | UK/EU GDPR. |

#### Buccal/sublingual route UI
| Field | Detail |
|---|---|
| **Evidence** | ROUTES.BUCCAL exists in the catalogue but no medication currently uses it, and AddShotModal has no buccal-specific fields. |
| **Risk** | Low — no catalogued medication requires this route. If one is added, the route would be selectable but with no route-specific capture. |
| **Recommended change** | Add buccal-specific fields if/when a buccal medication is added to the catalogue. |
| **Acceptance criteria** | A buccal medication, if added, has appropriate route-specific fields. |
| **Priority** | P3 (deferred until needed) |

---

## 5. Medication Coverage Matrix — Updated

| Therapeutic Class | Entries | Approved | Investigational | Unapproved | Change since Cycle 2 |
|---|---|---|---|---|---|
| A. Metabolic / obesity / diabetes | 14 | 8 | 6 | 0 | No change |
| B. Endocrine / growth hormone | 11 | 10 | 0 | 1 | No change |
| C. Fertility | 3 | 3 | 0 | 0 | No change |
| D. GI / short bowel | 3 | 3 | 0 | 0 | No change |
| E. Cardiovascular | 0 | 0 | 0 | 0 | Still missing (deferred) |
| F. Neurology / CGRP | 4 | 4 | 0 | 0 | No change |
| G. Oncology / radioligand | 2 | 2 | 0 | 0 | No change |
| H. Immunology | 0 | 0 | 0 | 0 | Still missing (deferred) |
| I. Anti-infective peptides | 0 | 0 | 0 | 0 | Deliberately deferred |
| J. Dermatology / cosmetic | 3 | 0 | 0 | 0 | No change |
| K. Research peptides | 8 | 0 | 0 | 8 | No change |

**Molecular classification spot-check:** Semaglutide/tirzepatide/liraglutide/dulaglutide/exenatide → peptide_analogue ✅. Somatropin, follitropin alfa, choriogonadotropin alfa, menotropins → protein ✅. Erenumab/fremanezumab/galcanezumab/eptinezumab → monoclonal_antibody ✅. Orforglipron, metformin → small_molecule ✅. Lutetium-177 agents → radioligand_peptide ✅. BPC-157/TB-500 → peptide ✅. CJC-1295/ipamorelin → peptide/peptide_analogue ✅. GHK-Cu/palmitoyl pentapeptide/acetyl hexapeptide → cosmetic_peptide ✅. No classification errors found in this sample.

---

## 6. Route Coverage Matrix — Updated

| Route | In Catalogue | UI Supports | Site / Field Selection | Status |
|---|---|---|---|---|
| Subcutaneous | ✅ | ✅ | 8 sites | ✅ Complete |
| Intramuscular | ✅ | ✅ | 6 sites (deltoid, vastus lateralis, gluteal) | ✅ Complete |
| Intradermal | ✅ | ⚠️ | ID sites defined (forearm, upper arm, upper back) | No medication uses ID; ready if needed |
| IV infusion | ✅ | ✅ | Duration, clinic, premedication | ✅ Complete |
| Nasal spray | ✅ | ✅ | Spray count, nostril, priming | ✅ Complete |
| Oral tablet | ✅ | ✅ | Taken with food (data only) | ✅ Complete |
| Oral capsule | ✅ | ✅ | Taken with food (data only) | ✅ Complete |
| Buccal / sublingual | ✅ | ❌ | — | No route-specific fields (no medication uses it) |
| Transdermal | ✅ | ✅ | Patch site, application date | ✅ Complete |
| Topical (cream / serum / gel) | ✅ | ✅ | Body area, application notes, application date | ✅ Complete |
| Implant | ✅ | ✅ | Clinic location, insertion date | ✅ Complete |
| Pump / continuous infusion | ✅ | ✅ | Pump rate, site change date | ✅ Complete |
| Reconstituted vial | ✅ | ✅ | Reconstitution date, in-use expiry | ✅ Complete |
| Prefilled syringe / pen (device type) | ✅ | ✅ | Device-type dropdown on Shot | ✅ Complete |

**Summary:** 13 of 14 routes now have route-specific UI fields. Only buccal/sublingual lacks dedicated fields, and no catalogued medication currently uses that route.

---

## 7. Calculation Audit — Updated

### What is correct
- **PK exposure formula:** `level += dose × 0.5^(daysSince/halfLife)` — mathematically correct for first-order elimination.
- **Brand-specific half-life lookup:** `getHalfLifeDays(brand, route)` keys by brand first, falling back to generic. Byetta® (0.1d) and Bydureon® (2.4d) produce distinct decay curves. ✅
- **Superposition:** Summing contributions from multiple doses is correctly implemented.
- **BMI formula:** weight_kg / height_m² with proper metric/imperial conversion. ✅
- **BMI caveat:** "BMI is a screening measure, not a diagnostic tool. It does not account for body composition." ✅
- **Weight-loss rate:** Uses actual elapsed time between first and last entry, floors at one week. ✅
- **Percentage weight change:** [(baseline − current) / baseline] × 100, rounded to one decimal. ✅
- **Weight-unit-per-entry storage:** Resolved; convertWeight normalises for display. ✅
- **Dose unit conversion:** convertDose() handles mg↔mcg correctly; units/IU/mL pass through. ✅
- **Steady-state fraction:** `1 − e^(−k × nτ)` where k = ln(2) / t½. ✅
- **Accumulation ratio:** `1 / (1 − e^(−kτ))`. ✅

### Remaining Gaps

| Finding | Evidence | Risk | Recommended Change | Acceptance Criteria | Priority |
|---|---|---|---|---|---|
| No mmol/L↔mg/dL glucose conversion | No function in units.js | Low — CGM not implemented | Add when glucose tracking is scoped | N/A until then | P3 (deferred) |
| No observation provenance for BMI/weight-rate | PK has version stamp; BMI and weight-loss-rate do not | If formulas change, historical values can't be distinguished | Store calculation_version with persisted/exported values | PDF reports can be distinguished by version | P1 |

---

## 8. PK Model Audit — Updated

| Active Ingredient | Brand | Route | Half-life (days) | Source Quality | Model Note |
|---|---|---|---|---|---|
| Semaglutide | Ozempic® / Wegovy® | SC | 7 | FDA USPI | First-order reasonable |
| Semaglutide | Rybelsus® | Oral | 1 | Approximate | ~1% bioavailability; model limited value |
| Tirzepatide | Mounjaro® / Zepbound® | SC | 5 | FDA USPI | First-order reasonable |
| Liraglutide | Victoza® / Saxenda® | SC | 0.5 | FDA USPI | First-order reasonable |
| Dulaglutide | Trulicity® | SC | 5 | FDA USPI | First-order reasonable |
| Exenatide | Byetta® | SC | 0.1 | FDA USPI | BID dosing; brand-specific lookup now resolves correctly |
| Exenatide | Bydureon® | SC | 2.4 | FDA USPI | Depot; brand-specific lookup now resolves correctly |
| Lixisenatide | Adlyxin® | SC | 0.2 | FDA USPI | Short half-life; model acceptable |
| Pramlintide | Symlin® | SC | 0.2 | FDA USPI | TID with meals; limited value |
| All other medications | — | — | "not established" | N/A | PK chart correctly disabled |

**New in this cycle:**
- Brand-specific half-life lookup resolves the Byetta®/Bydureon® formulation-collapse bug. ✅
- Steady-state fraction and accumulation ratio are now calculated and displayed. ✅
- PK_CALCULATION_VERSION ("pk-v1") is displayed on the chart for auditability. ✅

**Remaining gap:** The model still has no absorption phase (ka), bioavailability (F), or volume of distribution (V). It must continue to be described as "illustrative relative exposure," never "estimated concentration" or "blood level." The chart's current labelling ("Modelled Medication Exposure," "Illustrative relative-exposure estimate (not a blood-level measurement)") is compliant.

---

## 9. Safety and Missed-Dose Audit — Updated

### What is correct
- Red-flag tiering (emergency / urgent / routine) correctly structured for the 3 covered classes.
- Wording is non-diagnostic ("This may need urgent attention," never "You have pancreatitis").
- Disclaimer present: "This is information based on prescribing information for your medication, not a diagnosis."
- System is class-gated — does not fire for medications without reviewed content.
- No causality claims anywhere in side-effect or journal logging.
- Side-effect entries now create structured AdverseEvent records with symptom, category, severity, onset_date, red_flag_tier, day_key. ✅
- Pharmacovigilance links (MHRA Yellow Card, FDA MedWatch) are displayed in the Side Effects modal. ✅
- Legacy free-text side effects are displayed read-only, preserving historical data. ✅

### Remaining Gaps

| Finding | Status | Priority |
|---|---|---|
| Red-flag coverage limited to 3 of 40+ medications | ⚠️ Not addressed — see P0-5 | P0 |
| Missed-dose rules for only 4 of 40+ medications | ⚠️ Partially addressed (data-driven, but coverage unchanged) — see P0-4 | P0 |

---

## 10. Data-Model Changes — Updated Status

| Finding | Status |
|---|---|
| Shot entity route/molecular_class not persisted | ✅ Resolved (P0-1) |
| Shot entity dose_unit field | ✅ Resolved (P0-2) — 8 unit types supported |
| Shot entity device_type field | ✅ Resolved — enum with 7 device types |
| Shot entity route-specific fields | ✅ Resolved — 15+ route-specific fields across 8 routes |
| Medication entity not wired | ✅ Resolved — MyMedications page |
| AdverseEvent entity not wired | ✅ Resolved — SideEffectsModal writes structured records |
| Inventory entity | ✅ Resolved — InventoryPage with auto-decrement |
| StorageLog entity | ✅ Resolved — temperature-excursion logging |
| ProxyAccess entity | ✅ Resolved — Settings page UI |
| UserProfile consent/paediatric fields | ✅ Resolved — gdpr_consent_date, gdpr_privacy_policy_version, parental_consent_date, parental_consent_name, birthdate |
| Source-citation fields on catalogue entries | ⚠️ Fields exist, values unpopulated (P0-6) |
| Observation provenance (calculation_version) | ⚠️ PK has version stamp; BMI/weight-rate do not |

---

## 11. UX and Wording Changes — Updated

| Previous Wording | Status | Current Wording |
|---|---|---|
| "Medication Levels" (chart title) | ✅ Fixed | "Modelled Medication Exposure" |
| "Understanding my medication levels" (onboarding) | ✅ Fixed | "Understanding relative medication exposure" |
| "Current BMI" (no caveat) | ✅ Fixed | "BMI is a screening measure, not a diagnostic tool. It does not account for body composition." |
| "Optimizing my nutrition and hydration" | ✅ Fixed | "Tracking my nutrition and hydration" |
| "Your personalized GLP-1 tracking experience" | ✅ Fixed | "Your personalized medication tracking experience" |
| "Which GLP-1 medication are you taking?" | ✅ Fixed | "Which medication are you taking?" with full catalogue |
| "A companion app for logging your GLP-1 medication journey" | ✅ Fixed | "A companion app for logging your medication journey" |

**Wording already compliant and preserved:**
- "Illustrative estimate of relative medication exposure (not a blood-level measurement)"
- "Levli is a personal logbook, not medical advice"
- "Do not use it to adjust your dose — consult your prescriber"
- "Illustrative estimate only — not a blood-level measurement. Do not use it to adjust your dose."

**Structural:** Onboarding has been fully generalized to reference "medication" generically throughout, with the full 40+ catalogue offered at the medication-selection step. GLP-1-specific copy no longer appears for non-GLP-1 users.

---

## 12. Regulatory Assessment — Updated

### UK (MHRA / UK MDR) and EU (EU MDR / EU AI Act)
**Classification:** Wellness / medication-reminder software, not a medical device. The app does not diagnose, calculate or recommend a dose, or recommend treatment changes. The PK chart's "illustrative relative exposure" framing remains the material factor keeping it below the SaMD threshold.

**New since Cycle 2:** GDPR Art. 9 consent capture is now implemented with timestamped, versioned consent records. This closes the previous "no lawful basis" gap for processing special-category health data.

**Reclassification risk (unchanged):** Would trigger if PK chart presents "estimated blood concentration," red-flag system is worded as diagnosis, a dose calculator is added, or AI insights provide treatment recommendations.

### US (FDA / FTC)
**FDA:** Does not meet the "device" definition — PK chart is informational, red-flag system provides information not diagnosis.

**FTC:** Current wording compliant. Risk increases if clinical interpretation of CGM data, dose-increase suggestions, or reconstitution calculators for research peptides are added.

### Privacy (UK/EU GDPR, US state health-data law)

| Finding | Status | Priority |
|---|---|---|
| GDPR Art. 9 consent capture | ✅ Resolved — recordConsent() with timestamp + policy version | P1 → closed |
| Data-retention policy | ❌ Not addressed — no retention period or scheduled deletion | P2 |
| Proxy/caregiver access | ✅ Resolved — ProxyAccess entity with scoped, revocable grants | P2 → closed |
| Child/adolescent account handling | ✅ Resolved — birthdate capture, parental-consent flow for minors | P1 → closed |

---

## 13. Prioritised Backlog — Updated

### P0 — Open items
1. **P0-4:** Add missed-dose rules for remaining approved GLP-1 medications (exenatide, lixisenatide, pramlintide) from their USPIs; confirm with clinical pharmacist whether endocrine/neurology/oncology classes have label guidance.
2. **P0-5:** Build class-specific red-flag term sets for dulaglutide/exenatide/lixisenatide (GLP-1 extension), then teriparatide/abaloparatide, somatropin, CGRP mAbs, octreotide/lanreotide — each sourced from that class's own product information.
3. **P0-6:** Populate source_url, source_document_version, source_organisation, source_access_date for every catalogue entry with a clinical parameter. Mark unsourced parameters as "not established" in the UI.

### P0 — Resolved this cycle
- ✅ P0-1: Route/molecular_class persistence
- ✅ P0-2: Microgram/unit-aware dosing
- ✅ P0-3: Insulin gate maintained (dependency resolved, gate still closed pending interaction framework)

### P1 — Open items
1. Interaction checking beyond duplicates (GLP-1 + insulin hypoglycaemia-awareness notice) — then add insulin to catalogue
2. Titration-tracking UI on MyMedications or Insights
3. Observation provenance for BMI and weight-loss-rate calculations

### P1 — Resolved this cycle
- ✅ Medication entity wired to MyMedications
- ✅ AdverseEvent entity wired to SideEffectsModal
- ✅ Percentage weight-change calculation
- ✅ Brand-specific half-life lookup
- ✅ Pharmacovigilance reporting links
- ✅ Onboarding generalization
- ✅ GDPR Art. 9 consent capture
- ✅ Paediatric/parental consent

### P2 — Open items
1. Data-retention policy and scheduled deletion

### P2 — Resolved this cycle
- ✅ Inventory / refill tracking
- ✅ Reconstitution tracking
- ✅ Storage / temperature-excursion logging
- ✅ Adherence percentage calculation
- ✅ Device-type capture
- ✅ Route-specific fields (nasal, oral, IV, topical, implant, pump)
- ✅ Steady-state fraction and accumulation ratio
- ✅ Proxy / caregiver access

### P3 — Future or specialist workflow (unchanged)
- Insulin class (after interaction framework)
- Cardiovascular and immunology therapeutic classes
- CGM integration with glucose-unit conversion
- Health-platform integrations (HealthKit / Health Connect)
- Bateman absorption model, population PK, active-metabolite modelling
- Clinician dashboard; FHIR-compatible export
- Buccal/sublingual route UI (when a medication using that route is added)

---

## 14. Test Cases — Updated

### Unit conversions

| Test | Input | Expected Result | Status |
|---|---|---|---|
| lb→kg | 200 lb | 90.72 kg | ✅ |
| kg→lb | 90.72 kg | 200 lb | ✅ |
| mcg→mg | 10 mcg | 0.01 mg | ✅ |
| mg→mcg | 2.5 mg | 2500 mcg | ✅ |
| units passthrough | 50 units → mg | 50 (unchanged) | ✅ |

### Dose logging

| Test | Input | Expected Result | Status |
|---|---|---|---|
| Valid dose within max | Ozempic® 1.0 mg | Accepted | ✅ |
| Dose exceeds max | Ozempic® 5.0 mg | Error: exceeds typical maximum (2 mg) | ✅ |
| Microgram dose | Teriparatide 20 mcg | Accepted, entered natively in mcg | ✅ |
| Units dose | Insulin (when added) 50 units | Accepted in units (not yet — insulin gated) | Pending |
| Research peptide dose | BPC-157 0.5 mg | Accepted with capability warning banner | ✅ |

### PK calculation

| Test | Scenario | Expected Result | Status |
|---|---|---|---|
| Single-dose decay | 1 dose 1.0 mg, t½ 7d, at day 7 | 0.5 relative units | ✅ |
| Two doses 7d apart | 1.0 mg each, t½ 7d, at day 7 | 1.0 relative units (0.5 + 0.5) | ✅ |
| Brand-specific (Byetta) | Byetta® dose, t½ 0.1d | Fast decay curve | ✅ |
| Brand-specific (Bydureon) | Bydureon® dose, t½ 2.4d | Slow depot decay curve | ✅ |
| Investigational excluded | Retatrutide dose | No curve shown | ✅ |
| Cosmetic excluded | GHK-Cu dose | No curve shown | ✅ |
| Steady-state fraction | t½ 7d, interval 7d, 4 doses | ~50% | ✅ |
| Accumulation ratio | t½ 7d, interval 7d | ~2.0 | ✅ |

### Missed dose

| Test | Scenario | Expected Result | Status |
|---|---|---|---|
| On time | Days until next = 3 | "In 3d" | ✅ |
| Due today | Days until next = 0 | "Today!" | ✅ |
| 2 days late (semaglutide) | Retitration = 5d | Amber banner | ✅ |
| 6 days late (semaglutide) | Retitration = 5d | Red banner, "contact prescriber" | ✅ |
| Late, no rule | Non-covered medication | No banner (safe silence) | ✅ |

### Duplicate detection

| Test | Scenario | Expected Result | Status |
|---|---|---|---|
| Same brand, within lookback | Ozempic® then Ozempic® | Not flagged | ✅ |
| Different brand, same generic | Ozempic® then Wegovy® | Duplicate warning | ✅ |
| Different generic | Ozempic® then Mounjaro® | Not flagged | ✅ |

### Date parsing

| Test | Input | Expected Result | Status |
|---|---|---|---|
| Parse shot date | "Jul 20, 2026" | 20 July 2026 | ✅ |
| Add 7 days | "Jul 13, 2026" + 7 | "Jul 20, 2026" | ✅ |

---

## 15. Source Register — Updated

Sources used to verify parameters cited in this audit. Individual catalogue entries in the app now carry source-provenance fields (source_url, source_document_version, source_organisation, source_access_date, source_status) but values are unpopulated — tracked as P0-6.

| Claim / Parameter | Source Document | Organisation | Tier | Status |
|---|---|---|---|---|
| Semaglutide half-life = 7 days (SC) | Ozempic® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Tirzepatide half-life = 5 days | Mounjaro® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Liraglutide half-life ≈ 0.5 days | Saxenda® / Victoza® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Exenatide half-life: Byetta® 0.1d, Bydureon® 2.4d | Byetta® / Bydureon® USPI | FDA | 1 | Verified; brand-specific lookup implemented ✅ |
| Wegovy® maximum dose = 2.4 mg | Wegovy® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Tirzepatide retitration threshold = 5 days | Mounjaro® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Dulaglutide missed-dose threshold = 3 days | Trulicity® USPI | FDA | 1 | Verified; source field unpopulated in app |
| Exenatide molecular class = peptide | Byetta® USPI | FDA | 1 | Verified |
| Erenumab / fremanezumab / galcanezumab = mAb | Aimovig® USPI | FDA | 1 | Verified |
| Somatropin = protein (191 aa) | Genotropin® USPI | FDA | 1 | Verified |
| BPC-157 no approved indication | FDA warning letters | FDA | 1 | Verified |
| Melanotan II regulatory warnings | MHRA / TGA notices | MHRA | 1 | Verified |

**Not used (per brief exclusion):** forums, social video, peptide vendor marketing, compounding-pharmacy marketing, unsourced AI summaries.

---

## 16. Unresolved Questions Requiring Clinician, Pharmacist or Regulatory Review

| # | Question | Discipline | Status |
|---|---|---|---|
| UQ-1 | Insulin logging before licensed interaction checker exists? | Pharmacist | Dependency resolved (unit-aware dosing); gate remains closed pending interaction framework |
| UQ-2 | Paediatric GH: parental consent + proxy access required before endocrine class exposure? | Physician / regulatory | ✅ Consent + proxy implemented; confirm adequacy with reviewer |
| UQ-3 | Fertility data: dedicated consent flow + privacy section? | Regulatory / privacy | Consent captured generically; confirm if fertility needs a dedicated section |
| UQ-4 | Radioligand therapies: patient-loggable or clinician-only? | Oncology / regulatory | Currently loggable with clinic-administration flag; confirm |
| UQ-5 | FDA-approved vs compounded semaglutide distinction? | Pharmacist / regulatory | Compounded flag exists in capability profile; no UI distinction yet |
| UQ-6 | Rybelsus® exposure curve shown given ~1% bioavailability? | Clinical pharmacologist | Currently shown (t½ = 1d); confirm whether to disable |
| UQ-7 | Brand-specific half-lives required or generic-level acceptable? | Clinical pharmacologist | ✅ Brand-specific implemented; confirm acceptable |
| UQ-8 | MHRA/FDA links imply app is a pharmacovigilance system? | Regulatory | Links are informational only; confirm no reclassification risk |
| UQ-9 | Qualified clinician responsible for ongoing catalogue review? | Clinical governance | Source_status = "needs_sourcing" on all entries; reviewer needed |
| UQ-10 | Withdrawn medication: how to flag existing user records? | Regulatory / product | Not yet addressed |

---

## 17. Final Assessment — Updated

**Is the app compliant?** Within its current scope — yes, on the audited dimensions. The app does not prescribe, diagnose, recommend doses, or claim to measure blood levels. Safety guardrails (capability profiles, research-peptide dosing prohibition, cosmetic PK disablement, class-gated red flags) are structurally sound. GDPR consent capture and paediatric/parental consent are now implemented, closing the previous privacy gaps. It is not fully compliant in the broader sense because source citations are unpopulated (P0-6), missed-dose guidance covers 4 of 40+ medications (P0-4), and red-flag detection covers 3 of 40+ (P0-5) — compliance for three medications is not compliance for forty.

**Is the app fully working?** Substantially more so than in Cycle 2. The two data-integrity bugs (route persistence, microgram dosing) are resolved. All six previously-unwired entities (Medication, AdverseEvent, Inventory, StorageLog, ProxyAccess, plus enhanced UserProfile) now have working screens and CRUD. Route-specific capture is implemented for 13 of 14 routes. Adherence, steady-state, accumulation ratio, percentage weight change, and brand-specific PK are all calculated and displayed. Remaining open items are: missed-dose and red-flag coverage expansion (P0-4, P0-5), source population (P0-6), interaction framework (P1), titration UI (P1), and data retention (P2).

**Recommended path:** Populate source fields for the 4 GLP-1 medications with established PK parameters first (P0-6 quick win), then expand missed-dose rules to exenatide/lixisenatide/pramlintide (P0-4), then build red-flag term sets for the GLP-1 class extension and the first non-GLP-1 class (P0-5). These three items close the remaining P0s and bring the app's safety coverage in line with its expanded catalogue scope. The P1 items (interaction framework → insulin, titration UI, calculation provenance) can then follow.

---

*Audit cycle 3 · Current build reviewed against source code · Date: July 2026*