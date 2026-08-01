import React from "react";
import { Gem } from "lucide-react";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function UpsellBanner() {
  const { openPaywall, isPremium } = useSubscription();
  if (isPremium) return null;
  return (
    <div className="mx-4 mb-4 bg-indigo-600 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <Gem size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm">Levli Premium</p>
        <p className="text-xs text-indigo-100 leading-tight">Unlock comprehensive insights, export reports, and a whole lot more.</p>
      </div>
      <button
        onClick={openPaywall}
        className="bg-white text-indigo-700 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap flex-shrink-0"
      >
        Learn more
      </button>
    </div>
  );
}