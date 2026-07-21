import React, { useId } from "react";

/**
 * Levli custom icon set — soft-gradient "sticker" style.
 * One consistent icon system throughout the app. Reusable everywhere.
 */

function useGid(prefix) {
  const raw = useId();
  return `${prefix}${raw.replace(/[:]/g, "")}`;
}

function SvgIcon({ size = 48, className = "", children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Grad({ id, from, to }) {
  return (
    <linearGradient id={id} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
      <stop stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

// ── Droplet (mascot) ──────────────────────────────────────────────────────
export function DropletIcon({ size = 48, className }) {
  const gid = useGid("drop");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#14B8A6" /></defs>
      <path d="M24 6 C24 6, 12 20, 12 30 a12 12 0 0 0 24 0 C36 20, 24 6, 24 6Z" fill={`url(#${gid})`} />
      <path d="M24 16 C24 16, 18 24, 18 30 a6 6 0 0 0 12 0" fill="white" fillOpacity="0.25" />
    </SvgIcon>
  );
}

// ── Pill capsule ──────────────────────────────────────────────────────────
export function PillIcon({ size = 48, className }) {
  const gid = useGid("pill");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#6366F1" /></defs>
      <rect x="8" y="14" width="32" height="20" rx="10" fill={`url(#${gid})`} />
      <line x1="24" y1="14" x2="24" y2="34" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    </SvgIcon>
  );
}

// ── Heart ──────────────────────────────────────────────────────────────────
export function HeartIcon({ size = 48, className }) {
  const gid = useGid("heart");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F97316" to="#EC4899" /></defs>
      <path d="M24 38 C24 38, 8 28, 8 18 a8 8 0 0 1 16 -2 a8 8 0 0 1 16 2 C40 28, 24 38, 24 38Z" fill={`url(#${gid})`} />
      <path d="M16 16 a3 3 0 0 1 3 -3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
    </SvgIcon>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────
export function CalendarIcon({ size = 48, className }) {
  const gid = useGid("cal");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#3B82F6" /></defs>
      <rect x="8" y="12" width="32" height="28" rx="6" fill={`url(#${gid})`} />
      <rect x="8" y="12" width="32" height="8" rx="6" fill="white" fillOpacity="0.25" />
      <circle cx="16" cy="28" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="24" cy="28" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="32" cy="28" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="16" cy="34" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="24" cy="34" r="2" fill="white" fillOpacity="0.6" />
    </SvgIcon>
  );
}

// ── Chart line ─────────────────────────────────────────────────────────────
export function ChartIcon({ size = 48, className }) {
  const gid = useGid("chart");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#6366F1" /></defs>
      <rect x="8" y="10" width="32" height="30" rx="6" fill={`url(#${gid})`} />
      <path d="M14 30 L 20 24 L 26 28 L 34 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="34" cy="16" r="2.5" fill="white" />
    </SvgIcon>
  );
}

// ── Shield (friendly, softened) ────────────────────────────────────────────
export function ShieldIcon({ size = 48, className }) {
  const gid = useGid("shield");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F97316" to="#EF4444" /></defs>
      <path d="M24 6 L 38 12 V 24 C 38 32, 32 38, 24 42 C 16 38, 10 32, 10 24 V 12 Z" fill={`url(#${gid})`} />
      <path d="M18 24 L 22 28 L 30 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </SvgIcon>
  );
}

// ── Syringe ────────────────────────────────────────────────────────────────
export function SyringeIcon({ size = 48, className }) {
  const gid = useGid("syr");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <rect x="6" y="6" width="36" height="36" rx="10" fill={`url(#${gid})`} />
      <g transform="rotate(-35 24 24)">
        <rect x="14" y="18" width="20" height="6" rx="1" fill="white" fillOpacity="0.9" />
        <rect x="33" y="19" width="3" height="4" fill="white" fillOpacity="0.7" />
        <rect x="36" y="20" width="6" height="2" fill="white" fillOpacity="0.5" />
        <rect x="12" y="17" width="3" height="8" rx="1" fill="white" fillOpacity="0.8" />
        <line x1="18" y1="18" x2="18" y2="24" stroke="#14B8A6" strokeWidth="0.8" />
        <line x1="22" y1="18" x2="22" y2="24" stroke="#14B8A6" strokeWidth="0.8" />
        <line x1="26" y1="18" x2="26" y2="24" stroke="#14B8A6" strokeWidth="0.8" />
        <line x1="30" y1="18" x2="30" y2="24" stroke="#14B8A6" strokeWidth="0.8" />
      </g>
    </SvgIcon>
  );
}

