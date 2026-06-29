import React from "react";
import { Plus } from "lucide-react";

export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 font-medium">{label}</span>
          <button onClick={onAdd} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Plus size={12} className="text-gray-500" />
          </button>
        </div>
      </div>
      <p className="text-lg font-bold text-gray-800">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
    </div>
  );
}