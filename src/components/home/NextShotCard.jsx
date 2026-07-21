import React from "react";
import { SyringeIcon } from "@/components/onboarding/LevliIcons";
import AnimatedRing from "@/components/levli/AnimatedRing";
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
      <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 border border-indigo-100/40 animate-card-in">
        <div className="absolute -right-4 -bottom-4 opacity-25 pointer-events-none">
          <SyringeIcon size={96} />
        </div>
        <div className="relative p-4">
          <p className="text-sm text-gray-400 mb-1">Next Shot</p>
          <p className="text-sm text-gray-600">No shots recorded yet. Add your first shot to start tracking your schedule — we'll handle the countdown for you.</p>
        </div>
      </div>
    );
  }

  const last = shots[0];
  const nextDate = addDaysToShotDate(last.date, daysBetween);
  const daysLeft = daysUntilShotDate(nextDate);
  const progress = Math.max(0, Math.min(1, (daysBetween - daysLeft) / daysBetween));

  const isDue = daysLeft <= 0;
  const daysLate = Math.max(0, -daysLeft);
  const isLate = daysLeft < 0;
  const isRetitration = missedRule && missedRule.retitrationDays && daysLate > missedRule.retitrationDays;
  const ringColor = isDue ? "#22C55E" : "#6366F1";

  let daysLabel;
  if (isDue) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  return (
    <>
      <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 animate-card-in">
        {/* soft gradient wash + corner illustration */}
        <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none">
          <SyringeIcon size={84} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), transparent 70%)" }} />
        <div className="relative p-4">
          <p className="text-sm text-gray-400 mb-1">Next Shot</p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{nextDate}</h3>
              <p className="text-sm font-medium text-indigo-600 mt-0.5">{daysLabel}</p>
              <div className="mt-2 border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-400">Last Dose</p>
                <p className="text-sm font-semibold text-gray-600">
                  {last.date} · {last.dose} {last.dose_unit || "mg"}
                </p>
              </div>
            </div>
            <AnimatedRing
              progress={progress}
              size={80}
              stroke={5}
              color={ringColor}
              label={
                <span className="text-[10px] text-gray-600 font-medium leading-tight">
                  {isDue ? "Now!" : `${daysLeft}d left`}
                </span>
              }
            />
          </div>
        </div>
      </div>
      {isLate && missedRule && (
        <div
          className={`mx-4 mb-4 rounded-2xl p-3 border animate-card-in ${
            isRetitration ? "bg-orange-50 border-orange-100" : "bg-amber-50 border-amber-100"
          }`}
        >
          <p className={`text-sm font-semibold ${isRetitration ? "text-orange-600" : "text-amber-600"}`}>
            {isRetitration ? "Late dose — contact your prescriber" : `Scheduled dose is ${daysLate} day${daysLate === 1 ? "" : "s"} late`}
          </p>
          <p className="text-xs mt-1 text-gray-500">{missedRule.advice}</p>
        </div>
      )}
    </>
  );
}