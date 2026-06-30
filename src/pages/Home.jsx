import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Syringe, Info, HelpCircle, Wind } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { todayKey } from "@/lib/dateUtils";

export default function Home() {
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const { getSideEffects } = useAppState();
  const dk = todayKey();
  const sideEffects = getSideEffects(dk);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning!" : hour < 18 ? "Good Afternoon!" : "Good Evening!";

  return (
    <div className="bg-canvas min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-canvas w-full flex items-center justify-between px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-ink">{greeting}</h1>
        <Link to="/settings"><Settings size={24} className="text-ink-secondary" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <DateStrip />
        <NextShotCard />
        <MetricsGrid dayKey={dk} />

        {/* Side Effects card */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-4 mb-5 bg-surface rounded-[20px] p-5 shadow-card border border-border-warm w-[calc(100%-2rem)] text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "#DEF0EC" }}>
              <Wind size={16} style={{ color: "#2FB8A6" }} />
            </div>
            <span className="font-semibold text-ink">Side effects</span>
          </div>
          {sideEffects ? (
            <p className="text-sm text-ink bg-surface-alt rounded-[14px] p-3">{sideEffects}</p>
          ) : (
            <div className="bg-accent-tint rounded-[14px] p-3 flex items-center gap-2">
              <Info size={16} className="text-accent flex-shrink-0" />
              <p className="text-sm text-accent">Tap to add side effects.</p>
            </div>
          )}
        </button>

        {/* Medication Levels card */}
        <div className="mx-4 mb-5 bg-surface rounded-[20px] p-5 shadow-card border border-border-warm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-accent-tint flex items-center justify-center">
                <Syringe size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-ink">Medication Levels</h3>
                <p className="text-xs text-ink-tertiary">Estimated medication levels in your system.</p>
              </div>
            </div>
            <HelpCircle size={18} className="text-ink-tertiary" />
          </div>
          <div className="border-b-2 border-accent w-12 mb-3" />
          <Link to="/insights" className="bg-accent-tint rounded-[14px] p-3 flex items-center gap-2 block">
            <Info size={16} className="text-accent flex-shrink-0" />
            <p className="text-sm text-accent">View full medication level chart in Insights →</p>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-accent text-white rounded-[20px] shadow-float flex items-center gap-2 font-semibold z-40 hover:bg-accent-hover transition-colors text-sm px-5 py-3 active:scale-[0.97]"
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
    </div>
  );
}