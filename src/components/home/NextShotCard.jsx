import React from "react";
import { Syringe } from "lucide-react";
import { useAppState } from "@/lib/AppState";

function daysUntil(dateStr) {
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const parts = dateStr.replace(",", "").split(" ");
  const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

function addDaysToDateStr(dateStr, days) {
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jun:5, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const parts = dateStr.replace(",", "").split(" ");
  const d = new Date(parseInt(parts[2]), months[parts[0]] ?? new Date(dateStr).getMonth(), parseInt(parts[1]));
  d.setDate(d.getDate() + days);
  return `${mNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function NextShotCard() {
  const { shots } = useAppState();

  if (shots.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4 mb-4">
        <p className="text-sm text-gray-400 mb-2">Next Shot</p>
        <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
          <Syringe size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">No shots recorded yet. Add your first shot to start tracking your schedule.</p>
        </div>
      </div>
    );
  }

  const last = shots[0];
  const nextDate = addDaysToDateStr(last.date, 7);
  const daysLeft = daysUntil(nextDate);
  const progress = Math.max(0, Math.min(1, (7 - daysLeft) / 7));
  const circumference = 2 * Math.PI * 34;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4 mb-4">
      <p className="text-sm text-gray-400 mb-1">Next Shot</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{nextDate}</h3>
          <div className="mt-2 border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400">Last Dose</p>
            <p className="text-sm font-semibold text-gray-700">{last.date}</p>
            <p className="text-sm text-gray-500">{last.dose} mg</p>
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="5" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#3B6FE0" strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-medium text-center leading-tight px-1">
            {daysLeft <= 0 ? "Today!" : `${daysLeft}d`}
          </span>
        </div>
      </div>
    </div>
  );
}