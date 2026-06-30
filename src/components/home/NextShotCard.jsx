import React from "react";
import { Syringe } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysUntilShotDate } from "@/lib/dateUtils";

export default function NextShotCard() {
  const { shots, profile } = useAppState();
  const daysBetween = parseInt(profile?.days_between || "7") || 7;

  if (shots.length === 0) {
    return (
      <div className="bg-surface rounded-[20px] p-5 shadow-card border border-border-warm mx-4 mb-5">
        <p className="text-sm text-ink-tertiary mb-2">Next Shot</p>
        <div className="bg-accent-tint rounded-[14px] p-3 flex items-start gap-2">
          <Syringe size={18} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm text-accent">No shots recorded yet. Add your first shot to start tracking your schedule.</p>
        </div>
      </div>
    );
  }

  const last = shots[0];
  const nextDate = addDaysToShotDate(last.date, daysBetween);
  const daysLeft = daysUntilShotDate(nextDate);
  const progress = Math.max(0, Math.min(1, (daysBetween - daysLeft) / daysBetween));
  const r = 34;
  const circumference = 2 * Math.PI * r;

  let daysLabel;
  if (daysLeft <= 0) daysLabel = "Today!";
  else if (daysLeft === 1) daysLabel = "Tomorrow";
  else daysLabel = `In ${daysLeft}d`;

  const ringColor = daysLeft <= 0 ? "#3FA66B" : "#4C5FD5";

  return (
    <div className="bg-surface rounded-[20px] p-5 shadow-card border border-border-warm mx-4 mb-5">
      <p className="text-sm text-ink-tertiary mb-1">Next Shot</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ink">{nextDate}</h3>
          <p className="text-sm font-semibold mt-0.5" style={{ color: ringColor }}>{daysLabel}</p>
          <div className="mt-3 border-t border-border-warm pt-2">
            <p className="text-xs text-ink-tertiary">Last Dose</p>
            <p className="text-sm font-semibold text-ink">{last.date} · {last.dose} mg</p>
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#E8E2D9" strokeWidth="7" />
            <circle
              cx="40" cy="40" r={r} fill="none"
              stroke={ringColor} strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-ink-secondary font-semibold text-center leading-tight px-1">
            {daysLeft <= 0 ? "Now!" : `${daysLeft}d left`}
          </span>
        </div>
      </div>
    </div>
  );
}