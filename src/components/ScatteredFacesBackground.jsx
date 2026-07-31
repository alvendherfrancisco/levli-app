import React from "react";

const FACES = [
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

// Pastel indigo, orange, teal
const PASTEL = [
  "rgba(99,102,241,0.10)",
  "rgba(249,115,22,0.10)",
  "rgba(20,184,166,0.10)",
];

const SCATTERS = {
  small: [
    { top: "6%", right: "6%", size: 26, rotate: -10, color: 0, face: 0 },
    { bottom: "8%", left: "6%", size: 22, rotate: 12, color: 1, face: 6 },
    { top: "40%", left: "78%", size: 18, rotate: 6, color: 2, face: 3 },
  ],
  medium: [
    { top: "6%", left: "6%", size: 34, rotate: -12, color: 0, face: 0 },
    { top: "8%", right: "8%", size: 28, rotate: 10, color: 1, face: 4 },
    { top: "48%", left: "4%", size: 24, rotate: 15, color: 2, face: 7 },
    { bottom: "10%", right: "6%", size: 30, rotate: -8, color: 0, face: 2 },
    { bottom: "12%", left: "30%", size: 22, rotate: 5, color: 1, face: 8 },
  ],
  large: [
    { top: "5%", left: "6%", size: 40, rotate: -12, color: 0, face: 0 },
    { top: "6%", right: "8%", size: 34, rotate: 10, color: 1, face: 4 },
    { top: "30%", left: "10%", size: 28, rotate: -5, color: 2, face: 7 },
    { top: "35%", right: "6%", size: 32, rotate: 15, color: 0, face: 2 },
    { bottom: "12%", left: "8%", size: 36, rotate: -8, color: 1, face: 8 },
    { bottom: "8%", right: "12%", size: 26, rotate: 5, color: 2, face: 5 },
    { top: "55%", left: "42%", size: 24, rotate: -15, color: 0, face: 1 },
  ],
};

export default function ScatteredFacesBackground({ variant = "medium", opacity = 0.55 }) {
  const scatter = SCATTERS[variant] || SCATTERS.medium;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {scatter.map((p, i) => {
        const posStyle = { position: "absolute", width: p.size, height: p.size, transform: `rotate(${p.rotate}deg)`, opacity };
        if (p.top != null) posStyle.top = p.top;
        if (p.bottom != null) posStyle.bottom = p.bottom;
        if (p.left != null) posStyle.left = p.left;
        if (p.right != null) posStyle.right = p.right;
        return (
          <div key={i} style={posStyle}>
            <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: PASTEL[p.color] }}>
              <img src={FACES[p.face % FACES.length]} alt="" className="w-[78%] h-[78%] object-contain" />
            </div>
          </div>
        );
      })}
    </div>
  );
}