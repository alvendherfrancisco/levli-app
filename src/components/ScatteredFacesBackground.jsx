import React from "react";

// Face silhouette SVGs (white-filled potrace traces) hosted on the CDN.
// Used as CSS masks so the visible colour comes from the element background
// (indigo in light mode, lighter indigo in dark mode) — no CORS tainting.
const FACES = {
  happy:   "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/e2bf546b2_00_happy.svg",
  content: "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/332940969_01_content.svg",
  neutral: "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/006983313_02_neutral.svg",
  smirk:   "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/1a82041b9_03_smirk.svg",
  shocked: "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/c74dbeac7_04_shocked.svg",
  yawn:    "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/5acb7ee35_05_yawn.svg",
  sad:     "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/9cbab8eb6_06_sad.svg",
  angry:   "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/336c84495_07_angry.svg",
  wink:    "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/efd33af8f_08_wink.svg",
};

// Deterministic scatter layout — percentages keep it responsive (mobile-first)
// and faces spread across the ENTIRE card, not just one side.
const LAYOUT = [
  { url: FACES.happy,   top: "3%",  left: "2%",   size: 60, rot: -8,  op: 0.13 },
  { url: FACES.wink,    top: "1%",  left: "72%",  size: 56, rot: 10,  op: 0.11 },
  { url: FACES.neutral, top: "42%", left: "82%",  size: 72, rot: -6,  op: 0.10 },
  { url: FACES.shocked, top: "46%", left: "-3%",  size: 52, rot: 8,   op: 0.09 },
  { url: FACES.content, top: "74%", left: "5%",   size: 62, rot: 12,  op: 0.12 },
  { url: FACES.smirk,   top: "78%", left: "68%",  size: 66, rot: -10, op: 0.11 },
  { url: FACES.yawn,    top: "92%", left: "36%",  size: 54, rot: -4,  op: 0.09 },
];

export default function ScatteredFacesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Pastel accent blobs — indigo, orange, teal */}
      <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full blur-3xl opacity-40 dark:opacity-25"
        style={{ background: "radial-gradient(circle, #C7D2FE 0%, transparent 70%)" }} />
      <div className="absolute -bottom-14 -left-12 w-48 h-48 rounded-full blur-3xl opacity-40 dark:opacity-25"
        style={{ background: "radial-gradient(circle, #FED7AA 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 dark:opacity-20"
        style={{ background: "radial-gradient(circle, #99F6E4 0%, transparent 70%)" }} />

      {/* Scattered face silhouettes — dark indigo on white */}
      {LAYOUT.map((f, i) => (
        <div key={i} className="absolute bg-indigo-600 dark:bg-indigo-400"
          style={{
            top: f.top,
            left: f.left,
            width: `${f.size}px`,
            height: `${f.size}px`,
            transform: `rotate(${f.rot}deg)`,
            opacity: f.op,
            WebkitMaskImage: `url(${f.url})`,
            maskImage: `url(${f.url})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ))}
    </div>
  );
}