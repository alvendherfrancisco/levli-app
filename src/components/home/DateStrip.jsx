import React from "react";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, toDayKey } from "@/lib/dateUtils";

export default function DateStrip({ selectedDate, onSelectDate }) {
  const { shots } = useAppState();
  const today = new Date();
  const selected = selectedDate || today;

  const shotDayKeys = new Set(shots.map((s) => {
    const d = parseShotDate(s.date);
    return d ? toDayKey(d) : null;
  }).filter(Boolean));

  const days = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="flex items-center gap-2 px-4 py-3 mb-1">
      {days.map((d) => {
        const isSelected = d.getDate() === selected.getDate() && d.getMonth() === selected.getMonth() && d.getFullYear() === selected.getFullYear();
        const hasShot = shotDayKeys.has(toDayKey(d));
        return (
          <button
            key={d.getTime()}
            onClick={() => onSelectDate && onSelectDate(d)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 max-w-[60px] py-2.5 rounded-2xl transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105"
                : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04]"
            }`}
          >
            <span className="text-[10px] font-medium">{dayNames[d.getDay()]}</span>
            <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-700 dark:text-gray-200"}`}>{d.getDate()}</span>
            <span className={`text-[9px] ${isSelected ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}>{monthNames[d.getMonth()]}</span>
            {hasShot && (
              <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-emerald-400"}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}