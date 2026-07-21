import React, { useId } from "react";

/**
 * Illustrated metric icons — Levli "friendly rounded sticker" style.
 * Pastel-gradient blobs with simple white line-art symbols.
 * Used on Home quick-add tiles. Matches the onboarding icon language.
 */

function useGid(prefix) {
  const raw = useId();
  return `${prefix}${raw.replace(/[:]/g, "")}`;
}

function SvgIcon({ size = 32, className = "", children }) {
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

// Flame — Calories
export function FlameIcon({ size = 32, className }) {
  const gid = useGid("flame");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#FB923C" to="#EC4899" /></defs>
      <path d="M24 6 C 24 6, 30 14, 30 22 a6 6 0 0 1 -12 0 c0 -4 3 -6 3 -6 c0 4 2 5 3 5 c0 -6 0 -13 0 -13Z" fill={`url(#${gid})`} />
      <path d="M21 30 a3 3 0 0 0 6 0 c0 -2 -3 -3 -3 -6 c0 2 -3 3 -3 6Z" fill="white" fillOpacity="0.55" />
    </SvgIcon>
  );
}

// Water droplet — Water
export function WaterIcon({ size = 32, className }) {
  const gid = useGid("water");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#3B82F6" /></defs>
      <path d="M24 6 C 24 6, 12 20, 12 30 a12 12 0 0 0 24 0 C36 20, 24 6, 24 6Z" fill={`url(#${gid})`} />
      <path d="M24 16 C 24 16, 18 24, 18 30 a6 6 0 0 0 12 0" fill="white" fillOpacity="0.25" />
    </SvgIcon>
  );
}

// Dumbbell — Exercise
export function DumbbellIcon({ size = 32, className }) {
  const gid = useGid("dumb");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#0EA5E9" /></defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#${gid})`} />
      <rect x="10" y="20" width="6" height="8" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="32" y="20" width="6" height="8" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="14" y="22" width="20" height="4" rx="2" fill="white" fillOpacity="0.9" />
    </SvgIcon>
  );
}

// Camera — Progress photo
export function CameraTileIcon({ size = 32, className }) {
  const gid = useGid("cam");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#F97316" /></defs>
      <rect x="6" y="14" width="36" height="26" rx="7" fill={`url(#${gid})`} />
      <rect x="18" y="10" width="12" height="8" rx="3" fill={`url(#${gid})`} />
      <circle cx="24" cy="27" r="7" fill="white" fillOpacity="0.25" />
      <circle cx="24" cy="27" r="5" fill="none" stroke="white" strokeWidth="1.6" strokeOpacity="0.7" />
      <circle cx="24" cy="27" r="1.6" fill="white" />
    </SvgIcon>
  );
}

// Protein (steak/drumstick)
export function ProteinIcon({ size = 32, className }) {
  const gid = useGid("prot");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#10B981" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <path d="M16 30 C 16 22, 22 18, 30 18 C 30 26, 24 30, 16 30Z" fill="white" fillOpacity="0.85" />
      <path d="M20 26 c 3 -2 6 -3 8 -5" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

// Carbs (cookie)
export function CarbsIcon({ size = 32, className }) {
  const gid = useGid("carb");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#F59E0B" to="#D97706" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="18" cy="20" r="2.2" fill="white" fillOpacity="0.85" />
      <circle cx="28" cy="22" r="2" fill="white" fillOpacity="0.85" />
      <circle cx="22" cy="28" r="2" fill="white" fillOpacity="0.85" />
      <circle cx="30" cy="29" r="1.6" fill="white" fillOpacity="0.85" />
    </SvgIcon>
  );
}

// Pill / meds (for medications card)
export function MedsTileIcon({ size = 32, className }) {
  const gid = useGid("medst");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#8B5CF6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <g transform="rotate(-20 24 24)">
        <rect x="12" y="20" width="24" height="9" rx="4.5" fill="white" fillOpacity="0.9" />
        <line x1="21" y1="20" x2="21" y2="29" stroke="#6366F1" strokeWidth="1.4" />
      </g>
    </SvgIcon>
  );
}

// Package / stock (for inventory card)
export function StockTileIcon({ size = 32, className }) {
  const gid = useGid("stock");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#14B8A6" to="#3B82F6" /></defs>
      <rect x="10" y="16" width="28" height="22" rx="4" fill={`url(#${gid})`} />
      <path d="M10 22 H 38" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      <path d="M24 16 V 22" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      <rect x="20" y="10" width="8" height="6" rx="2" fill="white" fillOpacity="0.8" />
    </SvgIcon>
  );
}

// Clock / history (for recent history card)
export function HistoryTileIcon({ size = 32, className }) {
  const gid = useGid("hist");
  return (
    <SvgIcon size={size} className={className}>
      <defs><Grad id={gid} from="#6366F1" to="#3B82F6" /></defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${gid})`} />
      <circle cx="24" cy="24" r="11" fill="none" stroke="white" strokeWidth="2.2" strokeOpacity="0.6" />
      <path d="M24 17 V 24 L 29 27" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </SvgIcon>
  );
}