import React from "react";

/**
 * Levli brand logo — indigo droplet, no background.
 */
export default function LevliLogo({ className = "h-12 w-12" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 C12 2 5 10 5 15 a7 7 0 0 0 14 0 C19 10 12 2 12 2 Z" fill="#4F46E5" />
    </svg>
  );
}