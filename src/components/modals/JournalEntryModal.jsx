import React, { useState } from "react";
import { X, Save } from "lucide-react";

const MOODS = [
  { label: "Feeling Excellent", color: "bg-green-100 text-green-700" },
  { label: "Feeling Good", color: "bg-green-100 text-green-600" },
  { label: "Feeling Neutral", color: "bg-yellow-100 text-yellow-700" },
  { label: "Feeling Low", color: "bg-orange-100 text-orange-700" },
  { label: "Feeling Terrible", color: "bg-red-100 text-red-700" },
];

const CATEGORIES = ["General Note", "Mood", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const getTimestamp = () => {
  const h = now.getHours() % 12 || 12;
  const m = pad(now.getMinutes());
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
};
const getDate = () => `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

export default function JournalEntryModal({ open, onClose, onSave, initialEntry }) {
  const [text, setText] = useState(initialEntry?.text || "");
  const [mood, setMood] = useState(initialEntry?.mood || MOODS[0].label);
  const [category, setCategory] = useState(initialEntry?.category || "General Note");

  if (!open) return null;

  const moodObj = MOODS.find((m) => m.label === mood) || MOODS[0];

  const handleSave = () => {
    onSave({
      text,
      mood,
      moodColor: moodObj.color,
      category,
      time: initialEntry?.time || getTimestamp(),
      date: initialEntry?.date || getDate(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">{initialEntry ? "Edit Entry" : "New Journal Entry"}</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Entry</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your thoughts, symptoms, or progress..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-32 outline-none focus:border-blue-300"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m.label} onClick={() => setMood(m.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                    mood === m.label ? `${m.color} border-current` : "bg-gray-50 text-gray-500 border-transparent"
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                    category === c ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-transparent"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400">Timestamp: {getDate()} at {getTimestamp()}</p>
        </div>
        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={!text.trim()}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40">
            <Save size={16} /> Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}