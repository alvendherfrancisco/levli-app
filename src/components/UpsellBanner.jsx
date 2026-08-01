import React from "react";
import { Gem } from "lucide-react";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function UpsellBanner() {
  const { openPaywall, isPremium } = useSubscription();
  if (isPremium) return null;
  return (
    <div
      className="fixed left-0 right-0 z-40"
      style={{ bottom: "calc(52px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="bg-indigo-600 rounded-t-2xl px-5 py-4 flex flex-col items-center text-center shadow-lg shadow-indigo-600/30">
        <div className="flex items-center gap-2 mb-1">
          <Gem size={18} className="text-indigo-200" />
          <span className="font-bold text-white">Levli Premium</span>
        </div>
        <p className="text-xs text-indigo-100 mb-3 max-w-xs">
          Unlock comprehensive insights, export reports, and a whole lot more.
        </p>
        <button
          onClick={openPaywall}
          className="bg-white text-indigo-700 rounded-full px-6 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-50 transition-colors"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}