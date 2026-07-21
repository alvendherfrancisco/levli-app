import React from "react";
import { Plus, Activity, Heart, Scale, Camera } from "lucide-react";

const ACTIONS = [
  { key: "shot", label: "Log Shot", icon: Plus, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { key: "symptom", label: "Symptom", icon: Activity, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-500/10" },
  { key: "mood", label: "Mood", icon: Heart, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { key: "weight", label: "Weight", icon: Scale, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10" },
  { key: "photo", label: "Photo", icon: Camera, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
];

export default function QuickActions({ onAction }) {
  return (
    <div className="px-4 mb-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {ACTIONS.map(({ key, label, icon: Icon, color, bg }) => (
          <button
            key={key}
            onClick={() => onAction(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${bg} whitespace-nowrap transition-all active:scale-95 hover:scale-105 flex-shrink-0`}
          >
            <Icon size={16} className={color} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}