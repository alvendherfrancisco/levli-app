import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppState } from "@/lib/AppState";
import PaywallModal from "@/components/PaywallModal";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { profile, refreshProfile } = useAppState();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const isPremium = (() => {
    if (!profile) return false;
    if (profile.plan_type === "lifetime" && profile.subscription_status === "active") return true;
    if (profile.subscription_status === "active" || profile.subscription_status === "trialing") return true;
    return false;
  })();

  // After returning from a successful checkout, refresh the profile so the
  // synced subscription status (written by the webhook) is reflected.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      refreshProfile?.();
      params.delete("checkout");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? "?" + qs : ""));
    }
  }, []);

  const openPaywall = () => setPaywallOpen(true);
  const closePaywall = () => setPaywallOpen(false);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        openPaywall,
        closePaywall,
        planType: profile?.plan_type || "free",
        subscriptionStatus: profile?.subscription_status,
      }}
    >
      {children}
      <PaywallModal open={paywallOpen} onClose={closePaywall} />
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    return {
      isPremium: false,
      openPaywall: () => {},
      closePaywall: () => {},
      planType: "free",
      subscriptionStatus: null,
    };
  }
  return ctx;
}