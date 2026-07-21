import React from "react";
import { Plus } from "lucide-react";

/**
 * Illustrated, pastel-tinted quick-add tile for Home metrics.
 * Soft colored background, custom Levli illustration, tap scale + fade-in.
 * Friendly empty state encourages the first log instead of showing bare zeros.
 */
const TINTS = {
  indigo: "bg-indigo-50",
  teal: "bg-teal-50",
  orange: "bg-orange-50",
  amber: "bg-amber-50",
  green: "bg-green-50",
  blue: "bg-blue-50",
  purple: "bg-purple-50",
  pink: "bg-pink-50",
};

export default function MetricTile({ icon, label, value, unit, tint = "indigo", empty, onAdd, index = 0 }) {
  return (
    <button
      onClick={onAdd}
      className={`relative ${TINTS[tint] || TINTS.indigo} rounded-2xl p-3 text-left border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden active:scale-[1.03] transition-transform animate-card-in min-h-[92px] flex flex-col`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <div className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
          <Plus size={11} className="text-gray-500" />
        </div>
      </div>
      <span className="text-[11px] text-gray-500 font-medium block leading-tight">{label}</span>
      {empty ? (
        <p className="text-xs text-gray-400 mt-0.5 italic">Tap to add</p>
      ) : (
        <p className="text-base font-bold text-gray-800 leading-tight">
          {value}
          {unit && <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>}
        </p>
      )}
    </button>
  );
}