// ── Mood / smile ───────────────────────────────────────────────────────────
export function MoodIcon({ size = 48, className }) {
  const gid = useGid("mood");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="18" cy="20" r="2" fill="white" />
      <circle cx="30" cy="20" r="2" fill="white" />
      <path d="M17 28 Q 24 35 31 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Scale (weight) ─────────────────────────────────────────────────────────
export function ScaleIcon({ size = 48, className }) {
  const gid = useGid("scale");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#8B5CF6" to="#6366F1" /></defs>
      <rect x="8" y="14" width="32" height="24" rx="6" fill={`url(#${gid})`} />
      <circle cx="24" cy="26" r="7" fill="white" fillOpacity="0.2" />
      <circle cx="24" cy="26" r="5" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="24" y1="26" x2="28" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="26" r="1.5" fill="white" />
    </SvgIcon>
  );
}

// ── Nutrition (leaf) ───────────────────────────────────────────────────────
export function NutritionIcon({ size = 48, className }) {
  const gid = useGid("nut");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#10B981" to="#14B8A6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M16 30 C 16 22, 22 16, 32 16 C 32 24, 26 30, 16 30Z" fill="white" fillOpacity="0.85" />
      <path d="M18 28 C 20 24, 24 22, 28 20" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Injection site ─────────────────────────────────────────────────────────
export function InjectionSiteIcon({ size = 48, className }) {
  const gid = useGid("site");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="24" cy="24" r="10" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
      <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="#14B8A6" />
    </SvgIcon>
  );
}

// ── Sparkle ────────────────────────────────────────────────────────────────
export function SparkleIcon({ size = 16, className }) {
  const gid = useGid("spark");
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <path d="M8 1 L 9.5 6 L 14 7.5 L 9.5 9 L 8 14 L 6.5 9 L 2 7.5 L 6.5 6 Z" fill={`url(#${gid})`} />
    </svg>
  );
}

// ── Flame (streak / calories) ──────────────────────────────────────────────
export function FlameIcon({ size = 48, className }) {
  const gid = useGid("flame");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F97316" to="#EC4899" /></defs>
      <path d="M24 6 C 24 6, 30 14, 30 20 C 30 24, 28 26, 28 26 C 28 22, 26 20, 24 20 C 24 20, 22 22, 22 26 C 22 26, 18 24, 18 20 C 18 14, 24 6, 24 6Z" fill={`url(#${gid})`} />
      <path d="M24 26 C 24 26, 28 30, 28 34 a4 4 0 0 1 -8 0 C 20 30, 24 26, 24 26Z" fill="#F59E0B" />
    </SvgIcon>
  );
}

// ── Water droplet (hydration) ──────────────────────────────────────────────
export function WaterDropIcon({ size = 48, className }) {
  const gid = useGid("water");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#3B82F6" to="#14B8A6" /></defs>
      <path d="M24 8 C 24 8, 14 22, 14 30 a10 10 0 0 0 20 0 C 34 22, 24 8, 24 8Z" fill={`url(#${gid})`} />
      <path d="M24 16 C 24 16, 19 24, 19 30 a5 5 0 0 0 10 0" fill="white" fillOpacity="0.2" />
    </SvgIcon>
  );
}

// ── Footprint (exercise / steps) ────────────────────────────────────────────
export function FootprintIcon({ size = 48, className }) {
  const gid = useGid("foot");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#8B5CF6" to="#6366F1" /></defs>
      <ellipse cx="20" cy="24" rx="6" ry="9" fill={`url(#${gid})`} />
      <circle cx="16" cy="14" r="2.5" fill={`url(#${gid})`} />
      <circle cx="21" cy="11" r="2" fill={`url(#${gid})`} />
      <circle cx="25" cy="12" r="1.5" fill={`url(#${gid})`} />
      <ellipse cx="32" cy="28" rx="5" ry="7" fill={`url(#${gid})`} fillOpacity="0.6" />
    </SvgIcon>
  );
}

