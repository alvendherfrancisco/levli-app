import React from "react";

export default function OnboardingScreen({ step, totalSteps, children, onContinue }) {
  const progress = ((step + 1) / totalSteps) * 100;
  const isLastStep = step === totalSteps - 1;
  return (
    <div className="min-h-screen bg-black text-white flex items-start sm:items-center justify-center">
      {/* Centered card */}
      <div className="w-full max-w-lg mx-auto flex flex-col min-h-screen sm:min-h-0 sm:rounded-3xl sm:shadow-2xl sm:my-8 bg-black overflow-hidden">
        {/* Progress bar */}
        <div className="px-6 pt-5">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-5 pt-4 overflow-y-auto">
          {children}
        </div>

        {/* Continue button */}
        <div className="px-6 pb-10 pt-4">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-2xl transition-colors"
          >
            {isLastStep ? "Go to Dashboard →" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}