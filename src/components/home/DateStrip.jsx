import React from "react";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, toDayKey } from "@/lib/dateUtils";

export default function DateStrip({ selectedDate, onSelectDate }) {
  const { shots } = useAppState();
  const today = new Date();
  const selected = selectedDate || today;

  const shotDayKeys = new Set(
    shots
      .map((s) => {
        const d = parseShotDate(s.date);
        return d ? toDayKey(d) : null;
      })
      .filter(Boolean)
  );

  const days = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex items-center justify-center gap-1.5 py-3 px-3">
      {days.map((d) => {
        const isSelected =
          d.getDate() === selected.getDate() &&
          d.getMonth() === selected.getMonth() &&
          d.getFullYear() === selected.getFullYear();
        const hasShot = shotDayKeys.has(toDayKey(d));
        return (
          <button
            key={d.getTime()}
            onClick={() => onSelectDate && onSelectDate(d)}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl flex-1 min-w-0 max-w-[64px] transition-all active:scale-90 ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-gray-400"
            }`}
          >
            <span className="text-[10px] font-medium">{dayNames[d.getDay()]}</span>
            <span className={`text-base font-bold ${isSelected ? "text-white" : "text-gray-600"}`}>
              {d.getDate()}
            </span>
            {hasShot && (
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}