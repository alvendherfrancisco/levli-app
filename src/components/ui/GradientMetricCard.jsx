import React from "react";

/**
 * Animated gradient metric card — signature gradient background per metric,
 * with subtle floating decorative icons, bold value, label, optional sub-stats.
 * Content sits above the animation (animation is always decorative, never obscures).
 *
 * Props:
 * - gradient: tailwind gradient classes (e.g. "from-indigo-500 to-blue-500")
 * - value: string (bold headline)
 * - unit: string
 * - label: string
 * - subStats: [{ icon, text }] optional pills at bottom
 * - floatIcons: [ReactNode] decorative floating icons
 * - onClick: handler
 * - trend: { value, direction } optional trend pill top-right
 */
export default function GradientMetricCard({
  gradient = "from-indigo-500 to-blue-500",
  value = "—",
  unit = "",
  label = "",
  subStats,
  floatIcons,
  onClick,
  trend,
  barChart,
  className = ""
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br hidden ${gradient} p-5 text-left shadow-lg shadow-black/5 transition-all duration-300 active:scale-[0.98] hover:shadow-xl hover:shadow-black/10 ${className}`}>
      
      {/* Floating decorative icons — always behind content, low opacity */}
      {floatIcons &&
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatIcons}
        </div>
      }

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-white/80 text-sm font-medium">{label}</span>
          {trend &&
          <span className="flex items-center gap-1 bg-white/25 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-white">
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </span>
          }
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-white/70 text-sm font-medium">{unit}</span>}
        </div>

        {/* Bar chart (optional) */}
        {barChart &&
        <div className="flex items-end gap-1 h-12 mb-3">
            {barChart.map((h, i) =>
          <div
            key={i}
            className="flex-1 bg-white/30 rounded-t-md transition-all"
            style={{ height: `${h}%` }} />

          )}
          </div>
        }

        {/* Sub-stat pills (optional) */}
        {subStats &&
        <div className="flex flex-wrap gap-2">
            {subStats.map((s, i) =>
          <div key={i} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                {s.icon}
                <span className="text-white/90 text-xs font-medium">{s.text}</span>
              </div>
          )}
          </div>
        }
      </div>
    </button>);

}