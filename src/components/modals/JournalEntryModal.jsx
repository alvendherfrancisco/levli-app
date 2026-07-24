import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { getRecentMedication } from "@/lib/medicationData";
import RedFlagBanner from "@/components/RedFlagBanner";
import { toast } from "sonner";

const MOODS = [
  { label: "Feeling Excellent", emoji: "😊", lightCls: "bg-green-100 text-green-700 border-green-300", darkBg: "rgba(34,197,94,0.15)",  darkBorder: "rgba(34,197,94,0.3)",  darkText: "#4ade80" },
  { label: "Feeling Good",      emoji: "🙂", lightCls: "bg-green-50 text-green-600 border-green-200",  darkBg: "rgba(34,197,94,0.10)",  darkBorder: "rgba(34,197,94,0.25)", darkText: "#86efac" },
  { label: "Feeling Neutral",   emoji: "😐", lightCls: "bg-yellow-100 text-yellow-700 border-yellow-300", darkBg: "rgba(234,179,8,0.15)",darkBorder: "rgba(234,179,8,0.3)", darkText: "#fde047" },
  { label: "Feeling Low",       emoji: "😔", lightCls: "bg-orange-100 text-orange-700 border-orange-300", darkBg: "rgba(249,115,22,0.15)",darkBorder: "rgba(249,115,22,0.3)",darkText: "#fb923c" },
  { label: "Feeling Bad",       emoji: "😞", lightCls: "bg-red-100 text-red-700 border-red-300",     darkBg: "rgba(239,68,68,0.15)",  darkBorder: "rgba(239,68,68,0.3)",   darkText: "#f87171" },
];

const CATEGORIES = ["Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

function nowFormatted() {
  const d = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const date = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,"0")}, ${d.getFullYear()}`;
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const time = `${h}:${String(m).padStart(2,"0")} ${ampm}`;
  return { date, time };
}

export default function JournalEntryModal({ open, onClose, onSave, onDelete, initialEntry }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [category, setCategory] = useState("General Note");
  const { shots } = useAppState();

  useEffect(() => {
    if (open) {
      if (initialEntry) {
        setText(initialEntry.text || "");
        const m = MOODS.find(x => x.label === initialEntry.mood) || MOODS[0];
        setMood(m);
        setCategory(initialEntry.category || "General Note");
      } else {
        setText("");
        setMood(MOODS[0]);
        setCategory("General Note");
      }
    }
  }, [open, initialEntry]);

  if (!open) return null;

  const recentMed = getRecentMedication(shots, null);

  const handleSave = async () => {
    if (!text.trim()) return;
    try {
      const { date, time } = initialEntry ? { date: initialEntry.date, time: initialEntry.time } : nowFormatted();
      await onSave({ text: text.trim(), date, time, mood: mood.label, moodColor: mood.lightCls, category });
      toast.success(initialEntry ? "Journal entry updated successfully!" : "Journal entry added successfully!");
      setTimeout(() => onClose(), 500);
    } catch (err) {
      toast.error("Failed to save journal entry");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-800">{initialEntry ? "Edit Entry" : "New Journal Entry"}</h2>
          <div className="flex items-center gap-3">
            {onDelete && <button onClick={onDelete}><Trash2 size={20} className="text-orange-400" /></button>}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        <div className="px-5 pb-4 space-y-4">
          {/* Mood */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const isActive = mood.label === m.label;
                return (
                  <button
                    key={m.label}
                    onClick={() => setMood(m)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${
                      isActive
                        ? m.lightCls
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {m.emoji} {m.label.replace("Feeling ", "")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${
                    category === c
                      ? "bg-indigo-50 text-indigo-600 border-indigo-500"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Your thoughts</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 text-sm resize-none h-32 outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>

        {category === "Side Effect" && text.trim() && (
          <div className="px-5 pb-3"><RedFlagBanner text={text} medication={recentMed} /></div>
        )}

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={!text.trim()}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-indigo-600/20">
            <Save size={16} /> {initialEntry ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}