import React from "react";
import { Syringe } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysUntilShotDate } from "@/lib/dateUtils";

export default function NextShotCard() {
  const { shots, profile } = useAppState();
  const daysBetween = parseInt(profile?.days_between || "7") || 7;

  if (shots.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mx-4 mb-4">
        <p className="text-sm text-gray-400 dark:text-[#9A9DAE] mb-2">Next Shot</p>
        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 flex items-start gap-2">
          <Syringe size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">No shots recorded yet. Add your first shot to start tracking your schedule.</p>
        </div>
      </div>
    );
  }

  const last = shots[0];
  const nextDate = addDaysToShotDate(last.date, daysBetween);
  const daysLeft = daysUntilShotDate(nextDate);
  const progress = Math.max(0, Math.min(1, (daysBetween - daysLeft) / daysBetween));
  const circumference = 2 * Math.PI * 34;

  const isDue = daysLeft <= 0;
  const ringColor = isDue ? "#22C55E" : "#12b886";
  const ringGlow = isDue ? "0 0 14px 3px rgba(34,197,94,0.35)" : "0 0 14px 3px rgba(18,184,134,0.35)";

  let daysLabel;
  if (isDue) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mx-4 mb-4">
      <p className="text-sm text-gray-400 dark:text-[#9A9DAE] mb-1">Next Shot</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">{nextDate}</h3>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">{daysLabel}</p>
          <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
            <p className="text-xs text-gray-400 dark:text-[#9A9DAE]">Last Dose</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-[#E8E9F0]">{last.date} · {last.dose} mg</p>
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            {/* Track ring: subtle dark gray-blue in dark mode */}
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="5"
              className="dark:hidden" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"
              className="hidden dark:block" />
            {/* Progress ring */}
            <circle cx="40" cy="40" r="34" fill="none" stroke={ringColor} strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(${ringGlow})` }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 dark:text-[#9A9DAE] font-medium text-center leading-tight px-1">
            {isDue ? "Now!" : `${daysLeft}d left`}
          </span>
        </div>
      </div>
    </div>
  );
}