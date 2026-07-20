import React from "react";
import { AlertTriangle } from "lucide-react";
import { classifyRedFlag, RED_FLAG_WORDING, RED_FLAG_DISCLAIMER } from "@/lib/redFlags";

// Non-diagnostic escalation banner. Class-gated to approved GLP-1 medications.
// Only renders when a red-flag term is detected; never claims causality or diagnosis.
export default function RedFlagBanner({ text, medication }) {
  const { tier } = classifyRedFlag(text, medication);
  if (tier === "none" || !text) return null;

  const isEmergency = tier === "emergency";
  return (
    <div
      className={`rounded-xl p-3 border ${
        isEmergency
          ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
          : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          size={16}
          className={`flex-shrink-0 mt-0.5 ${
            isEmergency ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
          }`}
        />
        <div>
          <p
            className={`text-sm font-semibold ${
              isEmergency ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {isEmergency ? "This may need urgent attention" : "Consider contacting your clinician"}
          </p>
          <p className="text-xs mt-1 text-gray-700 dark:text-[#E8E9F0]">{RED_FLAG_WORDING[tier]}</p>
          <p className="text-[11px] mt-1 text-gray-500 dark:text-[#9A9DAE]">{RED_FLAG_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}