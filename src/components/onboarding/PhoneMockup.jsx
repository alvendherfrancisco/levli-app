import React from "react";

export default function PhoneMockup({ children }) {
  return (
    <div className="mx-auto mt-2 mb-2 w-[210px] sm:w-[240px] relative select-none">
      {/* Outer shell */}
      <div className="rounded-[38px] border-[7px] border-gray-700 bg-gray-900 shadow-2xl shadow-black/60 overflow-hidden relative">
        {/* Side buttons */}
        <div className="absolute -left-[9px] top-14 w-[3px] h-7 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-[9px] top-24 w-[3px] h-10 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-[9px] top-38 w-[3px] h-10 bg-gray-600 rounded-l-full" />
        <div className="absolute -right-[9px] top-20 w-[3px] h-14 bg-gray-600 rounded-r-full" />
        {/* Screen */}
        <div className="bg-gray-950 rounded-[32px] overflow-hidden relative">
          {/* Status bar */}
          <div className="bg-gray-950 flex items-center justify-between px-4 pt-2 pb-1 relative">
            <span className="text-[8px] font-bold text-white">9:41</span>
            <div className="w-14 h-4 bg-gray-900 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="flex items-center gap-1">
              <div className="flex gap-[2px] items-end h-2.5">
                <div className="w-[2px] h-1 bg-gray-400 rounded-sm" />
                <div className="w-[2px] h-1.5 bg-gray-400 rounded-sm" />
                <div className="w-[2px] h-2 bg-gray-400 rounded-sm" />
                <div className="w-[2px] h-2.5 bg-white rounded-sm" />
              </div>
              <span className="text-[7px] text-gray-300">●●</span>
            </div>
          </div>
          {/* Content */}
          <div className="text-white text-[9px] leading-tight" style={{ minHeight: 300 }}>
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center py-1.5 bg-gray-950">
            <div className="w-10 h-[3px] bg-gray-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}