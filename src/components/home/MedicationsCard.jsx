import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { MedsTileIcon } from "@/components/levli/MetricIcons";

/**
 * Active medications at a glance — tappable through to the full Meds page.
 */
export default function MedicationsCard() {
  const { medications } = useAppState();
  const active = (medications || []).filter((m) => m.status === "active" || !m.status);

  return (
    <Link
      to="/medications"
      className="block mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 animate-card-in active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MedsTileIcon size={32} />
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Medications</h3>
            <p className="text-xs text-gray-400">{active.length} active</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
      </div>
      {active.length === 0 ? (
        <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-2 border border-indigo-100/50">
          <p className="text-sm text-indigo-600">Add your medication regimen to track doses and schedule.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {active.slice(0, 3).map((m) => (
            <span key={m.id} className="text-xs bg-indigo-50 text-indigo-600 rounded-full px-2.5 py-1 border border-indigo-100/60 font-medium">
              {m.medication_name}{m.prescribed_dose ? ` · ${m.prescribed_dose}${m.dose_unit || "mg"}` : ""}
            </span>
          ))}
          {active.length > 3 && (
            <span className="text-xs text-gray-400 px-1 py-1">+{active.length - 3} more</span>
          )}
        </div>
      )}
    </Link>
  );
}