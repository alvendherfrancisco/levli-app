import React from "react";
import { Syringe } from "lucide-react";
import { SyringeIcon } from "@/components/onboarding/LevliIcons";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysUntilShotDate } from "@/lib/dateUtils";
import { getDosingInterval, getMissedDoseRule } from "@/lib/medicationData";

export default function NextShotCard() {
  const { shots, profile } = useAppState();
  const lastMed = shots[0]?.medication;
  const daysBetween =
    (lastMed && getDosingInterval(lastMed)) || parseInt(profile?.days_between || "7") || 7;
  const missedRule = lastMed ? getMissedDoseRule(lastMed) : null;

  if (shots.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 mx-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <SyringeIcon size={36} />
          <p className="text-sm font-semibold text-gray-600">Next shot</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 flex items-start gap-2 border border-indigo-100/50">
          <Syringe size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-indigo-600">
            No shots recorded yet. Add your first shot to start tracking your schedule.
          </p>
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
  const ringColor = isDue ? "#22C55E" : "#6366F1";
  const ringGlow = isDue ? "0 0 14px 3px rgba(34,197,94,0.3)" : "0 0 14px 3px rgba(99,102,241,0.25)";

  let daysLabel;
  if (isDue) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 mx-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <SyringeIcon size={36} />
          <div>
            <p className="text-xs text-gray-400">Next shot</p>
            <p className="text-sm font-semibold text-gray-600">{last.medication}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{nextDate}</h3>
            <p className="text-sm font-medium text-indigo-600 mt-0.5">{daysLabel}</p>
            <div className="mt-2 border-t border-gray-100 pt-2">
              <p className="text-xs text-gray-400">Last dose</p>
              <p className="text-sm font-semibold text-gray-600">
                {last.date} · {last.dose} {last.dose_unit || "mg"}
              </p>
            </div>
          </div>
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="5" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={ringColor}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(${ringGlow})` }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-medium text-center leading-tight px-1">
              {isDue ? "Now!" : `${daysLeft}d left`}
            </span>
          </div>
        </div>
      </div>
      {isLate && missedRule && (
        <div
          className={`mx-4 mb-4 rounded-2xl p-3 border ${
            isRetitration
              ? "bg-orange-50 border-orange-100"
              : "bg-amber-50 border-amber-100"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isRetitration ? "text-orange-600" : "text-amber-600"
            }`}
          >
            {isRetitration
              ? "Late dose — contact your prescriber"
              : `Scheduled dose is ${daysLate} day${daysLate === 1 ? "" : "s"} late`}
          </p>
          <p className="text-xs mt-1 text-gray-500">{missedRule.advice}</p>
        </div>
      )}
    </>
  );
}