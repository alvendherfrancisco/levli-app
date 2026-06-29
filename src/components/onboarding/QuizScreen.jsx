import React, { useState } from "react";

export default function QuizScreen({ question, subtitle, options, multiSelect, preSelected }) {
  const [selected, setSelected] = useState(preSelected || []);

  const toggle = (opt) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
    } else {
      setSelected([opt]);
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold leading-tight mb-2">{question}</h1>
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-gray-700 bg-gray-900 text-white"
              }`}
            >
              <span className="text-[15px] pr-3">{opt}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-600"
                }`}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}