// ── Camera (progress) ──────────────────────────────────────────────────────
export function CameraIcon({ size = 48, className }) {
  const gid = useGid("cam");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#EC4899" /></defs>
      <rect x="8" y="14" width="32" height="26" rx="6" fill={`url(#${gid})`} />
      <rect x="16" y="10" width="16" height="8" rx="3" fill={`url(#${gid})`} />
      <circle cx="24" cy="27" r="7" fill="white" fillOpacity="0.2" />
      <circle cx="24" cy="27" r="5" fill="white" fillOpacity="0.4" />
      <circle cx="24" cy="27" r="3" fill="white" />
    </SvgIcon>
  );
}

// ── Package (inventory) ────────────────────────────────────────────────────
export function PackageIcon({ size = 48, className }) {
  const gid = useGid("pkg");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <path d="M24 6 L 38 13 V 33 L 24 40 L 10 33 V 13 Z" fill={`url(#${gid})`} />
      <path d="M10 13 L 24 20 L 38 13" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      <path d="M24 20 V 40" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    </SvgIcon>
  );
}

// ── Document (report) ──────────────────────────────────────────────────────
export function DocumentIcon({ size = 48, className }) {
  const gid = useGid("doc");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#3B82F6" /></defs>
      <path d="M14 6 L 30 6 L 38 14 V 40 a2 2 0 0 1 -2 2 H 14 a2 2 0 0 1 -2 -2 V 8 a2 2 0 0 1 2 -2Z" fill={`url(#${gid})`} />
      <path d="M30 6 L 30 14 L 38 14" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      <line x1="18" y1="22" x2="32" y2="22" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="18" y1="28" x2="32" y2="28" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="18" y1="34" x2="28" y2="34" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
    </SvgIcon>
  );
}

// ── Bell (notifications) ───────────────────────────────────────────────────
export function BellIcon({ size = 48, className }) {
  const gid = useGid("bell");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <path d="M24 8 C 20 8, 16 12, 16 18 V 28 L 12 32 V 34 H 36 V 32 L 32 28 V 18 C 32 12, 28 8, 24 8Z" fill={`url(#${gid})`} />
      <path d="M21 36 a3 3 0 0 0 6 0" stroke="white" strokeWidth="2" strokeOpacity="0.6" fill="none" />
    </SvgIcon>
  );
}

// ── Help / question ────────────────────────────────────────────────────────
export function HelpIcon({ size = 48, className }) {
  const gid = useGid("help");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M19 19 C 19 16, 21 14, 24 14 C 27 14, 29 16, 29 19 C 29 22, 24 23, 24 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="32" r="1.5" fill="white" />
    </SvgIcon>
  );
}

// ── Logout ─────────────────────────────────────────────────────────────────
export function LogoutIcon({ size = 48, className }) {
  const gid = useGid("logout");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F97316" to="#EF4444" /></defs>
      <rect x="8" y="12" width="20" height="24" rx="4" fill={`url(#${gid})`} />
      <path d="M28 24 L 40 24 M 36 20 L 40 24 L 36 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </SvgIcon>
  );
}

// ── Beef / protein ─────────────────────────────────────────────────────────
export function ProteinIcon({ size = 48, className }) {
  const gid = useGid("protein");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#EC4899" to="#F97316" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M16 28 C 16 22, 20 18, 26 18 C 32 18, 34 22, 34 26 C 34 30, 30 32, 24 32 C 20 32, 16 32, 16 28Z" fill="white" fillOpacity="0.85" />
      <circle cx="22" cy="25" r="1.5" fill="#EC4899" fillOpacity="0.5" />
      <circle cx="28" cy="24" r="1.5" fill="#EC4899" fillOpacity="0.5" />
    </SvgIcon>
  );
}

// ── Carbs / cookie ─────────────────────────────────────────────────────────
export function CarbsIcon({ size = 48, className }) {
  const gid = useGid("carbs");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="24" cy="24" r="14" fill="#FDE68A" fillOpacity="0.9" />
      <circle cx="20" cy="20" r="1.5" fill="#7C4A03" fillOpacity="0.5" />
      <circle cx="28" cy="22" r="1.5" fill="#7C4A03" fillOpacity="0.5" />
      <circle cx="22" cy="28" r="1.5" fill="#7C4A03" fillOpacity="0.5" />
      <circle cx="29" cy="28" r="1.5" fill="#7C4A03" fillOpacity="0.5" />
    </SvgIcon>
  );
}

