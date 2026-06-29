import React from "react";

export default function DateStrip({ selectedDate, onSelect, shotDays }) {
  const days = [];
  const base = new Date(2026, 5, 27); // Sat Jun 27
  for (let i = 0; i < 5; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const sel = selectedDate || new Date(2026, 5, 29);

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      {days.map((d) => {
        const isSelected = d.getDate() === sel.getDate() && d.getMonth() === sel.getMonth();
        const hasShot = (shotDays || [29]).includes(d.getDate());
        return (
          <button
            key={d.getDate()}
            onClick={() => onSelect?.(d)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-[52px] ${
              isSelected
                ? "bg-blue-700 text-white shadow-lg"
                : "text-gray-400"
            }`}
          >
            <span className="text-[11px] font-medium">{dayNames[d.getDay()]}</span>
            <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-600"}`}>{d.getDate()}</span>
            <span className={`text-[11px] ${isSelected ? "text-blue-200" : "text-gray-400"}`}>{monthNames[d.getMonth()]}</span>
            {hasShot && <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
}