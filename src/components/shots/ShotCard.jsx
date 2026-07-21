import React from "react";
import { MapPin, Calendar, Activity } from "lucide-react";
import { SyringeIcon } from "@/components/onboarding/LevliIcons";

export default function ShotCard({ medication, dose, dose_unit, drugClass, drug_class, date, time, site, pain }) {
  const dc = drugClass || drug_class || "GLP-1";
  const unit = dose_unit || "mg";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] overflow-hidden w-full box-border transition-all hover:shadow-md">
      <div className="flex items-start gap-3 w-full min-w-0">
        {/* Levli gradient icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
          <SyringeIcon size={36} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800 dark:text-white truncate min-w-0">{medication}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap flex-shrink-0">{dose} {unit}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {dc}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-400 dark:text-gray-500 min-w-0">
            <Calendar size={12} className="flex-shrink-0" />
            <span className="truncate">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 min-w-0">
            {site && (
              <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 min-w-0">
                <MapPin size={12} className="flex-shrink-0" />
                <span className="truncate">{site}</span>
              </div>
            )}
            {pain > 0 && (
              <span className={`text-xs font-medium flex-shrink-0 flex items-center gap-0.5 ${pain >= 5 ? "text-red-500" : "text-amber-600"}`}>
                <Activity size={11} className="flex-shrink-0" /> {pain}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}