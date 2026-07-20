import React, { useState, useEffect } from "react";
import { X, Save, ChevronDown, ExternalLink } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { todayKey, toDayKey } from "@/lib/dateUtils";
import { getRecentMedication } from "@/lib/medicationData";
import { classifyRedFlag, RED_FLAG_WORDING, RED_FLAG_DISCLAIMER } from "@/lib/redFlags";
import { toast } from "sonner";

const SIDE_EFFECT_OPTIONS = [
  { label: "Nausea", emoji: "🤢" }, { label: "Vomiting", emoji: "🤮" },
  { label: "Diarrhea", emoji: "💩" }, { label: "Constipation", emoji: "😣" },
  { label: "Fatigue", emoji: "😴" }, { label: "Headache", emoji: "🤕" },
  { label: "Dizziness", emoji: "💫" }, { label: "Injection site pain", emoji: "💉" },
  { label: "Stomach pain", emoji: "😖" }, { label: "Heartburn", emoji: "🔥" },
];
const SEVERITIES = ["mild", "moderate", "severe", "emergency"];

const PHARMACOVIGILANCE_LINKS = [
  { label: "UK — MHRA Yellow Card", url: "https://yellowcard.mhra.gov.uk/" },
  { label: "US — FDA MedWatch", url: "https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program" },
];

// Map free-text side-effect entries (legacy) to structured AdverseEvent fields
function classifyCategory(symptom) {
  const lower = (symptom || "").toLowerCase();
  if (/nausea|vomit|diarrh|constipat|stomach|heartburn/.test(lower)) return "gastrointestinal";
  if (/headache|dizz/.test(lower)) return "neurological";
  if (/injection site/.test(lower)) return "dermatological";
  return "other";
}

export default function SideEffectsModal({ open, onClose, dayKey }) {
  const dk = dayKey || todayKey();
  const { getSideEffects, saveSideEffects, shots, adverseEvents, addAdverseEvent, deleteAdverseEvent } = useAppState();
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [severity, setSeverity] = useState("mild");
  const [showDropdown, setShowDropdown] = useState(false);
  const [notes, setNotes] = useState("");

  // Existing structured events for this day
  const dayEvents = (adverseEvents || []).filter((e) => (e.day_key || (e.onset_date ? toDayKey(new Date(e.onset_date)) : "")) === dk);

  useEffect(() => {
    if (open) {
      // Legacy free-text is still displayed (read-only) for entries logged before migration.
      setNotes("");
      setSelectedEffect(null);
      setShowDropdown(false);
    }
  }, [open, dk]);

  if (!open) return null;

  const recentMed = getRecentMedication(shots, dk);

  const addEffect = async () => {
    if (!selectedEffect) return;
    const symptom = `${selectedEffect.emoji} ${selectedEffect.label}`;
    const { tier } = classifyRedFlag(symptom, recentMed);
    try {
      await addAdverseEvent({
        medication_name: recentMed || "",
        symptom,
        symptom_category: classifyCategory(selectedEffect.label),
        severity,
        onset_date: dk,
        onset_time: "",
        resolved: false,
        user_attribution: true,
        red_flag_tier: tier || "none",
        day_key: dk,
        notes: "",
      });
      toast.success("Side effect recorded");
      setSelectedEffect(null);
      setShowDropdown(false);
      setSeverity("mild");
    } catch (err) {
      toast.error("Failed to save side effect");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdverseEvent(id);
      toast.success("Side effect removed");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  // Combined text for red-flag banner (structured + legacy + notes)
  const combinedText = [
    ...dayEvents.map((e) => e.symptom),
    notes.trim(),
  ].filter(Boolean).join(" ");

  const legacyText = getSideEffects(dk);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold dark:text-[#E8E9F0]">Side Effects</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-4">
          {/* Dropdown */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Select Side Effect</label>
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <span className="text-base text-gray-600 dark:text-[#9A9DAE]">{selectedEffect ? `${selectedEffect.emoji} ${selectedEffect.label}` : "Choose a side effect..."}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {SIDE_EFFECT_OPTIONS.map((o) => (
                    <button key={o.label} onClick={() => { setSelectedEffect(o); setShowDropdown(false); }}
                      className="w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] hover:bg-gray-50 dark:hover:bg-white/[0.05] flex items-center gap-2">
                      <span>{o.emoji}</span> {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Severity</label>
            <div className="flex gap-2">
              {SEVERITIES.map((s) => (
                <button key={s} onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border capitalize transition-colors ${severity === s ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30" : "bg-white dark:bg-white/[0.05] text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.1]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={addEffect} disabled={!selectedEffect}
            className="w-full py-2.5 bg-teal-600/10 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 rounded-xl font-semibold text-sm hover:bg-teal-500/20 transition-colors disabled:opacity-50">
            + Add to List
          </button>

          {/* Today's structured side effects */}
          {dayEvents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dayEvents.map((e) => (
                <span key={e.id} className="flex items-center gap-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 rounded-full px-3 py-1 text-sm">
                  {e.symptom} <span className="text-xs opacity-60">({e.severity})</span>
                  <button onClick={() => handleDelete(e.id)} className="ml-1 text-teal-400 hover:text-teal-300 dark:hover:text-teal-200">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Legacy free-text (read-only display for pre-migration entries) */}
          {legacyText && (
            <div>
              <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">Previously logged (read-only)</label>
              <p className="text-sm text-gray-700 dark:text-[#E8E9F0] bg-gray-50 dark:bg-white/[0.05] rounded-xl p-3 border border-gray-100 dark:border-white/[0.08]">{legacyText}</p>
            </div>
          )}

          {/* Additional notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other observations..."
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none focus:border-teal-300" />
          </div>
        </div>

        {combinedText && (
          <div className="px-5 pb-3">
            {(() => {
              const { tier } = classifyRedFlag(combinedText, recentMed);
              if (tier === "none") return null;
              const isEmergency = tier === "emergency";
              return (
                <div className={`rounded-xl p-3 border ${isEmergency ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"}`}>
                  <p className={`text-sm font-semibold ${isEmergency ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300"}`}>
                    {isEmergency ? "This may need urgent attention" : "Consider contacting your clinician"}
                  </p>
                  <p className="text-xs mt-1 text-gray-700 dark:text-[#E8E9F0]">{RED_FLAG_WORDING[tier]}</p>
                  <p className="text-[11px] mt-1 text-gray-500 dark:text-[#9A9DAE]">{RED_FLAG_DISCLAIMER}</p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Pharmacovigilance resource links — public government pages only */}
        <div className="px-5 pb-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">You can report adverse events to official reporting systems:</p>
          <div className="flex flex-wrap gap-2">
            {PHARMACOVIGILANCE_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 rounded-lg px-3 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-500/10">
                {link.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={onClose} className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}