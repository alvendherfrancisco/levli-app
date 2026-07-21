import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { getRecentMedication } from "@/lib/medicationData";
import RedFlagBanner from "@/components/RedFlagBanner";
import { CalmMoodIcon, EnergizedMoodIcon, LovingMoodIcon, LowMoodIcon, GrowingMoodIcon } from "@/components/onboarding/LevliIcons";
import { toast } from "sonner";

const MOODS = [
  { label: "Feeling Calm",      Icon: CalmMoodIcon,      grad: "from-teal-400 to-blue-500" },
  { label: "Feeling Energized", Icon: EnergizedMoodIcon, grad: "from-amber-400 to-orange-500" },
  { label: "Feeling Loving",    Icon: LovingMoodIcon,    grad: "from-orange-400 to-pink-500" },
  { label: "Feeling Low",       Icon: LowMoodIcon,       grad: "from-violet-400 to-indigo-500" },
  { label: "Feeling Growing",   Icon: GrowingMoodIcon,   grad: "from-emerald-400 to-teal-500" },
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
  const [moodIdx, setMoodIdx] = useState(0);
  const [category, setCategory] = useState("General Note");
  const { darkMode, shots } = useAppState();

  useEffect(() => {
    if (open) {
      if (initialEntry) {
        setText(initialEntry.text || "");
        const mIdx = MOODS.findIndex(x => x.label === initialEntry.mood);
        setMoodIdx(mIdx >= 0 ? mIdx : 0);
        setCategory(initialEntry.category || "General Note");
      } else {
        setText("");
        setMoodIdx(0);
        setCategory("General Note");
      }
    }
  }, [open, initialEntry]);

  if (!open) return null;

  const mood = MOODS[moodIdx];
  const recentMed = getRecentMedication(shots, null);

  const handleSave = async () => {
    if (!text.trim()) return;
    try {
      const { date, time } = initialEntry ? { date: initialEntry.date, time: initialEntry.time } : nowFormatted();
      await onSave({ text: text.trim(), date, time, mood: mood.label, moodColor: `bg-gradient-to-br ${mood.grad}`, category });
      toast.success(initialEntry ? "Journal entry updated successfully!" : "Journal entry added successfully!");
      setTimeout(() => onClose(), 500);
    } catch (err) {
      toast.error("Failed to save journal entry");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">{initialEntry ? "Edit Entry" : "New Journal Entry"}</h2>
          <div className="flex items-center gap-3">
            {onDelete && <button onClick={onDelete}><Trash2 size={20} className="text-red-400" /></button>}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        <div className="px-5 pb-4 space-y-4">
          {/* Mood */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m, i) => {
                const isActive = mood.label === m.label;
                return (
                  <button key={m.label} onClick={() => setMoodIdx(i)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl border transition-all active:scale-95 ${
                      isActive
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 scale-105"
                        : "bg-white dark:bg-white/[0.05] border-gray-200 dark:border-white/[0.08] hover:border-gray-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-full ${isActive ? `bg-gradient-to-br ${m.grad} shadow-md` : "opacity-60"} flex items-center justify-center transition-all`}>
                      <m.Icon size={36} />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-indigo-600 dark:text-indigo-300" : "text-gray-400 dark:text-gray-500"}`}>{m.label.replace("Feeling ", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                    category === c
                      ? "bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30"
                      : "bg-white dark:bg-white/[0.05] text-gray-400 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.08]"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Your thoughts</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-gray-900 dark:text-[#E8E9F0] placeholder-gray-400 dark:placeholder-[#9A9DAE] rounded-xl px-4 py-3 text-sm resize-none h-32 outline-none focus:border-teal-300 dark:focus:border-teal-500/50" />
          </div>
        </div>

        {category === "Side Effect" && text.trim() && (
          <div className="px-5 pb-3"><RedFlagBanner text={text} medication={recentMed} /></div>
        )}

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={!text.trim()}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} /> {initialEntry ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}