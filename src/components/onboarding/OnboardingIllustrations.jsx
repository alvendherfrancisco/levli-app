import React from "react";

/**
 * Levli Onboarding Illustration System
 * ──────────────────────────────────────────────────────────────────────────
 * Style Guide:
 *   Canvas:      280×200 viewBox, responsive width, max 280px
 *   Palette:     Primary  indigo #6366F1 → teal #14B8A6
 *                Accent   orange #F97316 → coral #EC4899
 *                Sparkles amber #F59E0B, indigo #6366F1, teal #14B8A6
 *   Line weight:  2.5px features, 1.5px details, 3px mascot face
 *   Corners:     14-16px cards, 7-8px small elements, 12px chips
 *   Glow:        176×176 blurred blob, indigo→teal, 50% opacity
 *   Sparkles:    3 fixed — top-left amber, top-right indigo (1s delay),
 *                bottom-left teal (0.5s delay)
 *   Mascot:      Small droplet cameo (r≈12) in every mid-step illustration,
 *                acting as a guide character throughout the onboarding flow
 * ──────────────────────────────────────────────────────────────────────────
 */

function Scene({ children, className = "" }) {
  return (
    <div className={`relative w-full max-w-[280px] mx-auto aspect-[7/5] ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-44 h-44 rounded-full blur-3xl opacity-50" style={{ background: "linear-gradient(135deg, #818CF8, #5EEAD4)" }} />
      </div>
      <svg viewBox="0 0 280 200" className="relative w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </div>
  );
}

// Standardized 3-sparkle pattern at fixed positions
function Sparkles() {
  return (
    <>
      <g className="animate-onb-sparkle"><path d="M50 50 L 53 57 L 60 60 L 53 63 L 50 70 L 47 63 L 40 60 L 47 57Z" fill="#F59E0B" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "1s" }}><path d="M230 50 L 232 55 L 237 57 L 232 59 L 230 64 L 228 59 L 223 57 L 228 55Z" fill="#6366F1" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.5s" }}><path d="M48 145 L 50 150 L 55 152 L 50 154 L 48 159 L 46 154 L 41 152 L 46 150Z" fill="#14B8A6" /></g>
    </>
  );
}

// Small droplet mascot cameo — guide character throughout onboarding
function MascotCameo({ cx, cy, r = 12, gradId }) {
  const top = cy - r * 1.4;
  const sideR = r * 0.7;
  const eyeR = Math.max(r * 0.12, 1.5);
  const smileW = Math.max(r * 0.08, 1);
  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1={cx} y1={top} x2={cx} y2={cy + r} gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <path
        d={`M${cx} ${top} C ${cx} ${top}, ${cx - sideR} ${cy - r * 0.3}, ${cx - sideR} ${cy + r * 0.3} a${sideR} ${sideR} 0 0 0 ${sideR * 2} 0 C ${cx + sideR} ${cy - r * 0.3}, ${cx} ${top}, ${cx} ${top}Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={`M${cx} ${top + r * 0.35} C ${cx} ${top + r * 0.35}, ${cx - sideR * 0.6} ${cy - r * 0.1}, ${cx - sideR * 0.6} ${cy + r * 0.1} a${sideR * 0.6} ${sideR * 0.6} 0 0 0 ${sideR * 0.6} ${sideR * 0.6}`}
        fill="white" fillOpacity="0.15"
      />
      <circle cx={cx - r * 0.2} cy={cy - r * 0.05} r={eyeR} fill="white" />
      <circle cx={cx + r * 0.2} cy={cy - r * 0.05} r={eyeR} fill="white" />
      <path d={`M${cx - r * 0.15} ${cy + r * 0.2} Q ${cx} ${cy + r * 0.35} ${cx + r * 0.15} ${cy + r * 0.2}`} stroke="white" strokeWidth={smileW} strokeLinecap="round" fill="none" />
    </g>
  );
}

// ── 1. Welcome — droplet mascot with heart ─────────────────────────────────
export function WelcomeIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="welDrop" x1="80" y1="30" x2="200" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="welHeart" x1="190" y1="40" x2="230" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path d="M140 40 C 140 40, 95 95, 95 135 a45 45 0 0 0 90 0 C 185 95, 140 40, 140 40Z" fill="url(#welDrop)" />
      <path d="M140 65 C 140 65, 112 105, 112 132 a28 28 0 0 0 28 28" fill="white" fillOpacity="0.15" />
      <circle cx="126" cy="125" r="4" fill="white" />
      <circle cx="154" cy="125" r="4" fill="white" />
      <path d="M128 140 Q 140 150 152 140" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M210 50 c-4-5-13-2-13 4 c0 6 13 12 13 12 s13-6 13-12 c0-6-9-9-13-4Z" fill="url(#welHeart)" />
      <Sparkles />
    </Scene>
  );
}

