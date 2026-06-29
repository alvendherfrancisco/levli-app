import React from "react";

export default function OnboardingScreen({ step, totalSteps, children, onContinue }) {
  const progress = ((step + 1) / totalSteps) * 100;
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto">
        {children}
      </div>

      {/* Continue button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={onContinue}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-2xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}