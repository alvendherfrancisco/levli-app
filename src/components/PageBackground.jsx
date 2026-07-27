import React from "react";

/**
 * Scattered gradient blobs in Levli brand colors (indigo, teal, orange).
 * Purely decorative — absolute, pointer-events-none, overflow-hidden.
 * The parent provides the base background color; this layer floats on top.
 */
export default function PageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full blur-3xl animate-ambient-1"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -left-24 w-80 h-80 rounded-full blur-3xl animate-ambient-2"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.16), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[26rem] h-[26rem] rounded-full blur-3xl animate-ambient-3"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.13), transparent 70%)" }}
      />
      <div
        className="absolute top-2/3 -right-10 w-72 h-72 rounded-full blur-3xl animate-ambient-1"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)", animationDelay: "3s" }}
      />
    </div>
  );
}