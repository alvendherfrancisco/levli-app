import React, { useId } from "react";

export function SyringeIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7.707 3c.188 0 .367.074.5.207l4.586 4.586a.708.708 0 0 1-1 1L11 8l-5 5H4l-2 2H1v-1l2-2v-2l5-5l-.793-.793A.707.707 0 0 1 7.707 3m3-2c.188 0 .367.074.5.207l3.586 3.586a.708.708 0 0 1-1 1L13 5l-.797.796l-2-2L11 3l-.793-.793a.708.708 0 0 1 .5-1.207" />
    </svg>
  );
}

export function ClockIcon({ size = 24, className = "" }) {
  const rawId = useId();
  const maskId = "clock-mask-" + rawId.replace(/:/g, "");
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <g fill="none" strokeLinejoin="round" strokeWidth={4}>
            <path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
            <path stroke="#000" strokeLinecap="round" d="M24.008 12v12.01l8.479 8.48" />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask={`url(#${maskId})`} />
    </svg>
  );
}

export function CalendarCheckIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V3q0-.425.288-.712T7 2t.713.288T8 3v1h8V3q0-.425.288-.712T17 2t.713.288T18 3v1h1q.825 0 1.413.588T21 6v6.375q0 .425-.288.713t-.712.287t-.712-.288t-.288-.712V10H5v10h6.225q.425 0 .7.288T12.2 21t-.287.713T11.2 22zm11.525-2.325l3.55-3.55q.3-.3.7-.3t.7.3t.3.713t-.3.712L17.25 21.8q-.3.3-.712.3t-.713-.3L13.7 19.675q-.3-.3-.3-.712t.3-.713t.713-.3t.712.3z" />
    </svg>
  );
}

export function ScaleIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3a4 4 0 0 1 4 4c0 .73-.19 1.41-.54 2H18c.95 0 1.75.67 1.95 1.56C21.96 18.57 22 18.78 22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2c0-.22.04-.43 2.05-8.44C4.25 9.67 5.05 9 6 9h2.54A3.9 3.9 0 0 1 8 7a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2" />
    </svg>
  );
}