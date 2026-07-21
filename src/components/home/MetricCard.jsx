import React from "react";

/**
 * Dark, rich animated metric card.
 * Deep fill + white text (WCAG AA). A large faded icon animates in the corner;
 * some metrics add small falling accent dots. Empty state shows "Tap to log".
 */
const ANIM_CLASS = {
  float: "metricFloat",
  flicker: "metricFlicker",
  pulse: "metricPulse",
  bounce: "metricBounce",
  sway: "metricSway",
};

export default function MetricCard({ Icon, label, value, unit, theme, empty, onAdd }) {
  const { bg, accent, anim, dots } = theme;
  return (
    <button
      onClick={onAdd}
      className="relative overflow-hidden rounded-2xl p-3 text-left min-h-[104px] flex flex-col justify-between active:scale-[0.97] transition-transform"
      style={{ background: bg }}
    >
      {/* Large faded background icon with subtle motion */}
      <div className={`absolute -bottom-2 -right-1 opacity-[0.18] pointer-events-none ${ANIM_CLASS[anim] || ""}`}>
        <Icon size={52} className="text-white" strokeWidth={1.5} />
      </div>

      {/* Falling accent dots (water / fiber) */}
      {dots && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {dots.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: d.left,
                top: d.top,
                width: d.size,
                height: d.size,
                background: accent,
                opacity: empty ? 0.25 : 0.45,
                animation: `${d.anim} ${d.dur}s ease-in-out infinite ${d.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center mb-1.5">
          <Icon size={15} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-[10px] text-white/70 font-medium block leading-tight">{label}</span>
      </div>
      <p className="relative z-10 font-bold text-white text-lg leading-tight">
        {empty ? (
          <span className="text-white/55 text-xs font-medium">Tap to log</span>
        ) : (
          <>
            {value} <span className="text-xs font-normal text-white/60">{unit}</span>
          </>
        )}
      </p>
    </button>
  );
}