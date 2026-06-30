import React from "react";
import { Plus } from "lucide-react";

// Dark mode: low-opacity tinted chip background + soft glow per category color
const DARK_STYLES = {
  "bg-yellow-100":  { bg: "rgba(234,179,8,0.13)",   shadow: "0 0 16px 3px rgba(234,179,8,0.2)",   color: "#FBBF24" },
  "bg-orange-100":  { bg: "rgba(249,115,22,0.13)",  shadow: "0 0 16px 3px rgba(249,115,22,0.2)",  color: "#FB923C" },
  "bg-teal-100":    { bg: "rgba(20,184,166,0.13)",  shadow: "0 0 16px 3px rgba(20,184,166,0.2)",  color: "#2DD4BF" },
  "bg-green-100":   { bg: "rgba(34,197,94,0.13)",   shadow: "0 0 16px 3px rgba(34,197,94,0.2)",   color: "#4ADE80" },
  "bg-amber-100":   { bg: "rgba(245,158,11,0.13)",  shadow: "0 0 16px 3px rgba(245,158,11,0.2)",  color: "#FCD34D" },
  "bg-blue-100":    { bg: "rgba(59,130,246,0.13)",  shadow: "0 0 16px 3px rgba(59,130,246,0.2)",  color: "#60A5FA" },
  "bg-red-100":     { bg: "rgba(239,68,68,0.13)",   shadow: "0 0 16px 3px rgba(239,68,68,0.2)",   color: "#F87171" },
  "bg-purple-100":  { bg: "rgba(168,85,247,0.13)",  shadow: "0 0 16px 3px rgba(168,85,247,0.2)",  color: "#C084FC" },
};

export default function MetricCard({ icon, label, value, unit, color, onAdd }) {
  const ds = DARK_STYLES[color];

  // Re-clone icon with dark color override when in dark mode
  const lightIcon = icon;
  const darkIcon = ds ? React.cloneElement(icon, { style: { color: ds.color } }) : icon;

  return (
    <div className="bg-white dark:bg-card rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-white/[0.07] min-h-[90px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2">
        {/* Light mode chip */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 dark:hidden ${color}`}>
          {lightIcon}
        </div>
        {/* Dark mode chip: tinted bg + glow */}
        <div
          className="w-7 h-7 rounded-lg items-center justify-center flex-shrink-0 hidden dark:flex"
          style={ds ? { background: ds.bg, boxShadow: ds.shadow } : {}}
        >
          {darkIcon}
        </div>
        <button onClick={onAdd} className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-colors flex-shrink-0">
          <Plus size={11} className="text-gray-500 dark:text-white/70" />
        </button>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-[#9A9DAE] font-medium mb-1 leading-tight break-words">{label}</span>
      <p className="text-base font-bold text-gray-800 dark:text-[#E8E9F0] leading-tight">
        {value} <span className="text-xs font-normal text-gray-400 dark:text-[#9A9DAE]">{unit}</span>
      </p>
    </div>
  );
}