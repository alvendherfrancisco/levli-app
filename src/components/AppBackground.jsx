import React from "react";

/**
 * Ambient gradient blob background for the app shell.
 * Subtle, low-opacity, slow-drifting decorative blobs — indigo/teal/orange.
 */
export default function AppBackground({ variant = "default" }) {
  const configs = {
    default: [
      { className: "animate-ambient-1", style: { background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", top: "-60px", left: "-40px", width: "320px", height: "320px" } },
      { className: "animate-ambient-2", style: { background: "radial-gradient(circle, rgba(20,184,166,0.10), transparent 70%)", top: "20%", right: "-80px", width: "280px", height: "280px" } },
      { className: "animate-ambient-3", style: { background: "radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)", bottom: "-40px", left: "10%", width: "260px", height: "260px" } },
    ],
    hero: [
      { className: "animate-ambient-1", style: { background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", top: "-40px", left: "20%", width: "280px", height: "280px" } },
      { className: "animate-ambient-2", style: { background: "radial-gradient(circle, rgba(249,115,22,0.12), transparent 70%)", top: "20%", right: "-20px", width: "240px", height: "240px" } },
    ],
  };
  const blobs = configs[variant] || configs.default;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
      {blobs.map((blob, i) => (
        <div key={i} className={`absolute rounded-full blur-3xl ${blob.className}`} style={blob.style} />
      ))}
    </div>
  );
}