import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useAppState } from "@/lib/AppState";

const TAGS = ["Nausea", "Fatigue", "Headache", "Dizziness", "Constipation", "Diarrhea", "Vomiting", "Appetite Loss"];

export default function SideEffectsModal({ open, onClose }) {
  const { sideEffects, setSideEffects } = useAppState();
  const [text, setText] = useState(sideEffects);
  const [selectedTag, setSelectedTag] = useState("");

  if (!open) return null;

  const handleSave = () => {
    setSideEffects(text);
    onClose();
  };

  const applyTag = (tag) => {
    setText((prev) => prev ? prev + ", " + tag : tag);
    setSelectedTag(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg animate-in slide-in-from-bottom">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">Side Effects</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Describe your side effects</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Mild nausea after injection, resolved in 2 hours..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-28 outline-none focus:border-blue-300"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Quick tags</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button key={tag} onClick={() => applyTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedTag === tag ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}