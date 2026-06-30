import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Syringe, Info, HelpCircle, Wind, ArrowRight } from "lucide-react";
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{greeting}</h1>
        <Link to="/settings"><Settings size={24} className="text-gray-600 dark:text-gray-400" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <DateStrip />
        <NextShotCard />
        <MetricsGrid dayKey={dk} />

        {/* Side Effects card */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-3 mb-4 bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07] w-[calc(100%-1.5rem)] text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(20,184,166,0.13)"}}>
              <Wind size={16} className="text-teal-500" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Side effects</span>
          </div>
          {sideEffects ? (
            <p className="text-sm text-gray-700 dark:text-[#E8E9F0] bg-teal-50 dark:bg-teal-500/10 rounded-xl p-3 border border-transparent dark:border-teal-500/15">{sideEffects}</p>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 flex items-center gap-2 border border-transparent dark:border-blue-500/15">
              <Info size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">Tap to add side effects.</p>
            </div>
          )}
        </button>

        {/* Medication Levels card */}
        <div className="mx-3 mb-4 bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(59,130,246,0.13)"}}>
                <Syringe size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Medication Levels</h3>
                <p className="text-xs text-blue-500">Estimated medication levels in your system.</p>
              </div>
            </div>
            <HelpCircle size={18} className="text-blue-400" />
          </div>
          <div className="border-b-2 border-blue-500 w-12 mb-3" />
          <Link to="/insights" className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 flex items-center gap-2 block border border-transparent dark:border-blue-500/15">
            <Info size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">View full medication level chart in Insights <ArrowRight size={12} className="inline" /></p>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors text-sm px-5 py-3"
      style={{ boxShadow: "0 4px 24px 4px rgba(59,130,246,0.35)" }}
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
    </div>
  );
}