import React, { useState } from "react";
import { X, Save } from "lucide-react";

export default function AddMetricModal({ open, onClose, label, unit, value, onSave }) {
  const [val, setVal] = useState(value || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg animate-in slide-in-from-bottom">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">Log {label}</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">{label} ({unit})</label>
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="0"
              className="flex-1 outline-none text-base"
              autoFocus
            />
            <span className="text-gray-400 text-sm ml-2">{unit}</span>
          </div>
        </div>
        <div className="px-5 pb-8 pt-2">
          <button onClick={() => { onSave(val); onClose(); }}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}