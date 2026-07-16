import React, { useState, useEffect } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { todayKey } from "@/lib/dateUtils";
import { toast } from "sonner";

const SIDE_EFFECT_OPTIONS = [
  { label: "Nausea", emoji: "🤢" }, { label: "Vomiting", emoji: "🤮" },
  { label: "Diarrhea", emoji: "💩" }, { label: "Constipation", emoji: "😣" },
  { label: "Fatigue", emoji: "😴" }, { label: "Headache", emoji: "🤕" },
  { label: "Dizziness", emoji: "💫" }, { label: "Injection site pain", emoji: "💉" },
  { label: "Stomach pain", emoji: "😖" }, { label: "Heartburn", emoji: "🔥" },
];
const SEVERITIES = ["Mild", "Moderate", "Severe"];

export default function SideEffectsModal({ open, onClose, dayKey }) {
  const dk = dayKey || todayKey();
  const { getSideEffects, saveSideEffects } = useAppState();
  const [chips, setChips] = useState([]);
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [severity, setSeverity] = useState("Mild");

  useEffect(() => {
    if (open) {
      const existing = getSideEffects(dk);
      setNotes(existing || "");
      setChips([]);
    }
  }, [open, dk]);

  if (!open) return null;

  const addChip = () => {
    if (!selectedEffect) return;
    const chip = `${selectedEffect.emoji} ${selectedEffect.label} (${severity})`;
    if (!chips.includes(chip)) setChips([...chips, chip]);
    setShowDropdown(false);
    setSelectedEffect(null);
  };

  const handleSave = async () => {
    try {
      const parts = [];
      if (chips.length) parts.push(chips.join(", "));
      if (notes.trim()) parts.push(notes.trim());
      await saveSideEffects(dk, parts.join(" | "));
      toast.success("Side effects saved successfully!");
      setTimeout(() => onClose(), 500);
    } catch (err) {
      toast.error("Failed to save side effects");
    }
  };

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
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${severity === s ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30" : "bg-white dark:bg-white/[0.05] text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.1]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={addChip}
            className="w-full py-2.5 bg-white/[0.07] dark:bg-white/[0.07] text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 rounded-xl font-semibold text-sm hover:bg-teal-500/10 transition-colors">
            + Add to List
          </button>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <span key={i} className="flex items-center gap-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 rounded-full px-3 py-1 text-sm">
                  {c}
                  <button onClick={() => setChips(chips.filter((_, j) => j !== i))} className="ml-1 text-teal-400 hover:text-teal-300 dark:hover:text-teal-200">×</button>
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other observations..."
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none focus:border-teal-300" />
          </div>
        </div>
        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}