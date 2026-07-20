import React from "react";

/**
 * Shared Levli UI primitives — the single visual language for the in-app experience.
 * Matches the marketing site + onboarding: warm, calm, personal.
 * Light theme only. Indigo primary. Soft pastel icon tiles. Pill buttons.
 */

// ── Page shell ───────────────────────────────────────────────────────────────
export function PageShell({ children, className = "" }) {
  return <div className={`bg-[#FAFAFA] min-h-screen w-full ${className}`}>{children}</div>;
}

// ── Page header (sticky, with optional settings/back icon) ──────────────────
export function PageHeader({ title, subtitle, right, left }) {
  return (
    <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-3">
      {left}
      <div className="flex-1 min-w-0">
        {title && <h1 className="text-2xl font-bold text-gray-800 truncate">{title}</h1>}
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// ── Greeting header for Home ────────────────────────────────────────────────
export function GreetingHeader({ greeting, name, right }) {
  return (
    <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{greeting}{name ? `, ${name}` : ""} 👋</h1>
      </div>
      {right}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function LevliCard({ children, className = "", onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 ${className}`}
    >
      {children}
    </Comp>
  );
}

// ── Icon tile ────────────────────────────────────────────────────────────────
// Pastel-tinted rounded square holding an icon. Pass a Lucide icon element.
export function IconTile({ children, size = "md", tint = "indigo", className = "" }) {
  const sizes = { sm: "w-8 h-8 rounded-lg", md: "w-10 h-10 rounded-xl", lg: "w-12 h-12 rounded-xl" };
  const tints = {
    indigo: "bg-indigo-100",
    teal: "bg-teal-100",
    orange: "bg-orange-100",
    amber: "bg-amber-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    pink: "bg-pink-100",
    red: "bg-red-50",
  };
  return (
    <div className={`${sizes[size]} ${tints[tint]} flex items-center justify-center flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
}

// ── Pill button (primary) ──────────────────────────────────────────────────
export function PillButton({ children, onClick, disabled, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3.5 rounded-full font-semibold text-base bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

// ── Secondary text link ──────────────────────────────────────────────────────
export function TextLink({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

// ── Circular ghost icon button ──────────────────────────────────────────────
export function GhostIconButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );
}

// ── Status pill (soft colors, never alarming) ──────────────────────────────
export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-gray-100 text-gray-500",
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-500",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${tones[tone]}`}>
      {children}
    </span>
  );
}

// ── Ambient header background (soft blobs) ────────────────────────────────
export function AmbientHeaderBg() {
  return (
    <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none -z-0">
      <div
        className="absolute -top-10 -left-20 w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)" }}
      />
      <div
        className="absolute top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)" }}
      />
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────────────
export function SectionHeading({ children, className = "" }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="font-bold text-gray-800 text-lg">{children}</div>
    </div>
  );
}

// ── Staggered fade-in list ──────────────────────────────────────────────────
export function StaggerItem({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`animate-onb-scale ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {children}
    </div>
  );
}

// ── Mascot empty state ───────────────────────────────────────────────────────
import { DropletMascot } from "@/components/onboarding/LevliIcons";
export function MascotEmptyState({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)" }} />
      </div>
      <div className="relative z-10">
        <DropletMascot size={72} className="mx-auto mb-4 animate-onb-bounce" />
        {title && <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-400 mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// ── Warm callout banner (reassuring tone) ──────────────────────────────────
export function WarmCallout({ icon, title, children, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 border-indigo-100/50",
    teal: "bg-teal-50 border-teal-100/50",
    green: "bg-green-50 border-green-100/50",
    amber: "bg-amber-50 border-amber-100/50",
    orange: "bg-orange-50 border-orange-100/50",
  };
  const textTones = {
    indigo: "text-indigo-600",
    teal: "text-teal-600",
    green: "text-green-600",
    amber: "text-amber-600",
    orange: "text-orange-600",
  };
  return (
    <div className={`rounded-2xl p-3.5 border flex items-start gap-3 ${tones[tone]}`}>
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div>
        {title && <p className={`text-sm font-semibold ${textTones[tone]}`}>{title}</p>}
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

// ── Gradient chart tooltip (dark rounded pill) ───────────────────────────────
export function ChartTooltip({ active, payload, label, unit = "", valueLabels }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl px-3.5 py-2 shadow-xl border border-white/10">
      {label && <p className="text-white/60 text-[10px] font-medium mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-white text-xs font-semibold">
          {valueLabels?.[entry.name] || entry.name}: {entry.value}{unit}
        </p>
      ))}
    </div>
  );
}

// ── Gradient defs for recharts ───────────────────────────────────────────────
export function ChartGradients({ idPrefix = "levli" }) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-indigo`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-teal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.25} />
        <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-orange`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F97316" stopOpacity={0.25} />
        <stop offset="100%" stopColor="#F97316" stopOpacity={0.02} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-purple`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
      </linearGradient>
    </defs>
  );
}

// ── Floating Add Button ──────────────────────────────────────────────────────
export function FloatingAddButton({ onClick, label = "Add" }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3"
    >
      <Plus size={18} /> {label}
    </button>
  );
}

import { Plus } from "lucide-react";