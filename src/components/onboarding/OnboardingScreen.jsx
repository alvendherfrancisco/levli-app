import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import AmbientBackground from "./AmbientBackground";

/**
 * Onboarding shell — warm, light-themed layout matching the Levli marketing site.
 * Segmented progress bar, ghost back button, pill CTA, slide+fade step transitions.
 */
export default function OnboardingScreen({
  step,
  totalSteps,
  children,
  onContinue,
  onBack,
  ctaLabel,
  canContinue = true,
  secondaryAction,
}) {
  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;
  const ctaText = ctaLabel || (isLastStep ? "Go to Home" : "Next");
  const [animClass, setAnimClass] = useState("animate-onb-right");
  const prevStepRef = useRef(step);

  useEffect(() => {
    setAnimClass(step >= prevStepRef.current ? "animate-onb-right" : "animate-onb-left");
    prevStepRef.current = step;
  }, [step]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex items-start sm:items-center justify-center">
      <AmbientBackground />
      <div className="w-full max-w-lg mx-auto flex flex-col h-screen sm:h-[88vh] sm:rounded-3xl sm:shadow-xl sm:my-6 bg-white/70 backdrop-blur-md overflow-hidden relative z-10 border border-gray-100/80">
        {/* Header — back + segmented progress */}
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-6 pb-2 flex-shrink-0">
          <div className="w-9 h-9 flex-shrink-0">
            {!isFirstStep && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                aria-label="Back"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex-1 flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i <= step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-5 sm:px-6 pt-3 overflow-y-auto">
          <div key={step} className={`flex-1 flex flex-col ${animClass}`}>
            {children}
          </div>
        </div>

        {/* Footer — pill CTA + optional secondary */}
        <div className="px-5 sm:px-6 pb-9 pt-4 flex-shrink-0">
          <button
            onClick={canContinue ? onContinue : undefined}
            disabled={!canContinue}
            className={`w-full py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 active:scale-95 ${
              canContinue
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {ctaText}
          </button>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full text-center text-gray-500 text-sm font-medium mt-3 hover:text-gray-700 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}