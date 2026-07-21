import React, { useState } from "react";
import { CalmMoodIcon, EnergizedMoodIcon, LovingMoodIcon, LowMoodIcon, GrowingMoodIcon } from "@/components/onboarding/LevliIcons";

const MOODS = [
  { key: "calm", label: "Calm", Icon: CalmMoodIcon, grad: "from-teal-400 to-blue-500" },
  { key: "energized", label: "Energized", Icon: EnergizedMoodIcon, grad: "from-amber-400 to-orange-500" },
  { key: "loving", label: "Loving", Icon: LovingMoodIcon, grad: "from-orange-400 to-pink-500" },
  { key: "low", label: "Low", Icon: LowMoodIcon, grad: "from-violet-400 to-indigo-500" },
  { key: "growing", label: "Growing", Icon: GrowingMoodIcon, grad: "from-emerald-400 to-teal-500" },
];

export default function CheckInRow({ onLogMood }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (key) => {
    setSelected(key);
    if (onLogMood) onLogMood(key);
  };

  return (
    <div className="px-4 mb-5">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">How are you feeling?</p>
      <div className="flex items-center justify-between gap-1.5">
        {MOODS.map(({ key, label, Icon }) => {
          const isSel = selected === key;
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
                  isSel ? "scale-110 ring-4 ring-indigo-400/40" : "group-hover:scale-105"
                }`}
              >
                <Icon size={48} className="w-full h-full" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isSel ? "text-indigo-600 dark:text-indigo-300" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}