import React from "react";

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

export const PASTEL_COLORS = {
  indigo: "#A5B4FC",
  orange: "#FDBA74",
  teal: "#5EEAD4",
};

// Right-biased scatter (for cards with left-aligned text)
const POSITIONS_RIGHT = [
  { top: "5%", left: "60%", size: 48, rot: -8 },
  { top: "8%", left: "85%", size: 40, rot: 12 },
  { top: "38%", left: "70%", size: 44, rot: -5 },
  { top: "58%", left: "88%", size: 36, rot: 8 },
  { top: "68%", left: "58%", size: 50, rot: -12 },
  { top: "35%", left: "92%", size: 34, rot: 6 },
];

// Full-edge scatter (for centered content)
const POSITIONS_FULL = [
  { top: "5%", left: "6%", size: 44, rot: -8 },
  { top: "8%", left: "85%", size: 40, rot: 12 },
  { top: "42%", left: "92%", size: 36, rot: -5 },
  { top: "78%", left: "75%", size: 48, rot: 8 },
  { top: "75%", left: "5%", size: 42, rot: -12 },
  { top: "50%", left: "45%", size: 32, rot: 6 },
];

export default function ScatteredFaces({ color = "indigo", count = 5, opacity = 0.4, spread = "right", seed = 0 }) {
  const bg = PASTEL_COLORS[color] || color;
  const positions = spread === "full" ? POSITIONS_FULL : POSITIONS_RIGHT;
  const faces = [];
  for (let i = 0; i < count; i++) {
    const svgIdx = (i + seed * 3) % FACE_SVGS.length;
    const posIdx = (i + seed * 2) % positions.length;
    const pos = positions[posIdx];
    faces.push(
      <img
        key={i}
        src={FACE_SVGS[svgIdx]}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          width: pos.size,
          height: pos.size,
          transform: `rotate(${pos.rot}deg)`,
          opacity,
          filter: "brightness(0) invert(1)",
        }}
      />
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: bg }}>
      {faces}
    </div>
  );
}