import React from "react";

/**
 * Scattered line-art face illustrations rendered as a decorative background.
 * Faces are tinted dark indigo via CSS mask (works on monochrome SVGs).
 * White card background is provided by the parent.
 */
const FACE_SVGS = [
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/e2bf546b2_00_happy.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/332940969_01_content.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/006983313_02_neutral.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/1a82041b9_03_smirk.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/c74dbeac7_04_shocked.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/5acb7ee35_05_yawn.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/9cbab8eb6_06_sad.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/336c84495_07_angry.svg",
  "https://media.base44.com/images/public/6a47a256ca9a7d18b85d511f/efd33af8f_08_wink.svg",
];

// Right-anchored scatter layout (percentages). Keeps the left side clear for text.
const LAYOUT = [
  { top: "8%", right: "5%", size: 46, rotate: -8 },
  { top: "6%", right: "30%", size: 38, rotate: 14 },
  { top: "36%", right: "14%", size: 52, rotate: -4 },
  { top: "40%", right: "40%", size: 34, rotate: 18 },
  { top: "70%", right: "8%", size: 42, rotate: 6 },
  { top: "74%", right: "34%", size: 38, rotate: -12 },
];

export default function ScatteredFaces({ color = "#312E81", opacity = 0.9, className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {LAYOUT.map((f, i) => {
        const url = FACE_SVGS[i % FACE_SVGS.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: f.top,
              right: f.right,
              width: f.size,
              height: f.size,
              transform: `rotate(${f.rotate}deg)`,
              opacity,
              backgroundColor: color,
              WebkitMaskImage: `url(${url})`,
              maskImage: `url(${url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        );
      })}
    </div>
  );
}