import React from "react";
import { Syringe, MapPin } from "lucide-react";

export default function ShotCard({ medication, dose, drugClass, drug_class, date, time, site, pain }) {
  const dc = drugClass || drug_class || "GLP-1";
  return (
    <div className="bg-surface rounded-[20px] p-4 shadow-card border border-border-warm overflow-hidden w-full box-border">
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E7F2DD", minWidth: 40 }}>
          <Syringe size={18} style={{ color: "#2FB8A6" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-nowrap">
            <span className="font-semibold text-ink truncate">{medication}</span>
            <span className="font-semibold whitespace-nowrap flex-shrink-0 text-accent">{dose} mg</span>
            <span className="text-xs px-2 py-0.5 rounded-[10px] font-medium whitespace-nowrap flex-shrink-0 bg-accent-tint text-accent">{dc}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-ink-tertiary min-w-0">
            <span>📅</span>
            <span className="truncate">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 min-w-0">
            <div className="flex items-center gap-1 text-sm text-ink-tertiary min-w-0">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{site}</span>
            </div>
            {pain > 0 && (
              <span className={`text-xs font-medium flex-shrink-0 ${pain >= 5 ? "text-danger" : "text-warning"}`}>
                😣 Pain: {pain}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}