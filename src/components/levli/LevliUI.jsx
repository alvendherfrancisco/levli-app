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