import React from "react";
import { Syringe, Info } from "lucide-react";

export default function NextShotCard({ hasShots }) {
  if (!hasShots) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4 mb-4">
        <p className="text-sm text-gray-400 mb-2">Next Shot</p>
        <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
          <Syringe size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">No shots recorded yet. Add your first shot to start tracking your schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4 mb-4">
      <p className="text-sm text-gray-400 mb-1">Next Shot</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mon, Jul 6, 2026</h3>
          <div className="mt-2 border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400">Last Dose</p>
            <p className="text-sm font-semibold text-gray-700">Mon, Jun 29, 2026</p>
            <p className="text-sm text-gray-500">2.5 mg</p>
          </div>
        </div>
        {/* Progress ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="5" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#3B6FE0" strokeWidth="5" strokeDasharray="214" strokeDashoffset="160" strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-medium">7 days</span>
        </div>
      </div>
    </div>
  );
}