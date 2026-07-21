import React from "react";

/**
 * Pill-shaped tab group — one filled/indigo active state, light inactive.
 * Used for filter tabs and section headers across the app.
 */
export default function PillTabs({ tabs, active, onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((t) => {
        const value = typeof t === "string" ? t : t.value;
        const label = typeof t === "string" ? t : t.label;
        const isActive = value === active;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}