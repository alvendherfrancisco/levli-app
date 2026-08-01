import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppState } from "@/lib/AppState";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import PaywallModal from "@/components/PaywallModal";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { profile, refreshProfile } = useAppState();
  const { user } = useAuth();
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
      params.delete("checkout");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? "?" + qs : ""));
      // Fallback: verify the payment directly with PayMongo in case the webhook
      // hasn't processed yet, then refresh the profile.
      (async () => {
        if (user?.id) {
          try { await base44.functions.invoke("verify-payment", { userId: user.id }); } catch (e) { /* non-fatal */ }
        }
        refreshProfile?.();
        setTimeout(() => refreshProfile?.(), 2000);
        setTimeout(() => refreshProfile?.(), 5000);
        setTimeout(() => refreshProfile?.(), 9000);
      })();
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