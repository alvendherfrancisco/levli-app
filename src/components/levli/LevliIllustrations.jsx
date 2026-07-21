import React from "react";

/**
 * Custom Levli illustrations — soft line-art with gradient accent fills.
 * Same family as the onboarding illustrations, extended for empty states,
 * celebration moments, and small header accents.
 * Light, calm, low-contrast. Subtle built-in motion (float / sway / sparkle).
 */

function Scene({ children, blob, className = "", maxW = 220 }) {
  return (
    <div className={`relative w-full mx-auto ${className}`} style={{ maxWidth: maxW }}>
      <div className="relative aspect-[5/4]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: blob }} />
        </div>
        <svg viewBox="0 0 220 176" className="relative w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {children}
        </svg>
      </div>
    </div>
  );
}

// ── Empty journal ───────────────────────────────────────────────────────────
export function EmptyJournalIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #C7D2FE, #99F6E4)">
      <defs>
        <linearGradient id="ejSpine" x1="60" y1="40" x2="80" y2="132" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft">
        <rect x="60" y="40" width="100" height="92" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="60" y="40" width="22" height="92" rx="11" fill="url(#ejSpine)" />
        <line x1="92" y1="62" x2="146" y2="62" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="92" y1="76" x2="146" y2="76" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="92" y1="90" x2="134" y2="90" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="92" y1="104" x2="146" y2="104" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M150 116 c-3-3-7-1-7 3 c0 4 7 7 7 7 s7-3 7-7 c0-4-4-6-7-3Z" fill="#F97316" opacity="0.85" />
      </g>
      <g transform="rotate(35 168 64)">
        <rect x="150" y="58" width="34" height="7" rx="3.5" fill="#14B8A6" />
        <rect x="182" y="58" width="9" height="7" rx="2" fill="#6366F1" />
      </g>
      <g className="animate-onb-sparkle"><path d="M52 56 L 54 61 L 59 63 L 54 65 L 52 70 L 50 65 L 45 63 L 50 61 Z" fill="#F59E0B" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "1s" }}><path d="M176 124 L 178 129 L 183 131 L 178 133 L 176 138 L 174 133 L 169 131 L 174 129 Z" fill="#6366F1" /></g>
    </Scene>
  );
}

// ── Empty medications ───────────────────────────────────────────────────────
export function EmptyMedicationsIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #99F6E4, #C7D2FE)">
      <defs>
        <linearGradient id="emP1" x1="54" y1="66" x2="130" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" /><stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="emP2" x1="150" y1="58" x2="174" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="88" r="44" fill="white" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="3 4" />
      <g className="animate-levli-float-soft">
        <g transform="rotate(-18 92 80)">
          <rect x="54" y="66" width="76" height="28" rx="14" fill="url(#emP1)" />
          <line x1="90" y1="66" x2="90" y2="94" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
        </g>
        <g transform="rotate(18 160 92)">
          <rect x="146" y="58" width="28" height="70" rx="14" fill="url(#emP2)" />
          <line x1="146" y1="92" x2="174" y2="92" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
        </g>
      </g>
      <g className="animate-onb-sparkle"><path d="M52 50 L 54 55 L 59 57 L 54 59 L 52 64 L 50 59 L 45 57 L 50 55 Z" fill="#F59E0B" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.8s" }}><path d="M176 130 L 178 135 L 183 137 L 178 139 L 176 144 L 174 139 L 169 137 L 174 135 Z" fill="#14B8A6" /></g>
    </Scene>
  );
}

// ── Empty inventory ────────────────────────────────────────────────────────
export function EmptyInventoryIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #C7D2FE, #99F6E4)">
      <defs>
        <linearGradient id="eiBox" x1="64" y1="56" x2="156" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft">
        <rect x="64" y="64" width="92" height="64" rx="10" fill="url(#eiBox)" />
        <path d="M64 64 L 80 50 L 110 50 L 110 64 Z" fill="white" fillOpacity="0.25" />
        <path d="M156 64 L 140 50 L 110 50 L 110 64 Z" fill="white" fillOpacity="0.15" />
        <line x1="110" y1="50" x2="110" y2="128" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" />
        <rect x="92" y="86" width="36" height="22" rx="4" fill="white" fillOpacity="0.7" />
        <line x1="98" y1="93" x2="122" y2="93" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="98" y1="100" x2="116" y2="100" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      </g>
      <line x1="48" y1="142" x2="172" y2="142" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <g className="animate-onb-sparkle"><path d="M172 58 L 174 63 L 179 65 L 174 67 L 172 72 L 170 67 L 165 65 L 170 63 Z" fill="#F59E0B" /></g>
    </Scene>
  );
}

