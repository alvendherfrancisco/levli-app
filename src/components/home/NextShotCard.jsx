import React from "react";
import { SyringeIcon, CalendarIcon } from "@/components/onboarding/LevliIcons";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysUntilShotDate } from "@/lib/dateUtils";
import { getDosingInterval, getMissedDoseRule } from "@/lib/medicationData";

export default function NextShotCard() {
  const { shots, profile } = useAppState();
  const lastMed = shots[0]?.medication;
  const daysBetween = (lastMed && getDosingInterval(lastMed)) || parseInt(profile?.days_between || "7") || 7;
  const missedRule = lastMed ? getMissedDoseRule(lastMed) : null;

  if (shots.length === 0) {
    return (
      <div className="mx-4 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-teal-500 p-5 shadow-lg shadow-indigo-500/20">
          {/* Floating decorative */}
          <div className="absolute -top-2 -right-2 animate-float-1 opacity-50"><SyringeIcon size={64} /></div>
          <div className="absolute bottom-2 right-12 animate-float-2 opacity-30"><CalendarIcon size={36} /></div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-1">Next Shot</p>
            <h3 className="text-xl font-bold text-white mb-2">Add your first shot</h3>
            <p className="text-white/70 text-sm max-w-[70%]">Tap to log your first dose and start tracking your schedule.</p>
          </div>
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
  const daysLate = Math.max(0, -daysLeft);
  const isLate = daysLeft < 0;
  const isRetitration = missedRule && missedRule.retitrationDays && daysLate > missedRule.retitrationDays;

  let daysLabel;
  if (isDue) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  const gradient = isLate ? "from-orange-500 to-red-500" : isDue ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-blue-500";
  const ringColor = isDue ? "#10B981" : "#6366F1";

  return (
    <>
      <div className="mx-4 mb-4">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 shadow-lg shadow-black/10`}>
          {/* Floating decorative */}
          <div className="absolute -top-2 -right-2 animate-float-1 opacity-40"><SyringeIcon size={64} /></div>
          <div className="absolute bottom-2 right-12 animate-float-2 opacity-25"><CalendarIcon size={32} /></div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Next Shot</p>
              <h3 className="text-2xl font-bold text-white">{nextDate}</h3>
              <p className="text-white/90 text-sm font-semibold mt-0.5">{daysLabel}</p>
              <div className="mt-3 border-t border-white/20 pt-2">
                <p className="text-white/60 text-xs">Last Dose</p>
                <p className="text-white/90 text-sm font-semibold">{last.date} · {last.dose} {last.dose_unit || "mg"}</p>
              </div>
            </div>
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium text-center leading-tight px-1">
                {isDue ? "Now!" : `${daysLeft}d left`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLate && missedRule && (
        <div className={`mx-4 mb-4 rounded-2xl p-3 border ${isRetitration ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"}`}>
          <p className={`text-sm font-semibold ${isRetitration ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300"}`}>
            {isRetitration ? "Late dose — contact your prescriber" : `Scheduled dose is ${daysLate} day${daysLate === 1 ? "" : "s"} late`}
          </p>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{missedRule.advice}</p>
        </div>
      )}
    </>
  );
}