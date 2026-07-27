import React from "react";
import { Plus } from "lucide-react";

// Dark mode icon color override (no background chip)
const DARK_STYLES = {
  "bg-orange-100":  { color: "#FB923C" },
  "bg-teal-100":    { color: "#2DD4BF" },
  "bg-amber-100":   { color: "#FCD34D" },
  "bg-blue-100":    { color: "#60A5FA" },
  "bg-red-100":     { color: "#F87171" },
  "bg-purple-100":  { color: "#C084FC" },
  "bg-indigo-100":  { color: "#818CF8" },
};

export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  const ds = DARK_STYLES[color];
  const darkIcon = ds ? React.cloneElement(icon, { style: { color: ds.color } }) : icon;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[72px] flex items-center gap-2 overflow-hidden">
      <div className="flex-shrink-0 dark:hidden">{icon}</div>
      <div className="flex-shrink-0 hidden dark:block">{darkIcon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-gray-500 dark:text-[#9A9DAE] font-medium block leading-tight truncate">{label}</span>
        <p className="text-base font-bold text-gray-800 dark:text-[#E8E9F0] leading-tight truncate">
          {value} <span className="text-xs font-normal text-gray-400 dark:text-[#9A9DAE]">{unit}</span>
        </p>
      </div>
      <button onClick={onAdd} className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-colors flex-shrink-0">
        <Plus size={11} className="text-gray-500 dark:text-white/70" />
      </button>
    </div>
  );
}