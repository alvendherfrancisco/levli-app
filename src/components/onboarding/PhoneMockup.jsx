import React from "react";

export default function PhoneMockup({ children }) {
  return (
    <div className="mx-auto mt-4 mb-4 w-[260px] relative">
      {/* Phone frame */}
      <div className="rounded-[28px] border-[6px] border-gray-700 bg-white overflow-hidden shadow-2xl">
        {/* Notch */}
        <div className="bg-gray-700 h-6 flex items-center justify-center relative">
          <div className="w-20 h-4 bg-black rounded-b-xl" />
        </div>
        {/* Screen content */}
        <div className="text-black text-[9px] leading-tight">
          {children}
        </div>
      </div>
    </div>
  );
}