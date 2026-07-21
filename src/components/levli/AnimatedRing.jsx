import React, { useState, useEffect } from "react";

/**
 * Animated progress ring — fills from 0 to `progress` on mount/change.
 * Used on Next Shot card and weekly progress.
 */
export default function AnimatedRing({
  progress = 0,
  size = 80,
  stroke = 5,
  color = "#6366F1",
  trackColor = "#E5E7EB",
  glow = true,
  label,
}) {
  const [p, setP] = useState(0);
  const r = (size - stroke) / 2 - 1;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setP(progress), 120);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)",
            filter: glow ? `drop-shadow(0 0 5px ${color}55)` : undefined,
          }}
        />
      </svg>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-center leading-tight px-1">
          {label}
        </span>
      )}
    </div>
  );
}