// ── Dumbbell (exercise) ─────────────────────────────────────────────────────
export function DumbbellIcon({ size = 48, className }) {
  const gid = useGid("dumb");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#8B5CF6" to="#6366F1" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <rect x="12" y="22" width="24" height="4" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="10" y="18" width="4" height="12" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="34" y="18" width="4" height="12" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="6" y="20" width="4" height="8" rx="2" fill="white" fillOpacity="0.7" />
      <rect x="38" y="20" width="4" height="8" rx="2" fill="white" fillOpacity="0.7" />
    </SvgIcon>
  );
}

// ── Fiber / wheat ──────────────────────────────────────────────────────────
export function FiberIcon({ size = 48, className }) {
  const gid = useGid("fiber");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#10B981" to="#14B8A6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M24 14 L 24 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 20 C 20 18, 16 18, 14 20 C 16 22, 20 22, 24 22" fill="white" fillOpacity="0.85" />
      <path d="M24 20 C 28 18, 32 18, 34 20 C 32 22, 28 22, 24 22" fill="white" fillOpacity="0.85" />
      <path d="M24 26 C 20 24, 16 24, 14 26 C 16 28, 20 28, 24 28" fill="white" fillOpacity="0.85" />
      <path d="M24 26 C 28 24, 32 24, 34 26 C 32 28, 28 28, 24 28" fill="white" fillOpacity="0.85" />
    </SvgIcon>
  );
}

// ── Calm mood (check-in) ──────────────────────────────────────────────────
export function CalmMoodIcon({ size = 48, className }) {
  const gid = useGid("calm");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M17 20 Q 18 18 20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 20 Q 29 18 31 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M16 28 Q 24 34 32 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Energized mood (check-in) ──────────────────────────────────────────────
export function EnergizedMoodIcon({ size = 48, className }) {
  const gid = useGid("energy");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="18" cy="20" r="2.5" fill="white" />
      <circle cx="30" cy="20" r="2.5" fill="white" />
      <path d="M15 27 Q 24 34 33 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M24 6 L 25 10 L 23 10 Z" fill="white" fillOpacity="0.7" />
    </SvgIcon>
  );
}

// ── Loving mood (check-in) ─────────────────────────────────────────────────
export function LovingMoodIcon({ size = 48, className }) {
  const gid = useGid("love");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F97316" to="#EC4899" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M18 19 C 16 17, 13 17, 13 20 C 13 23, 18 26, 18 26 C 18 26, 23 23, 23 20 C 23 17, 20 17, 18 19Z" fill="white" />
      <path d="M30 19 C 28 17, 25 17, 25 20 C 25 23, 30 26, 30 26 C 30 26, 35 23, 35 20 C 35 17, 32 17, 30 19Z" fill="white" />
      <path d="M17 30 Q 24 36 31 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Low mood (check-in) ────────────────────────────────────────────────────
export function LowMoodIcon({ size = 48, className }) {
  const gid = useGid("low");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#8B5CF6" to="#6366F1" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M17 20 Q 18 22 20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 20 Q 29 22 31 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M17 32 Q 24 26 31 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Growing mood (check-in) ────────────────────────────────────────────────
export function GrowingMoodIcon({ size = 48, className }) {
  const gid = useGid("grow");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#10B981" to="#14B8A6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M24 14 C 24 14, 20 18, 20 22 C 20 25, 22 28, 24 28 C 26 28, 28 25, 28 22 C 28 18, 24 14, 24 14Z" fill="white" fillOpacity="0.9" />
      <path d="M24 28 L 24 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 20 Q 14 18 13 16" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M32 20 Q 34 18 35 16" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// ── Gear (settings) ────────────────────────────────────────────────────────
export function GearIcon({ size = 48, className }) {
  const gid = useGid("gear");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6B7280" to="#9CA3AF" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="24" cy="24" r="8" fill="none" stroke="white" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="4" fill="white" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect key={deg} x="23" y="8" width="2" height="5" rx="1" fill="white" transform={`rotate(${deg} 24 24)`} />
      ))}
    </SvgIcon>
  );
}

// ── Activity (side effects) ────────────────────────────────────────────────
export function WaveIcon({ size = 48, className }) {
  const gid = useGid("wave");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M12 24 Q 16 18, 20 24 T 28 24 T 36 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M12 30 Q 16 26, 20 30 T 28 30 T 36 30" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
    </SvgIcon>
  );
}