// ── 2. Empathy — calendar + heartbeat, mascot peeking ──────────────────────
export function EmpathyIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="empCal" x1="70" y1="50" x2="190" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      {/* mascot peeking from behind bottom-right of calendar */}
      <MascotCameo cx={210} cy={160} r={12} gradId="empMascot" />
      {/* calendar card */}
      <rect x="75" y="55" width="130" height="100" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="75" y="55" width="130" height="26" rx="14" fill="url(#empCal)" />
      <rect x="75" y="68" width="130" height="13" fill="url(#empCal)" />
      <line x1="100" y1="44" x2="100" y2="62" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
      <line x1="180" y1="44" x2="180" y2="62" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="96" cy="100" r="3" fill="#E5E7EB" />
      <circle cx="116" cy="100" r="3" fill="#E5E7EB" />
      <circle cx="136" cy="100" r="3" fill="#E5E7EB" />
      <circle cx="156" cy="100" r="3" fill="#6366F1" />
      <circle cx="176" cy="100" r="3" fill="#E5E7EB" />
      <circle cx="96" cy="120" r="3" fill="#E5E7EB" />
      <circle cx="116" cy="120" r="3" fill="#E5E7EB" />
      <circle cx="136" cy="120" r="3" fill="#E5E7EB" />
      <circle cx="156" cy="120" r="3" fill="#E5E7EB" />
      <circle cx="176" cy="120" r="3" fill="#E5E7EB" />
      <path d="M85 140 L 115 140 L 123 122 L 132 155 L 140 128 L 148 140 L 195 140" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Sparkles />
    </Scene>
  );
}

// ── 3. Medication — pill capsules, mascot watching ─────────────────────────
export function MedicationIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="medP1" x1="60" y1="70" x2="140" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="medP2" x1="160" y1="60" x2="200" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* pill 1 (horizontal) */}
      <g transform="rotate(-18 100 92)">
        <rect x="60" y="78" width="80" height="28" rx="14" fill="url(#medP1)" />
        <line x1="98" y1="78" x2="98" y2="106" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      </g>
      {/* pill 2 (vertical) */}
      <g transform="rotate(15 175 100)">
        <rect x="162" y="65" width="28" height="70" rx="14" fill="url(#medP2)" />
        <line x1="162" y1="98" x2="190" y2="98" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      </g>
      {/* mascot watching from the right */}
      <MascotCameo cx={225} cy={140} r={12} gradId="medMascot" />
      <Sparkles />
    </Scene>
  );
}

// ── 4. Sign-Up — profile/ID card, mascot peeking from top ──────────────────
export function SignUpIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="sigCard" x1="70" y1="50" x2="200" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="sigAvatar" x1="120" y1="70" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* mascot peeking from behind top-right of card */}
      <MascotCameo cx={210} cy={45} r={10} gradId="sigMascot" />
      {/* profile card */}
      <rect x="72" y="52" width="136" height="104" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="72" y="52" width="136" height="30" rx="16" fill="url(#sigCard)" />
      <rect x="72" y="68" width="136" height="14" fill="url(#sigCard)" />
      <line x1="86" y1="64" x2="118" y2="64" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="112" cy="108" r="22" fill="url(#sigAvatar)" />
      <circle cx="112" cy="101" r="8" fill="white" />
      <path d="M96 122 a16 16 0 0 1 32 0Z" fill="white" />
      <line x1="146" y1="98" x2="192" y2="98" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
      <line x1="146" y1="112" x2="184" y2="112" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
      <line x1="146" y1="126" x2="190" y2="126" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
      <circle cx="188" cy="150" r="14" fill="#F97316" />
      <path d="M182 150 H 194 M 188 144 V 156" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <Sparkles />
    </Scene>
  );
}

// ── 5. Verify Email — envelope with code, mascot watching ─────────────────
export function VerifyEmailIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="verEnv" x1="80" y1="60" x2="200" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      {/* envelope body */}
      <rect x="80" y="65" width="120" height="72" rx="12" fill="url(#verEnv)" />
      {/* flap */}
      <path d="M80 73 L 140 108 L 200 73" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25" />
      {/* code dots */}
      <circle cx="120" cy="120" r="5" fill="white" opacity="0.8" />
      <circle cx="140" cy="120" r="5" fill="white" opacity="0.8" />
      <circle cx="160" cy="120" r="5" fill="white" opacity="0.8" />
      {/* notification badge */}
      <circle cx="195" cy="60" r="12" fill="#F97316" />
      <circle cx="190" cy="60" r="2" fill="white" />
      <circle cx="195" cy="60" r="2" fill="white" />
      <circle cx="200" cy="60" r="2" fill="white" />
      {/* mascot watching from the right */}
      <MascotCameo cx={225} cy={135} r={12} gradId="verMascot" />
      <Sparkles />
    </Scene>
  );
}

