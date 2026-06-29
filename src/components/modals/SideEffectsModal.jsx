import React, { useState } from "react";
import { X, Save, ChevronDown, Plus } from "lucide-react";
import { useAppState } from "@/lib/AppState";

const SIDE_EFFECTS = [
  { emoji: "🤢", label: "Nausea" },
  { emoji: "🔥", label: "Heartburn" },
  { emoji: "🍽️", label: "Food Noise" },
  { emoji: "💥", label: "Migraine" },
  { emoji: "🚽", label: "Constipation" },
  { emoji: "💩", label: "Diarrhea" },
  { emoji: "💨", label: "Belching" },
  { emoji: "💉", label: "Injection Site Reaction" },
  { emoji: "😠", label: "Mood Swings" },
  { emoji: "🤢", label: "Indigestion" },
  { emoji: "🦷", label: "Metallic Taste" },
  { emoji: "😟", label: "Stomach Pain" },
  { emoji: "💇", label: "Hair Loss" },
  { emoji: "😴", label: "Fatigue" },
  { emoji: "🍽️", label: "Suppressed Appetite" },
];

const SEVERITIES = ["Mild", "Moderate", "Severe"];

export default function SideEffectsModal({ open, onClose }) {
  const { setSideEffects } = useAppState();
  const [selectedEffect, setSelectedEffect] = useState(SIDE_EFFECTS[0]);
  const [severity, setSeverity] = useState("Mild");
  const [chips, setChips] = useState([]);
  const [notes, setNotes] = useState("");
  const [showEffectDropdown, setShowEffectDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  if (!open) return null;

  const addChip = () => {
    const key = `${selectedEffect.label}-${severity}`;
    if (!chips.find((c) => c.key === key)) {
      setChips((prev) => [...prev, { key, emoji: selectedEffect.emoji, label: selectedEffect.label, severity }]);
    }
  };

  const removeChip = (key) => setChips((prev) => prev.filter((c) => c.key !== key));

  const handleSave = () => {
    const text = chips.map((c) => `${c.emoji} ${c.label} (${c.severity})`).join(", ");
    setSideEffects(text + (notes ? ` — ${notes}` : ""));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[480px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <h2 className="text-xl font-bold">Add Side Effects</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>

        <div className="px-5 pb-4 space-y-4">
          {/* Dropdowns row */}
          <div className="flex items-center gap-2">
            {/* Effect dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => { setShowEffectDropdown(!showEffectDropdown); setShowSeverityDropdown(false); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 flex items-center justify-between text-left bg-white">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span>{selectedEffect.emoji}</span>
                  <span>{selectedEffect.label}</span>
                </span>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </button>
              {showEffectDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {SIDE_EFFECTS.map((se) => (
                    <button key={se.label} onClick={() => { setSelectedEffect(se); setShowEffectDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 ${selectedEffect.label === se.label ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                      <span>{se.emoji}</span>
                      <span>{se.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Severity dropdown */}
            <div className="relative w-28">
              <button
                onClick={() => { setShowSeverityDropdown(!showSeverityDropdown); setShowEffectDropdown(false); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 flex items-center justify-between text-left bg-white">
                <span className="text-sm font-medium">{severity}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {showSeverityDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl">
                  {SEVERITIES.map((s) => (
                    <button key={s} onClick={() => { setSeverity(s); setShowSeverityDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${severity === s ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add button */}
            <button onClick={addChip}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Plus size={20} className="text-white" />
            </button>
          </div>

          {/* Selected chips */}
          {chips.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Selected Side Effects</p>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c.key} className="flex items-center gap-1.5 bg-green-500 text-white rounded-full px-3 py-1.5 text-sm font-medium">
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                    <button onClick={() => removeChip(c.key)} className="ml-1 text-white/80 hover:text-white">✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about your side effects"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:border-blue-300"
            />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}