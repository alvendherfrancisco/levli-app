import React from "react";
import { Plus } from "lucide-react";

export default function MetricCard({ icon, label, value, unit, bgColor, iconColor, onAdd }) {
  return (
    <div className="bg-surface rounded-[20px] p-4 shadow-card border border-border-warm min-h-[96px] flex flex-col transition-transform active:scale-[0.97]">
      <div className="flex items-center justify-between mb-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <button
          onClick={onAdd}
          className="w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center hover:bg-border-warm transition-colors flex-shrink-0"
        >
          <Plus size={12} className="text-ink-tertiary" />
        </button>
      </div>
      <span className="text-[11px] text-ink-tertiary font-medium mb-1 leading-tight">{label}</span>
      <p className="text-[17px] font-bold text-ink leading-tight tabular-nums">
        {value} <span className="text-[11px] font-normal text-ink-tertiary">{unit}</span>
      </p>
    </div>
  );
}