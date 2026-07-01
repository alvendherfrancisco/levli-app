import React from "react";

// tag: "latest" | "same-day" | null
export default function ProgressPhotoCard({ photo, dateLabel, weightLabel, tag, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center flex-shrink-0 text-left w-24 sm:w-[140px]">
      {tag === "same-day" && (
        <p className="text-xs text-gray-400 dark:text-[#9A9DAE] mb-1">Same day</p>
      )}
      <div className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 ${
        tag === "latest" ? "border-green-500" : "border-gray-100 dark:border-white/[0.08]"
      }`}>
        <img src={photo.url} alt={`Progress ${photo.day_key}`} className="w-full h-full object-cover" />
        {tag === "latest" && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Latest</span>
        )}
        {weightLabel && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{weightLabel}</span>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-700 dark:text-[#E8E9F0] mt-1.5">{dateLabel.month}</p>
      <p className="text-[10px] text-gray-400 dark:text-[#9A9DAE]">{dateLabel.year}</p>
    </button>
  );
}