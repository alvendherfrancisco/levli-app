import React from "react";

/**
 * Levli navigation icon set — outline (inactive) and filled (active) variants.
 * 24×24 viewBox (shots uses the provided 16×16 path; meds uses 24×24 path).
 * Uses `currentColor` so the parent text-color controls the icon color.
 */

function Svg({ size, className, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function HomeIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <path fill="currentColor" d="M12 3 L21 11 H18.5 V19.5 a1.5 1.5 0 0 1-1.5 1.5 H7 a1.5 1.5 0 0 1-1.5-1.5 V11 H3 Z" />
      ) : (
        <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M3 11 L12 4 L21 11" />
          <path d="M5 10 V20 H10 V15 H14 V20 H19 V10" />
        </g>
      )}
    </Svg>
  );
}

export function ShotsIcon({ size = 20, filled = false, className }) {
  const d = "M7.707 3c.188 0 .367.074.5.207l4.586 4.586a.708.708 0 0 1-1 1L11 8l-5 5H4l-2 2H1v-1l2-2v-2l5-5l-.793-.793A.707.707 0 0 1 7.707 3m3-2c.188 0 .367.074.5.207l3.586 3.586a.708.708 0 0 1-1 1L13 5l-.797.796l-2-2L11 3l-.793-.793a.708.708 0 0 1 .5-1.207";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeWidth={filled ? 0 : 1.4} strokeLinejoin="round" />
    </svg>
  );
}

export function HistoryIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" fill="currentColor" />
          <rect x="7" y="2" width="2" height="4" rx="1" fill="currentColor" />
          <rect x="15" y="2" width="2" height="4" rx="1" fill="currentColor" />
          <rect x="3" y="5" width="18" height="4" fill="white" fillOpacity={0.25} />
        </>
      ) : (
        <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="3" x2="8" y2="6" />
          <line x1="16" y1="3" x2="16" y2="6" />
        </g>
      )}
    </Svg>
  );
}

export function InsightsIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <>
          <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <rect x="6" y="12" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="11" y="9" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="16" y="6" width="3" height="12" rx="1" fill="currentColor" />
        </>
      ) : (
        <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="20" x2="20" y2="20" />
          <rect x="6" y="12" width="3" height="6" rx="1" />
          <rect x="11" y="9" width="3" height="9" rx="1" />
          <rect x="16" y="6" width="3" height="12" rx="1" />
        </g>
      )}
    </Svg>
  );
}

export function MedsIcon({ size = 20, filled = false, className }) {
  const d = "M12.657 2.757a6 6 0 1 1 8.485 8.486l-9.9 9.9a6 6 0 1 1-8.485-8.486zm7.07 7.071l-4.242 4.243l-5.657-5.657l4.243-4.242a4 4 0 1 1 5.657 5.656";
  return (
    <Svg size={size} className={className}>
      <path d={d} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeWidth={filled ? 0 : 2} fillRule="evenodd" strokeLinejoin="round" />
    </Svg>
  );
}

export function StockIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <path fill="currentColor" d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" />
      ) : (
        <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
          <path d="M3 7 L12 12 L21 7" />
          <path d="M12 12 V22" />
        </g>
      )}
    </Svg>
  );
}

export function JournalIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" />
          <g stroke="white" strokeWidth={2} strokeLinecap="round">
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="16" x2="13" y2="16" />
          </g>
        </>
      ) : (
        <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </g>
      )}
    </Svg>
  );
}

export function ProfileIcon({ size = 20, filled = false, className }) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path fill="currentColor" d="M4 21 a8 8 0 0 1 16 0 Z" />
        </>
      ) : (
        <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21 a8 8 0 0 1 16 0" />
        </g>
      )}
    </Svg>
  );
}