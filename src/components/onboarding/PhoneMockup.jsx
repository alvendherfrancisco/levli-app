import React from "react";

export default function PhoneMockup({ children }) {
  return (
    <div className="mx-auto mt-2 mb-2 w-[220px] sm:w-[260px] relative select-none">
      {/* Outer shell */}
      <div className="rounded-[36px] border-[8px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden relative">
        {/* Side buttons */}
        <div className="absolute -left-[10px] top-16 w-[4px] h-8 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-[10px] top-28 w-[4px] h-12 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-[10px] top-44 w-[4px] h-12 bg-gray-600 rounded-l-full" />
        <div className="absolute -right-[10px] top-24 w-[4px] h-16 bg-gray-600 rounded-r-full" />
        {/* Screen */}
        <div className="bg-white rounded-[28px] overflow-hidden relative">
          {/* Status bar */}
          <div className="bg-white flex items-center justify-between px-4 pt-2 pb-1">
            <span className="text-[8px] font-bold text-gray-900">9:41</span>
            <div className="w-16 h-4 bg-gray-900 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="flex items-center gap-0.5">
              <div className="w-3 h-2 border border-gray-700 rounded-sm relative"><div className="absolute inset-[1px] bg-gray-700 w-2/3" /></div>
              <div className="text-[7px] text-gray-700">●●●</div>
            </div>
          </div>
          {/* Content */}
          <div className="text-black text-[9px] leading-tight">
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center py-1 bg-white">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}