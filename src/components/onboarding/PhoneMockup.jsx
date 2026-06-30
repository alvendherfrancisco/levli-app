import React from "react";

export default function PhoneMockup({ children }) {
  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[300px] relative select-none">
      {/* Outer shell — iPhone X proportions ~19.5:9 */}
      <div className="rounded-[44px] border-[10px] border-gray-800 bg-gray-900 shadow-[0_32px_80px_rgba(0,0,0,0.7)] relative" style={{ aspectRatio: "9/19.5" }}>
        {/* Side buttons */}
        <div className="absolute -left-[12px] top-[18%] w-[4px] h-6 bg-gray-700 rounded-l-full" />
        <div className="absolute -left-[12px] top-[26%] w-[4px] h-10 bg-gray-700 rounded-l-full" />
        <div className="absolute -left-[12px] top-[37%] w-[4px] h-10 bg-gray-700 rounded-l-full" />
        <div className="absolute -right-[12px] top-[28%] w-[4px] h-14 bg-gray-700 rounded-r-full" />

        {/* Screen */}
        <div className="absolute inset-0 bg-gray-950 rounded-[34px] overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0 bg-gray-950">
            <span className="text-[9px] font-bold text-white">9:41</span>
            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[68px] h-[18px] bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <div className="text-[8px] text-white font-medium">●●●</div>
              <div className="w-[14px] h-[8px] border border-white/60 rounded-[2px] relative">
                <div className="absolute inset-[1.5px] bg-white/80 w-2/3 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-hidden text-white text-[9px] leading-tight">
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-1 pb-2 flex-shrink-0 bg-gray-950">
            <div className="w-20 h-[3px] bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}