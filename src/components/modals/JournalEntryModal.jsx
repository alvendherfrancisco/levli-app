import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";

const MOODS = [
  { label: "Feeling Excellent", color: "bg-green-100 text-green-700", emoji: "😊" },
  { label: "Feeling Good", color: "bg-green-100 text-green-600", emoji: "🙂" },
  { label: "Feeling Neutral", color: "bg-yellow-100 text-yellow-700", emoji: "😐" },
  { label: "Feeling Low", color: "bg-orange-100 text-orange-700", emoji: "😔" },
  { label: "Feeling Bad", color: "bg-red-100 text-red-700", emoji: "😞" },
];

const CATEGORIES = ["Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

function now() {
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

  const handleSave = () => {
    if (!text.trim()) return;
    const { date, time } = initialEntry ? { date: initialEntry.date, time: initialEntry.time } : now();
    onSave({ text: text.trim(), date, time, mood: mood.label, moodColor: mood.color, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">{initialEntry ? "Edit Entry" : "New Journal Entry"}</h2>
          <div className="flex items-center gap-3">
            {onDelete && (
              <button onClick={onDelete}><Trash2 size={20} className="text-red-400" /></button>
            )}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        <div className="px-5 pb-4 space-y-4">
          {/* Mood */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">How are you feeling?</label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {MOODS.map((m) => (
                <button key={m.label} onClick={() => setMood(m)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    mood.label === m.label ? `${m.color} border-current` : "bg-white text-gray-400 border-gray-200"
                  }`}>
                  {m.emoji} {m.label.replace("Feeling ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                    category === c ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-400 border-gray-200"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Your thoughts</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-32 outline-none focus:border-blue-300" />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={!text.trim()}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} /> {initialEntry ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}