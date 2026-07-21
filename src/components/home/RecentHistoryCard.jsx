import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { HistoryTileIcon } from "@/components/levli/MetricIcons";

/**
 * Recent shots feed — tappable through to the full History page.
 */
export default function RecentHistoryCard() {
  const { shots } = useAppState();
  const recent = (shots || []).slice(0, 3);

  return (
    <Link
      to="/history"
      className="block mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 animate-card-in active:scale-[0.99] transition-transform"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HistoryTileIcon size={32} />
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Recent history</h3>
            <p className="text-xs text-gray-400">{shots.length} total shots</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
      </div>
      {recent.length === 0 ? (
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100/50">
          <p className="text-sm text-blue-600">Your logged doses will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700 truncate">{s.medication} · {s.dose}{s.dose_unit || "mg"}</p>
                <p className="text-xs text-gray-400">{s.date}{s.time ? ` · ${s.time}` : ""}</p>
              </div>
              {s.site && <span className="text-xs text-gray-400 truncate hidden sm:block">{s.site}</span>}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}