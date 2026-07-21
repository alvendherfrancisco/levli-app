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
  return null;





















































}