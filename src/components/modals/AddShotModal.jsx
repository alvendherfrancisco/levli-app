import React, { useState, useEffect, useRef } from "react";
import { X, Save, MapPin, Star, ChevronDown, Trash2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { formatShotDate } from "@/lib/dateUtils";
import { MEDICATIONS, DRUG_CLASS, isInvestigational, getDoseMax, getMedicationRoutes, getPrimaryRoute, getMolecularClass } from "@/lib/medicationData";
import { ROUTE_LABELS } from "@/lib/medicationCatalogue";
import { getCapabilityProfile, getCapabilityWarning, getMolecularClassLabel } from "@/lib/capabilityProfile";
import { isDosingProhibited } from "@/lib/capabilityProfile";
import { detectDuplicateActiveIngredient } from "@/lib/drugSafety";
import { DOSE_UNITS, doseStep, doseToMg } from "@/lib/units";
import { toast } from "sonner";

// Routes that require injection site selection
const INJECTABLE_ROUTES = ["subcutaneous", "intramuscular", "intradermal"];

// Injection site options for subcutaneous injections
const injectionSites = [
  "Stomach – Upper Left", "Stomach – Upper Right", "Stomach – Lower Left", "Stomach – Lower Right",
  "Thigh – Left", "Thigh – Right", "Upper Arm – Left", "Upper Arm – Right",
];

// IM injection sites
const imSites = [
  "Deltoid – Left", "Deltoid – Right", "Vastus Lateralis – Left", "Vastus Lateralis – Right",
  "Gluteal – Left", "Gluteal – Right",
];

const pad = (n) => String(n).padStart(2, "0");

function toInputDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function toInputTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddShotModal({ open, onClose, editingShot }) {
  const { addShot, updateShot, deleteShot, profile, getRecommendedSite, shots, medications } = useAppState();
  const confirmedDupRef = useRef(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const defaultMed = profile?.default_medication || "Ozempic®";
  const now = new Date();

  const [pain, setPain] = useState(0);
  const [medication, setMedication] = useState(defaultMed);
  const [dose, setDose] = useState("2.50");
  const [doseUnit, setDoseUnit] = useState("mg");
  const [medicationId, setMedicationId] = useState("");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(toInputDate(now));
  const [time, setTime] = useState(toInputTime(now));
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [route, setRoute] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Route-specific data-capture fields
  const [deviceType, setDeviceType] = useState("");
  const [infusionDuration, setInfusionDuration] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const [premedicationGiven, setPremedicationGiven] = useState(false);
  const [sprayCount, setSprayCount] = useState("");
  const [nostril, setNostril] = useState("");
  const [primingDone, setPrimingDone] = useState(false);
  const [takenWithFood, setTakenWithFood] = useState(false);
  const [patchSite, setPatchSite] = useState("");
  const [patchApplicationDate, setPatchApplicationDate] = useState("");
  const [topicalBodyArea, setTopicalBodyArea] = useState("");
  const [topicalNotes, setTopicalNotes] = useState("");
  const [pumpRate, setPumpRate] = useState("");
  const [siteChangeDate, setSiteChangeDate] = useState("");
  const [reconstitutionDate, setReconstitutionDate] = useState("");
  const [inUseExpiry, setInUseExpiry] = useState("");

  // When a medication is selected, adopt its dose_unit if a Medication record exists
  const linkedMed = medications.find((m) => m.medication_name === medication);
  const effectiveDoseUnit = linkedMed?.dose_unit || doseUnit;

  const medRoutes = getMedicationRoutes(medication);
  const caps = getCapabilityProfile(medication);
  const capabilityWarning = getCapabilityWarning(medication);
  const isInjectable = INJECTABLE_ROUTES.includes(route || getPrimaryRoute(medication));
  const siteOptions = route === "intramuscular" ? imSites : injectionSites;

  const recommendedSite = getRecommendedSite();

  useEffect(() => {
    if (open) {
      if (editingShot) {
        setMedication(editingShot.medication || defaultMed);
        setDose(String(editingShot.dose ?? "2.50"));
        setDoseUnit(editingShot.dose_unit || "mg");
        setMedicationId(editingShot.medication_id || "");
        setSite(editingShot.site || recommendedSite);
        setRoute(editingShot.route || getPrimaryRoute(editingShot.medication || defaultMed));
        setNotes(editingShot.notes || "");
        setPain(editingShot.pain ?? 0);
        setDeviceType(editingShot.device_type || "");
        setInfusionDuration(editingShot.infusion_duration_min != null ? String(editingShot.infusion_duration_min) : "");
        setClinicLocation(editingShot.clinic_location || "");
        setPremedicationGiven(!!editingShot.premedication_given);
        setSprayCount(editingShot.spray_count != null ? String(editingShot.spray_count) : "");
        setNostril(editingShot.nostril || "");
        setPrimingDone(!!editingShot.priming_done);
        setTakenWithFood(!!editingShot.taken_with_food);
        setPatchSite(editingShot.site || "");
        setPatchApplicationDate(editingShot.patch_application_date || "");
        setTopicalBodyArea(editingShot.topical_body_area || "");
        setTopicalNotes(editingShot.topical_notes || "");
        setPumpRate(editingShot.pump_rate || "");
        setSiteChangeDate(editingShot.site_change_date || "");
        setReconstitutionDate(editingShot.reconstitution_date || "");
        setInUseExpiry(editingShot.in_use_expiry || "");
        try {
          const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
          const parts = editingShot.date.replace(",", "").split(" ");
          const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
          setDate(toInputDate(d));
        } catch { setDate(toInputDate(now)); }
        try {
          const [timePart, ampm] = editingShot.time.split(" ");
          let [h, m] = timePart.split(":").map(Number);
          if (ampm === "PM" && h !== 12) h += 12;
          if (ampm === "AM" && h === 12) h = 0;
          setTime(`${pad(h)}:${pad(m)}`);
        } catch { setTime(toInputTime(now)); }
      } else {
        const n = new Date();
        setMedication(defaultMed);
        setDose("2.50");
        setDoseUnit(linkedMed?.dose_unit || "mg");
        setMedicationId("");
        setSite(recommendedSite);
        setRoute(getPrimaryRoute(defaultMed));
        setNotes("");
        setPain(0);
        setDeviceType("");
        setInfusionDuration("");
        setClinicLocation("");
        setPremedicationGiven(false);
        setSprayCount("");
        setNostril("");
        setPrimingDone(false);
        setTakenWithFood(false);
        setPatchSite("");
        setPatchApplicationDate("");
        setTopicalBodyArea("");
        setTopicalNotes("");
        setPumpRate("");
        setSiteChangeDate("");
        setReconstitutionDate("");
        setInUseExpiry("");
        setDate(toInputDate(n));
        setTime(toInputTime(n));
      }
      setError("");
      confirmedDupRef.current = false;
      setDuplicateWarning(null);
    }
  }, [open, editingShot]);

  if (!open) return null;

  const handleSave = async () => {
    const doseNum = parseFloat(dose);
    if (isNaN(doseNum) || doseNum <= 0) {
      setError("Please enter a valid dose.");
      return;
    }
    // Unit-aware dose-max check (skip if dosing calculations are prohibited)
    if (!isDosingProhibited(medication)) {
      const maxDose = getDoseMax(medication);
      const doseInMg = doseToMg(doseNum, effectiveDoseUnit);
      // Only compare mass-based units (mg/mcg) to the mg-based max
      if (doseInMg != null && doseInMg > maxDose) {
        setError(`That dose exceeds the typical maximum for ${medication} (${maxDose} mg). Check the label or confirm with your prescriber.`);
        return;
      }
    }
    // Duplicate active-ingredient check (new shots only, non-blocking)
    if (!editingShot && !confirmedDupRef.current) {
      const dup = detectDuplicateActiveIngredient(medication, shots);
      if (dup.duplicate) {
        setDuplicateWarning(dup);
        return;
      }
    }
    setSaving(true);
    setError("");
    setDuplicateWarning(null);
    const d = new Date(date + "T" + time);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formattedDate = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,"0")}, ${d.getFullYear()}`;
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const formattedTime = `${h}:${pad(m)} ${ampm}`;
    const payload = {
      medication, dose: doseNum, drugClass: DRUG_CLASS[medication] || "GLP-1",
      molecularClass: getMolecularClass(medication),
      route: route || getPrimaryRoute(medication),
      dose_unit: effectiveDoseUnit,
      date: formattedDate, time: formattedTime,
      site: isInjectable ? site : "",
      pain: pain || 0, notes,
    };
    // Route-specific data-capture fields
    if (medicationId) payload.medication_id = medicationId;
    if (deviceType) payload.device_type = deviceType;
    if (route === "intravenous_infusion") {
      if (infusionDuration) payload.infusion_duration_min = parseFloat(infusionDuration);
      if (clinicLocation) payload.clinic_location = clinicLocation;
      payload.premedication_given = premedicationGiven;
    }
    if (route === "nasal") {
      if (sprayCount) payload.spray_count = parseInt(sprayCount);
      if (nostril) payload.nostril = nostril;
      payload.priming_done = primingDone;
    }
    if (route === "oral_tablet" || route === "oral_capsule") {
      payload.taken_with_food = takenWithFood;
    }
    if (route === "transdermal") {
      if (patchSite) payload.site = patchSite;
      if (patchApplicationDate) payload.patch_application_date = patchApplicationDate;
    }
    if (route === "topical_cream" || route === "topical_serum" || route === "topical_gel") {
      if (topicalBodyArea) payload.topical_body_area = topicalBodyArea;
      if (topicalNotes) payload.topical_notes = topicalNotes;
      if (topicalBodyArea) payload.site = topicalBodyArea;
    }
    if (route === "pump_infusion") {
      if (pumpRate) payload.pump_rate = pumpRate;
      if (siteChangeDate) payload.site_change_date = siteChangeDate;
    }
    if (route === "reconstituted_vial") {
      if (reconstitutionDate) payload.reconstitution_date = reconstitutionDate;
      if (inUseExpiry) payload.in_use_expiry = inUseExpiry;
    }
    if (route === "implant") {
      if (clinicLocation) payload.clinic_location = clinicLocation;
    }
    try {
      if (editingShot) {
        const update = {
          medication: payload.medication, dose: payload.dose, drug_class: payload.drugClass,
          molecular_class: payload.molecularClass, route: payload.route, dose_unit: payload.dose_unit,
          date: payload.date, time: payload.time, site: payload.site,
          pain: payload.pain, notes: payload.notes,
        };
        if (payload.medication_id) update.medication_id = payload.medication_id;
        if (payload.device_type) update.device_type = payload.device_type;
        if (payload.infusion_duration_min != null) update.infusion_duration_min = payload.infusion_duration_min;
        if (payload.clinic_location) update.clinic_location = payload.clinic_location;
        if (payload.premedication_given !== undefined) update.premedication_given = payload.premedication_given;
        if (payload.spray_count != null) update.spray_count = payload.spray_count;
        if (payload.nostril) update.nostril = payload.nostril;
        if (payload.priming_done !== undefined) update.priming_done = payload.priming_done;
        if (payload.taken_with_food !== undefined) update.taken_with_food = payload.taken_with_food;
        if (payload.patch_application_date) update.patch_application_date = payload.patch_application_date;
        if (payload.topical_body_area) update.topical_body_area = payload.topical_body_area;
        if (payload.topical_notes) update.topical_notes = payload.topical_notes;
        if (payload.pump_rate) update.pump_rate = payload.pump_rate;
        if (payload.site_change_date) update.site_change_date = payload.site_change_date;
        if (payload.reconstitution_date) update.reconstitution_date = payload.reconstitution_date;
        if (payload.in_use_expiry) update.in_use_expiry = payload.in_use_expiry;
        await updateShot(editingShot.id, update);
        toast.success("Shot updated successfully!");
      } else {
        await addShot(payload);
        toast.success("Shot added successfully!");
      }
      setSaving(false);
      setTimeout(() => onClose(), 500);
    } catch (err) {
      console.error("Error saving shot:", err);
      toast.error("Failed to save shot");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingShot) return;
    if (!confirm("Delete this shot?")) return;
    await deleteShot(editingShot.id);
    toast.success("Shot deleted successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">{editingShot ? "Edit Shot Log" : "Add Shot Log"}</h2>
          <div className="flex items-center gap-3">
            {editingShot && (
              <button onClick={handleDelete}><Trash2 size={20} className="text-red-400" /></button>
            )}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        {error && <p className="mx-5 mb-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-3 py-2">{error}</p>}

        {capabilityWarning && (
          <div className="mx-5 mb-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-500/20">
            <p className="font-semibold text-xs">⚠ {isInvestigational(medication) ? "Not an approved medicine" : "Capability notice"}</p>
            <p className="mt-1 text-xs">{capabilityWarning}</p>
          </div>
        )}

        <div className="px-5 pb-4 space-y-5">
          {/* Date & Time */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Date & Time</label>
            <div className="flex gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="flex-1 border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="flex-1 border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
            </div>
          </div>

          {/* Medication */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Medication</label>
            <div className="relative">
              <button onClick={() => { setShowMedDropdown(!showMedDropdown); setShowSiteDropdown(false); setShowRouteDropdown(false); }}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <div>
                  <span className="text-base block">{medication}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{getMolecularClassLabel(medication)}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showMedDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {MEDICATIONS.map((m) => (
                    <button key={m} onClick={() => { setMedication(m); setRoute(getPrimaryRoute(m)); setShowMedDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] ${medication === m ? "bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 font-medium" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}>
                      <span className="block">{m}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block">{getMolecularClassLabel(m)}</span>
                      {isInvestigational(m) ? <span className="text-xs text-amber-600 dark:text-amber-400">investigational — not approved</span> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Route */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Route</label>
            <div className="relative">
              <button onClick={() => { setShowRouteDropdown(!showRouteDropdown); setShowMedDropdown(false); setShowSiteDropdown(false); }}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <span className="text-base">{ROUTE_LABELS[route] || route || "Select route"}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showRouteDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg">
                  {medRoutes.map((r) => (
                    <button key={r} onClick={() => { setRoute(r); setShowRouteDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] ${route === r ? "bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 font-medium" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}>
                      {ROUTE_LABELS[r] || r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dose — unit-aware */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Dose</label>
            <div className="border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] rounded-xl px-4 py-3 flex items-center gap-2">
              <input type="number" value={dose} min="0.001" step={doseStep(effectiveDoseUnit)}
                onChange={(e) => setDose(e.target.value)} className="flex-1 outline-none text-base bg-transparent dark:text-[#E8E9F0]" />
              <select value={effectiveDoseUnit} onChange={(e) => setDoseUnit(e.target.value)}
                className="text-sm bg-transparent outline-none text-gray-500 dark:text-gray-400 cursor-pointer">
                {DOSE_UNITS.map((u) => <option key={u} value={u} className="dark:bg-[#1e2130]">{u}</option>)}
              </select>
            </div>
            {!isDosingProhibited(medication) && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Typical max for {medication}: {getDoseMax(medication)} mg</p>
            )}
          </div>

          {/* Device type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Device Type (Optional)</label>
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
              <option value="" className="dark:bg-[#1e2130]">— None —</option>
              <option value="prefilled_syringe" className="dark:bg-[#1e2130]">Prefilled syringe</option>
              <option value="single_dose_pen" className="dark:bg-[#1e2130]">Single-dose pen</option>
              <option value="multidose_pen" className="dark:bg-[#1e2130]">Multidose pen</option>
              <option value="vial_syringe" className="dark:bg-[#1e2130]">Vial + syringe</option>
              <option value="pump" className="dark:bg-[#1e2130]">Pump</option>
              <option value="patch" className="dark:bg-[#1e2130]">Patch</option>
              <option value="other" className="dark:bg-[#1e2130]">Other</option>
            </select>
          </div>

          {/* Injection Site — only for injectable routes */}
          {isInjectable && (
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Injection Site</label>
            <div className="rounded-xl p-3 mb-2 flex items-start gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <MapPin size={16} className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Recommended: {recommendedSite}</p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400/70">Based on your rotation history</p>
              </div>
              <button onClick={() => setSite(recommendedSite)} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">Use</button>
            </div>
            <div className="relative">
              <button onClick={() => { setShowSiteDropdown(!showSiteDropdown); setShowMedDropdown(false); setShowRouteDropdown(false); }}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span className="text-base font-semibold">{site}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showSiteDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {siteOptions.map((s) => (
                    <button key={s} onClick={() => { setSite(s); setShowSiteDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] ${site === s ? "bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 font-medium" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Route-specific data-capture fields (data only, no guidance text) */}
          {route === "intravenous_infusion" && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Infusion Duration (min)</label>
                <input type="number" value={infusionDuration} min="1" step="1"
                  onChange={(e) => setInfusionDuration(e.target.value)} placeholder="e.g. 30"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Clinic / Location</label>
                <input type="text" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)} placeholder="e.g. Daycare Unit"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={premedicationGiven} onChange={(e) => setPremedicationGiven(e.target.checked)} className="w-4 h-4 accent-teal-600" />
                Premedication given
              </label>
            </>
          )}
          {route === "nasal" && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Spray Count</label>
                <input type="number" value={sprayCount} min="1" step="1"
                  onChange={(e) => setSprayCount(e.target.value)} placeholder="e.g. 1"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Nostril</label>
                <div className="flex gap-2">
                  {["left", "right", "both"].map((n) => (
                    <button key={n} onClick={() => setNostril(nostril === n ? "" : n)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border capitalize ${nostril === n ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30" : "bg-white dark:bg-white/[0.05] text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.1]"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={primingDone} onChange={(e) => setPrimingDone(e.target.checked)} className="w-4 h-4 accent-teal-600" />
                Device primed before use
              </label>
            </>
          )}
          {(route === "oral_tablet" || route === "oral_capsule") && (
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={takenWithFood} onChange={(e) => setTakenWithFood(e.target.checked)} className="w-4 h-4 accent-teal-600" />
              Taken with food
            </label>
          )}
          {route === "transdermal" && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Patch Site</label>
                <input type="text" value={patchSite} onChange={(e) => setPatchSite(e.target.value)} placeholder="e.g. Upper arm – Left"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Application Date</label>
                <input type="date" value={patchApplicationDate} onChange={(e) => setPatchApplicationDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
            </>
          )}
          {(route === "topical_cream" || route === "topical_serum" || route === "topical_gel") && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Body Area</label>
                <input type="text" value={topicalBodyArea} onChange={(e) => setTopicalBodyArea(e.target.value)} placeholder="e.g. Face, left cheek"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Application Notes</label>
                <textarea value={topicalNotes} onChange={(e) => setTopicalNotes(e.target.value)} placeholder="e.g. Morning routine"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none focus:border-teal-300" />
              </div>
            </>
          )}
          {route === "pump_infusion" && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Pump Rate</label>
                <input type="text" value={pumpRate} onChange={(e) => setPumpRate(e.target.value)} placeholder="e.g. 0.5 units/hr"
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Site Change Date</label>
                <input type="date" value={siteChangeDate} onChange={(e) => setSiteChangeDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
            </>
          )}
          {route === "reconstituted_vial" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Reconstitution Date</label>
                <input type="date" value={reconstitutionDate} onChange={(e) => setReconstitutionDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">In-Use Expiry</label>
                <input type="date" value={inUseExpiry} onChange={(e) => setInUseExpiry(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
              </div>
            </div>
          )}
          {route === "implant" && (
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Clinic / Insertion Location</label>
              <input type="text" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)} placeholder="e.g. Clinic name"
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none focus:border-teal-300" />
            </div>
          )}

          {/* Pain Level */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Pain Level: <span className="text-teal-600">{pain}/10</span></label>
            <div className="px-1">
              <input type="range" min="0" max="10" value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full accent-teal-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 – No Pain</span><span>10 – Severe</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Notes (Optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or side effects experienced"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:border-teal-300" />
          </div>
        </div>

        {duplicateWarning && (
          <div className="mx-5 mb-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-500/20">
            <p className="font-semibold">Possible duplicate active ingredient</p>
            <p className="mt-1">You logged {duplicateWarning.existingBrand} ({duplicateWarning.generic}) on {duplicateWarning.lastDoseDate}. Logging two forms of the same active ingredient may duplicate your dose. Confirm this is intended or contact your prescriber.</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => { confirmedDupRef.current = true; handleSave(); }} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold">Save anyway</button>
              <button onClick={() => setDuplicateWarning(null)} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-semibold border border-gray-200 dark:border-white/10">Cancel</button>
            </div>
          </div>
        )}

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={16} /> {saving ? "Saving…" : editingShot ? "Update Shot" : "Save Shot"}
          </button>
        </div>
      </div>
    </div>
  );
}