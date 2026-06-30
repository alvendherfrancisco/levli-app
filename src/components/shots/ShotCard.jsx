import React from "react";
import { Syringe, MapPin } from "lucide-react";

export default function ShotCard({ medication, dose, drugClass, drug_class, date, time, site, pain }) {
  const dc = drugClass || drug_class || "GLP-1";
  return (
    <div className="bg-white dark:bg-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07] overflow-hidden w-full box-border">
      <div className="flex items-start gap-3 w-full min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/15 flex items-center justify-center flex-shrink-0" style={{ minWidth: 40 }}>
          <Syringe size={18} className="text-green-500" />
        </div>
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-nowrap">
            <span className="font-semibold text-gray-900 dark:text-[#E8E9F0] truncate">{medication}</span>
            <span className="text-blue-600 font-semibold whitespace-nowrap flex-shrink-0">{dose} mg</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap flex-shrink-0">{dc}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-400 min-w-0">
            <span>📅</span>
            <span className="truncate">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 min-w-0">
            <div className="flex items-center gap-1 text-sm text-gray-400 min-w-0">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{site}</span>
            </div>
            {pain > 0 && (
              <span className={`text-xs font-medium flex-shrink-0 ${pain >= 5 ? "text-red-500" : "text-yellow-600"}`}>
                😣 Pain: {pain}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}