import React from "react";

// Face SVG URLs (white-filled potrace line art)
const FACE_URLS = [
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

// Predefined scatter positions: { top, right, size, rotate, faceIndex }
// Coordinates are percentages within the container. Faces cluster toward the right.
const SCATTER = [
  { top: "5%",  right: "1%",  size: 68, rotate: -12, face: 0 },
  { top: "0%",  right: "28%", size: 52, rotate: 8,   face: 4 },
  { top: "16%", right: "20%", size: 58, rotate: -5,  face: 8 },
  { top: "28%", right: "4%",  size: 62, rotate: 14,  face: 2 },
  { top: "44%", right: "26%", size: 50, rotate: -8,  face: 5 },
  { top: "52%", right: "2%",  size: 64, rotate: 6,   face: 1 },
  { top: "66%", right: "22%", size: 54, rotate: -10, face: 7 },
  { top: "76%", right: "6%",  size: 60, rotate: 4,   face: 3 },
  { top: "84%", right: "28%", size: 48, rotate: -3,  face: 6 },
];

/**
 * ScatteredFaces — renders face line-art SVGs scattered across the container.
 * Uses CSS masks so the white SVGs adopt the parent's text color.
 * Place inside a container with `relative overflow-hidden` and a text color.
 */
export default function ScatteredFaces({ color = "#312E81" }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {SCATTER.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            right: s.right,
            width: s.size,
            height: s.size,
            opacity: 0.3,
            transform: `rotate(${s.rotate}deg)`,
            backgroundColor: color,
            WebkitMask: `url(${FACE_URLS[s.face]}) center / contain no-repeat`,
            mask: `url(${FACE_URLS[s.face]}) center / contain no-repeat`,
          }}
        />
      ))}
    </div>
  );
}