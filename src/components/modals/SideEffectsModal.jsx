import React, { useState, useEffect } from "react";
import { X, Save, ChevronDown, ExternalLink, AlertTriangle } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { todayKey } from "@/lib/dateUtils";
import { getRecentMedication } from "@/lib/medicationData";
import { ROUTE_LABELS } from "@/lib/medicationCatalogue";
import RedFlagBanner from "@/components/RedFlagBanner";
import { toast } from "sonner";

const SIDE_EFFECT_OPTIONS = [
  { label: "Nausea", emoji: "🤢" }, { label: "Vomiting", emoji: "🤮" },
  { label: "Diarrhea", emoji: "💩" }, { label: "Constipation", emoji: "😣" },
  { label: "Fatigue", emoji: "😴" }, { label: "Headache", emoji: "🤕" },
  { label: "Dizziness", emoji: "💫" }, { label: "Injection site pain", emoji: "💉" },
  { label: "Stomach pain", emoji: "😖" }, { label: "Heartburn", emoji: "🔥" },
];
const SEVERITIES = ["Mild", "Moderate", "Severe"];
const SEVERITY_MAP = { Mild: "mild", Moderate: "moderate", Severe: "severe" };

// Official government reporting links (no drafted content)
const REPORTING_LINKS = [
  { label: "MHRA Yellow Card (UK)", url: "https://yellowcard.mhra.gov.uk" },
  { label: "FDA MedWatch (US)", url: "https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program" },
];

export default function SideEffectsModal({ open, onClose, dayKey }) {
  const dk = dayKey || todayKey();
  const { getSideEffects, getAdverseEventsForDay, addAdverseEvent, deleteAdverseEvent, shots } = useAppState();
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const recentMed = getRecentMedication(shots, dk);
  const existingEvents = getAdverseEventsForDay(dk);
  const legacyText = getSideEffects(dk); // preserved for display of old data

  useEffect(() => {
    if (open) {
      setNotes("");
      setSelectedEffect(null);
      setShowDropdown(false);
    }
  }, [open, dk]);

  if (!open) return null;

  const handleAddEvent = async () => {
    if (!selectedEffect) return;
    try {
      await addAdverseEvent({
        symptom: selectedEffect.label,
        severity: SEVERITY_MAP[severity] || "mild",
        onset_date: dk,
        day_key: dk,
        medication_name: recentMed || "",
        notes: notes.trim() || "",
        resolved: false,
      });
      toast.success("Side effect logged");
      setSelectedEffect(null);
      setNotes("");
      setShowDropdown(false);
    } catch (err) {
      toast.error("Failed to log side effect");
    }
  };

  const combinedText = existingEvents.map((e) => `${e.symptom} (${e.severity})`).join(" ") + (notes.trim() ? " " + notes.trim() : "");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold dark:text-[#E8E9F0]">Side Effects</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>

        {recentMed && (
          <p className="px-5 text-xs text-gray-400 mb-3">Most recent medication: <span className="font-medium">{recentMed}</span></p>
        )}

        <div className="px-5 pb-4 space-y-4">
          {/* Existing events for this day */}
          {existingEvents.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logged for this day</p>
              <div className="flex flex-wrap gap-2">
                {existingEvents.map((e) => (
                  <span key={e.id} className="flex items-center gap-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 rounded-full px-3 py-1 text-sm">
                    {e.symptom} ({e.severity})
                    <button onClick={async () => { await deleteAdverseEvent(e.id); toast.success("Removed"); }}
                      className="ml-1 text-teal-400 hover:text-teal-300 dark:hover:text-teal-200">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Legacy free-text (preserved, read-only if present) */}
          {legacyText && existingEvents.length === 0 && (
            <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Previously logged (free text):</p>
              <p className="text-sm text-gray-600 dark:text-[#E8E9F0]">{legacyText}</p>
            </div>
          )}

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
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${severity === s ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30" : "bg-white dark:bg-white/[0.05] text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.1]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other observations..."
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none focus:border-teal-300" />
          </div>
        </div>

        {combinedText && <div className="px-5 pb-3"><RedFlagBanner text={combinedText} medication={recentMed} /></div>}

        {/* Reporting links */}
        <div className="px-5 pb-3">
          <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-[#9A9DAE] mb-2">Official reporting resources</p>
            <div className="space-y-1.5">
              {REPORTING_LINKS.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:underline">
                  <ExternalLink size={14} /> {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleAddEvent} disabled={!selectedEffect}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} /> Log Side Effect
          </button>
        </div>
      </div>
    </div>
  );
}