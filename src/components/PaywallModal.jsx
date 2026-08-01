import React, { useState } from "react";
import { X, Crown, Syringe, BarChart3, History, FileText, Droplet, Bell, Gem } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const PLANS = [
  { id: "monthly", name: "Monthly", desc: "Full access for just ₱125.00/month" },
  { id: "yearly", name: "Yearly", desc: "First 1 week free, then ₱509.00/year (₱42.41/month)", badge: "66% OFF" },
  { id: "lifetime", name: "Lifetime", desc: "Lifetime access for just ₱1,010.00", badge: "Popular" },
];

const FEATURES = [
  { icon: Syringe, label: "Track Unlimited Shots" },
  { icon: BarChart3, label: "Unlock Comprehensive Insights" },
  { icon: History, label: "Unlock Complete History" },
  { icon: FileText, label: "Generate & Share Reports" },
  { icon: Droplet, label: "Remove Ads and Watermarks" },
  { icon: Bell, label: "Notification Support" },
];

export default function PaywallModal({ open, onClose }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState("yearly");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout works only from a published app. Please open the app in a new tab to subscribe.");
      return;
    }
    setBusy(true);
    try {
      const res = await base44.functions.invoke("create-checkout-session", {
        plan: selected,
        userId: user?.id,
        email: user?.email,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    try {
      const res = await base44.functions.invoke("create-portal-session", { userId: user?.id });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("No active subscription found for your account.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Restore failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#1A1A1A] flex flex-col animate-in slide-in-from-bottom">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={handleRestore} className="text-sm text-gray-400 hover:text-white">Restore</button>
        <button onClick={onClose} aria-label="Close"><X size={22} className="text-white" /></button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Be Consistent. Be Healthier</h2>
          <p className="text-sm text-gray-400 mt-2">Your Health Deserves The Full Experience. – Go Premium!</p>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          {PLANS.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-colors ${
                selected === p.id ? "border-white bg-[#262626]" : "border-transparent bg-[#262626]"
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-lg">{p.name}</span>
                {p.badge && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.badge === "Popular" ? "bg-white text-black" : "bg-amber-200 text-amber-900"
                  }`}>{p.badge}</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
            </button>
          ))}
        </div>

        {/* Feature grid */}
        <div className="rounded-2xl border border-white/20 bg-[#262626] p-4">
          <div className="grid grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <f.icon size={20} className="text-white" />
                </div>
                <span className="text-[11px] text-gray-300 leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fine print */}
        <p className="text-[11px] text-gray-500 text-center mt-4 px-2">
          No commitment, cancel anytime from your account settings. Payment is charged to your account via Stripe.
        </p>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
          <a href="/terms" className="hover:text-white">Terms of Service</a>
          <span>·</span>
          <button onClick={handleRestore} className="hover:text-white">Restore Purchase</button>
          <span>·</span>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>

      {/* Continue button pinned bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#1A1A1A] to-transparent">
        <button onClick={handleCheckout} disabled={busy}
          className="w-full py-4 bg-[#2E68F5] text-white rounded-2xl font-bold text-lg disabled:opacity-60">
          {busy ? "Please wait…" : "Continue"}
        </button>
      </div>
    </div>
  );
}