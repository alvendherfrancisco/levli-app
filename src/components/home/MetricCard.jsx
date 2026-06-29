import React from "react";
import { Plus } from "lucide-react";

export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  return (
    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 min-h-[90px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <button onClick={onAdd} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
          <Plus size={11} className="text-gray-500" />
        </button>
      </div>
      <span className="text-[10px] text-gray-500 font-medium mb-1 leading-tight break-words">{label}</span>
      <p className="text-base font-bold text-gray-800 leading-tight">
        {value} <span className="text-xs font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}