// ── Empty shots ────────────────────────────────────────────────────────────
export function EmptyShotsIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #99F6E4, #BFDBFE)">
      <defs>
        <linearGradient id="esSyr" x1="64" y1="68" x2="144" y2="106" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" /><stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft" transform="rotate(-25 108 80)">
        <rect x="66" y="72" width="52" height="15" rx="4" fill="url(#esSyr)" />
        <rect x="60" y="68" width="8" height="23" rx="2" fill="#14B8A6" />
        <rect x="118" y="74" width="6" height="11" fill="#3B82F6" />
        <rect x="124" y="77" width="16" height="5" fill="#93C5FD" />
        <line x1="78" y1="72" x2="78" y2="87" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="90" y1="72" x2="90" y2="87" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="102" y1="72" x2="102" y2="87" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={62 + i * 20} cy={134} r="8" fill={i === 2 ? "#6366F1" : "#E5E7EB"} />
      ))}
      <g className="animate-onb-sparkle"><path d="M176 56 L 178 61 L 183 63 L 178 65 L 176 70 L 174 65 L 169 63 L 174 61 Z" fill="#14B8A6" /></g>
    </Scene>
  );
}

// ── Empty progress (sprout) ────────────────────────────────────────────────
export function EmptyProgressIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #BBF7D0, #99F6E4)">
      <defs>
        <linearGradient id="epPot" x1="86" y1="106" x2="134" y2="142" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="epLeaf" x1="92" y1="60" x2="140" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" /><stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <line x1="60" y1="142" x2="160" y2="142" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M86 112 L 134 112 L 128 140 L 92 140 Z" fill="url(#epPot)" />
      <rect x="82" y="106" width="56" height="10" rx="5" fill="#F97316" />
      <g className="animate-levli-sway">
        <line x1="110" y1="112" x2="110" y2="72" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        <path d="M110 88 C 96 86, 90 76, 92 66 C 102 68, 110 78, 110 88Z" fill="url(#epLeaf)" />
        <path d="M110 80 C 124 78, 130 68, 128 58 C 118 60, 110 70, 110 80Z" fill="url(#epLeaf)" />
      </g>
      <g className="animate-onb-sparkle"><path d="M58 58 L 60 63 L 65 65 L 60 67 L 58 72 L 56 67 L 51 65 L 56 63 Z" fill="#F59E0B" /></g>
    </Scene>
  );
}

// ── Celebration / milestone ────────────────────────────────────────────────
export function CelebrationIllustration({ className }) {
  return (
    <Scene className={className} blob="linear-gradient(135deg, #C7D2FE, #99F6E4)">
      <defs>
        <linearGradient id="celDrop" x1="80" y1="30" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft">
        <path d="M110 36 C 110 36, 80 80, 80 112 a30 30 0 0 0 60 0 C 140 80, 110 36, 110 36Z" fill="url(#celDrop)" />
        <path d="M110 54 C 110 54, 92 84, 92 108 a18 18 0 0 0 36 0" fill="white" fillOpacity="0.15" />
        <path d="M96 100 Q 102 94 108 100" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M112 100 Q 118 94 124 100" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M98 112 Q 110 124 122 112" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      <g className="animate-onb-sparkle"><circle cx="50" cy="48" r="4" fill="#F59E0B" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.4s" }}><circle cx="176" cy="56" r="3.5" fill="#EC4899" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.8s" }}><circle cx="180" cy="120" r="4" fill="#6366F1" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.2s" }}><circle cx="48" cy="120" r="3.5" fill="#14B8A6" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.6s" }}><path d="M160 40 L 162 45 L 167 47 L 162 49 L 160 54 L 158 49 L 153 47 L 158 45 Z" fill="#F97316" /></g>
    </Scene>
  );
}

// ── Compact header accents (inline, transparent) ──────────────────────────
export function InsightsAccent({ size = 72, className }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 96 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iaLine" x1="16" y1="42" x2="78" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" /><stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft">
        <rect x="10" y="14" width="76" height="40" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <path d="M20 42 L 34 32 L 48 36 L 70 22" stroke="url(#iaLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="70" cy="22" r="3" fill="#6366F1" />
      </g>
      <g className="animate-onb-sparkle"><path d="M80 12 L 82 16 L 86 18 L 82 20 L 80 24 L 78 20 L 74 18 L 78 16 Z" fill="#F59E0B" /></g>
    </svg>
  );
}

export function ReportAccent({ size = 72, className }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 96 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="raDoc" x1="26" y1="12" x2="70" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g className="animate-levli-float-soft">
        <rect x="26" y="10" width="44" height="50" rx="8" fill="url(#raDoc)" />
        <line x1="34" y1="24" x2="62" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="34" y1="34" x2="62" y2="34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="34" y1="44" x2="52" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
      </g>
      <g className="animate-onb-sparkle"><path d="M76 12 L 78 16 L 82 18 L 78 20 L 76 24 L 74 20 L 70 18 L 74 16 Z" fill="#F59E0B" /></g>
    </svg>
  );
}