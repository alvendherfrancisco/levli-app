import React from "react";
import { Plus } from "lucide-react";

// Accepts a Levli gradient icon component (e.g. SyringeIcon, ScaleIcon) as `icon`
export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 min-h-[88px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        {Icon ? <Icon size={28} /> : <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>}
        <button
          onClick={onAdd}
          className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-100 active:scale-90 transition-all flex-shrink-0"
        >
          <Plus size={11} className="text-gray-400" />
        </button>
      </div>
      <span className="text-[10px] text-gray-500 font-medium mb-0.5 leading-tight break-words">{label}</span>
      <p className="text-base font-bold text-gray-700 leading-tight">
        {value} <span className="text-xs font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}