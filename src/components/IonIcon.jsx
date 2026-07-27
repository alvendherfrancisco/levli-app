import React from "react";

/**
 * Wrapper for the ionicons web component (`<ion-icon>`).
 * ion-icon sizes via font-size; color via currentColor (inherits from span).
 * `style` is merged so callers (e.g. MetricCard dark-mode cloneElement) can
 * override color without losing the size.
 */
export default function IonIcon({ name, size = 20, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size, lineHeight: 0, ...style }}
    >
      <ion-icon name={name} style={{ display: "block", pointerEvents: "none" }} />
    </span>
  );
}