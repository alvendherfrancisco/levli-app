import React from "react";
import { Plus } from "lucide-react";

/**
 * Nutrition / metric card matching the Levli design reference:
 *  - circular pastel icon container (colour per metric)
 *  - black icon glyph
 *  - label sits to the right of the icon
 *  - "+" button in the top-right corner
 *  - value at the bottom
 */
export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[88px] flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">
          {label}
        </span>
        <button
          onClick={onAdd}
          className="ml-auto w-5 h-5 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-colors flex-shrink-0"
        >
          <Plus size={11} className="text-gray-400 dark:text-white/70" />
        </button>
      </div>
      <p className="text-base font-bold text-gray-900 dark:text-[#E8E9F0] leading-tight mt-auto">
        {value} <span className="text-xs font-normal text-gray-400 dark:text-[#9A9DAE]">{unit}</span>
      </p>
    </div>
  );
}