// ── 6. Privacy — shield with check, mascot peeking from left ───────────────
export function PrivacyIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="privSh" x1="90" y1="35" x2="190" y2="165" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      {/* mascot peeking from behind bottom-left of shield */}
      <MascotCameo cx={72} cy={170} r={11} gradId="privMascot" />
      {/* shield */}
      <path d="M140 38 L 195 58 V 100 C 195 130, 170 150, 140 165 C 110 150, 85 130, 85 100 V 58 Z" fill="url(#privSh)" />
      <path d="M140 48 L 185 64 V 100 C 185 124, 165 140, 140 152 C 115 140, 95 124, 95 100 V 64 Z" fill="white" fillOpacity="0.1" />
      {/* check */}
      <path d="M118 100 L 132 114 L 162 82" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Sparkles />
    </Scene>
  );
}

// ── 7. Schedule — syringe + day dots, mascot watching ──────────────────────
export function ScheduleIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="schSyr" x1="60" y1="50" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      {/* syringe */}
      <g transform="rotate(-25 120 90)">
        <rect x="80" y="82" width="56" height="16" rx="4" fill="url(#schSyr)" />
        <rect x="74" y="78" width="8" height="24" rx="2" fill="#6366F1" />
        <rect x="136" y="84" width="6" height="12" fill="#14B8A6" />
        <rect x="142" y="87" width="18" height="6" fill="#818CF8" />
        <line x1="92" y1="82" x2="92" y2="98" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="104" y1="82" x2="104" y2="98" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="116" y1="82" x2="116" y2="98" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {/* day dots */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={70 + i * 22} cy={160} r="9" fill={i === 3 ? "#6366F1" : "#E5E7EB"} />
      ))}
      {/* mascot watching from the right */}
      <MascotCameo cx={238} cy={155} r={10} gradId="schMascot" />
      <Sparkles />
    </Scene>
  );
}

// ── 8. Tracking — mascot surrounded by tracking chips ────────────────────
export function TrackingIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="trkHeart" x1="120" y1="25" x2="160" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="trkScale" x1="70" y1="130" x2="110" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="trkSmile" x1="170" y1="130" x2="210" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      {/* central mascot */}
      <MascotCameo cx={140} cy={105} r={18} gradId="trkMascot" />
      {/* heart chip (top) — mood/feelings */}
      <circle cx="140" cy="48" r="20" fill="url(#trkHeart)" />
      <path d="M140 42 c-4-5-10-2-10 4 c0 6 10 10 10 10 s10-4 10-10 c0-6-6-9-10-4Z" fill="white" />
      {/* scale chip (bottom-left) — weight */}
      <circle cx="90" cy="150" r="20" fill="url(#trkScale)" />
      <path d="M78 152 a12 12 0 0 1 24 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="90" y1="152" x2="96" y2="146" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="90" cy="152" r="2" fill="white" />
      {/* smiley chip (bottom-right) — symptoms */}
      <circle cx="190" cy="150" r="20" fill="url(#trkSmile)" />
      <circle cx="184" cy="145" r="2" fill="white" />
      <circle cx="196" cy="145" r="2" fill="white" />
      <path d="M183 155 Q 190 161 197 155" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Sparkles />
    </Scene>
  );
}

// ── 9. Completion — mascot celebrating ───────────────────────────────────
export function CompletionIllustration({ className }) {
  return (
    <Scene className={className}>
      <defs>
        <linearGradient id="compDrop" x1="90" y1="30" x2="190" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" /><stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      {/* droplet mascot */}
      <path d="M140 38 C 140 38, 95 95, 95 135 a45 45 0 0 0 90 0 C 185 95, 140 38, 140 38Z" fill="url(#compDrop)" />
      <path d="M140 63 C 140 63, 112 105, 112 132 a28 28 0 0 0 28 28" fill="white" fillOpacity="0.15" />
      {/* eyes (happy, curved) */}
      <path d="M120 122 Q 126 116 132 122" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M148 122 Q 154 116 160 122" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* big smile */}
      <path d="M122 138 Q 140 152 158 138" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* celebration confetti */}
      <g className="animate-onb-sparkle"><circle cx="55" cy="55" r="5" fill="#F59E0B" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.4s" }}><circle cx="230" cy="65" r="4" fill="#EC4899" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.8s" }}><circle cx="240" cy="135" r="5" fill="#6366F1" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.2s" }}><circle cx="50" cy="140" r="4" fill="#14B8A6" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "0.6s" }}><path d="M210 40 L 212 45 L 217 47 L 212 49 L 210 54 L 208 49 L 203 47 L 208 45Z" fill="#F97316" /></g>
      <g className="animate-onb-sparkle" style={{ animationDelay: "1s" }}><path d="M65 120 L 67 125 L 72 127 L 67 129 L 65 134 L 63 129 L 58 127 L 63 125Z" fill="#A78BFA" /></g>
    </Scene>
  );
}