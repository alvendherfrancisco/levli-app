import React from "react";
import { Syringe } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysUntilShotDate, parseShotDate } from "@/lib/dateUtils";

export default function NextShotCard() {
  const { shots, profile } = useAppState();
  const daysBetween = parseInt(profile?.days_between || "7") || 7;

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
  const nextDate = addDaysToShotDate(last.date, daysBetween);
  const daysLeft = daysUntilShotDate(nextDate);
  const progress = Math.max(0, Math.min(1, (daysBetween - daysLeft) / daysBetween));
  const circumference = 2 * Math.PI * 34;

  let daysLabel;
  if (daysLeft <= 0) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4 mb-4">
      <p className="text-sm text-gray-400 mb-1">Next Shot</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{nextDate}</h3>
          <p className="text-sm font-medium text-blue-600 mt-0.5">{daysLabel}</p>
          <div className="mt-2 border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400">Last Dose</p>
            <p className="text-sm font-semibold text-gray-700">{last.date} · {last.dose} mg</p>
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={daysLeft <= 0 ? "hsl(var(--secondary-foreground))" : "hsl(var(--accent-foreground))"} strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-medium text-center leading-tight px-1">
            {daysLeft <= 0 ? "Now!" : `${daysLeft}d left`}
          </span>
        </div>
      </div>
    </div>
  );
}