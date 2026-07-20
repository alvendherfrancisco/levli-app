import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { SyringeIcon } from "@/components/onboarding/LevliIcons";

export default function ShotCard({ medication, dose, dose_unit, drugClass, drug_class, date, time, site, pain }) {
  const dc = drugClass || drug_class || "GLP-1";
  const unit = dose_unit || "mg";
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden w-full box-border">
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className="flex-shrink-0">
          <SyringeIcon size={40} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800 truncate min-w-0">{medication}</span>
            <span className="text-indigo-600 font-semibold whitespace-nowrap flex-shrink-0">
              {dose} {unit}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400 min-w-0">
            <Calendar size={12} className="flex-shrink-0" />
            <span className="truncate">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 min-w-0">
            {site && (
              <div className="flex items-center gap-1 text-sm text-gray-400 min-w-0">
                <MapPin size={12} className="flex-shrink-0" />
                <span className="truncate">{site}</span>
              </div>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 bg-teal-50 text-teal-600">
              {dc}
            </span>
            {pain > 0 && (
              <span
                className={`text-xs font-medium flex-shrink-0 flex items-center gap-0.5 ${
                  pain >= 5 ? "text-orange-500" : "text-amber-500"
                }`}
              >
                Pain: {pain}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}