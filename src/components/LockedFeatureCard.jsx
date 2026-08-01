import React from "react";
import { Crown } from "lucide-react";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function LockedFeatureCard({
  title = "Unlock with Levli Premium",
  subtitle = "Upgrade to premium to view this feature.",
  children,
}) {
  const { openPaywall } = useSubscription();
  return (
    <div className="relative">
      {children && (
        <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      )}
      <button
        onClick={openPaywall}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
          <Crown size={26} className="text-indigo-600" />
        </div>
        <p className="font-bold text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{subtitle}</p>
      </button>
    </div>
  );
}