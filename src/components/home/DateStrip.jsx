import React from "react";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, toDayKey } from "@/lib/dateUtils";

export default function DateStrip() {
  const { shots } = useAppState();
  const today = new Date();

  // Build set of day keys that have shots
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

  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      {days.map((d) => {
        const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        const hasShot = shotDayKeys.has(toDayKey(d));
        return (
          <div key={d.getTime()}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl min-w-[52px] ${isToday ? "bg-blue-700 text-white shadow-lg" : "text-gray-400"}`}>
            <span className="text-[11px] font-medium">{dayNames[d.getDay()]}</span>
            <span className={`text-lg font-bold ${isToday ? "text-white" : "text-gray-600"}`}>{d.getDate()}</span>
            <span className={`text-[11px] ${isToday ? "text-blue-200" : "text-gray-400"}`}>{monthNames[d.getMonth()]}</span>
            {hasShot && <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5" />}
          </div>
        );
      })}
    </div>
  );
}