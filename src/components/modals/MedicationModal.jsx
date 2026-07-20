import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { MEDICATIONS } from "@/lib/medicationData";
import { NAME_TO_ENTRY, ROUTE_LABELS } from "@/lib/medicationCatalogue";
import { getMolecularClassLabel } from "@/lib/capabilityProfile";
import { getCapabilityWarning } from "@/lib/capabilityProfile";
import { DOSE_UNITS } from "@/lib/units";
import { toast } from "sonner";

export default function MedicationModal({ open, onClose, onSave, onDelete, initialEntry }) {
  const [form, setForm] = useState({
    medication_name: "", route: "", prescribed_dose: "", dose_unit: "mg",
    frequency: "", indication: "", start_date: "", planned_end_date: "",
    titration_stage: "", prescriber_name: "", prescriber_contact: "",
    status: "active", notes: "",
  });

  useEffect(() => {
    if (open) {
      if (initialEntry) {
        setForm({
          medication_name: initialEntry.medication_name || "",
          route: initialEntry.route || "",
          prescribed_dose: initialEntry.prescribed_dose != null ? String(initialEntry.prescribed_dose) : "",
          dose_unit: initialEntry.dose_unit || "mg",
          frequency: initialEntry.frequency || "",
          indication: initialEntry.indication || "",
          start_date: initialEntry.start_date || "",
          planned_end_date: initialEntry.planned_end_date || "",
          titration_stage: initialEntry.titration_stage || "",
          prescriber_name: initialEntry.prescriber_name || "",
          prescriber_contact: initialEntry.prescriber_contact || "",
          status: initialEntry.status || "active",
          notes: initialEntry.notes || "",
        });
      } else {
        setForm({
          medication_name: "", route: "", prescribed_dose: "", dose_unit: "mg",
          frequency: "", indication: "", start_date: "", planned_end_date: "",
          titration_stage: "", prescriber_name: "", prescriber_contact: "",
          status: "active", notes: "",
        });
      }
    }
  }, [open, initialEntry]);

  if (!open) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const entry = NAME_TO_ENTRY[form.medication_name];
  const capabilityWarning = form.medication_name ? getCapabilityWarning(form.medication_name) : null;

  const handleSave = () => {
    if (!form.medication_name) { toast.error("Please select a medication"); return; }
    const payload = {
      ...form,
      generic_name: entry?.generic_name || "",
      molecular_class: entry?.molecular_class || "",
      catalogue_id: entry?.id || "",
      prescribed_dose: parseFloat(form.prescribed_dose) || null,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">{initialEntry ? "Edit Medication" : "Add Medication"}</h2>
          <div className="flex items-center gap-3">
            {onDelete && <button onClick={onDelete}><Trash2 size={20} className="text-red-400" /></button>}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        {capabilityWarning && (
          <div className="mx-5 mb-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-500/20">
            <p className="text-xs">{capabilityWarning}</p>
          </div>
        )}

        <div className="px-5 pb-4 space-y-4">
          {/* Medication name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Medication</label>
            <select value={form.medication_name} onChange={(e) => set("medication_name", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
              <option value="" className="dark:bg-[#1e2130]">— Select —</option>
              {MEDICATIONS.map((m) => <option key={m} value={m} className="dark:bg-[#1e2130]">{m}</option>)}
            </select>
            {form.medication_name && <p className="text-xs text-gray-400 mt-1">{getMolecularClassLabel(form.medication_name)}</p>}
          </div>

          {/* Route */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Route</label>
            <select value={form.route} onChange={(e) => set("route", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
              <option value="" className="dark:bg-[#1e2130]">— Select —</option>
              {entry?.routes.map((r) => <option key={r} value={r} className="dark:bg-[#1e2130]">{ROUTE_LABELS[r] || r}</option>)}
            </select>
          </div>

          {/* Dose + unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Prescribed Dose</label>
              <input type="number" value={form.prescribed_dose} step="0.25" min="0"
                onChange={(e) => set("prescribed_dose", e.target.value)} placeholder="0"
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
            <div className="w-28">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Unit</label>
              <select value={form.dose_unit} onChange={(e) => set("dose_unit", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
                {DOSE_UNITS.map((u) => <option key={u} value={u} className="dark:bg-[#1e2130]">{u}</option>)}
              </select>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Frequency</label>
            <input type="text" value={form.frequency} onChange={(e) => set("frequency", e.target.value)} placeholder="e.g. once weekly"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
          </div>

          {/* Indication */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Indication</label>
            <input type="text" value={form.indication} onChange={(e) => set("indication", e.target.value)} placeholder="e.g. Type 2 diabetes"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
          </div>

          {/* Titration stage — display only what user/prescriber entered */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Titration Stage</label>
            <input type="text" value={form.titration_stage} onChange={(e) => set("titration_stage", e.target.value)} placeholder="As directed by your prescriber (e.g. 1.0 mg maintenance)"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            <p className="text-xs text-gray-400 mt-1">Enter your current stage as directed by your prescriber. This is for your reference only — Levli will not generate a titration schedule.</p>
          </div>

          {/* Dates */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Planned End Date</label>
              <input type="date" value={form.planned_end_date} onChange={(e) => set("planned_end_date", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
          </div>

          {/* Prescriber */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Prescriber Name</label>
              <input type="text" value={form.prescriber_name} onChange={(e) => set("prescriber_name", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Prescriber Contact</label>
              <input type="text" value={form.prescriber_contact} onChange={(e) => set("prescriber_contact", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
              <option value="active" className="dark:bg-[#1e2130]">Active</option>
              <option value="paused" className="dark:bg-[#1e2130]">Paused</option>
              <option value="discontinued" className="dark:bg-[#1e2130]">Discontinued</option>
              <option value="switched" className="dark:bg-[#1e2130]">Switched</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none" />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={!form.medication_name}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} /> {initialEntry ? "Update Medication" : "Save Medication"}
          </button>
        </div>
      </div>
    </div>
  );
}