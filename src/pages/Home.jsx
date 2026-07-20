import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Syringe, Info, HelpCircle, Wind, ArrowRight } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { toDayKey } from "@/lib/dateUtils";

export default function Home() {
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSideEffects } = useAppState();
  const dk = toDayKey(selectedDate);
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
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <NextShotCard />
        <MetricsGrid dayKey={dk} />

        {/* Side Effects card */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-3 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 w-[calc(100%-1.5rem)] text-left"
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
            <div className="bg-teal-50 dark:bg-teal-500/10 rounded-xl p-3 flex items-center gap-2 border border-transparent dark:border-teal-500/15">
              <Info size={16} className="text-teal-500 dark:text-teal-400 flex-shrink-0" />
              <p className="text-sm text-teal-700 dark:text-teal-300">Tap to add side effects.</p>
            </div>
          )}
        </button>

        {/* Medication Levels card */}
        <div className="mx-3 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(99,102,241,0.13)"}}>
                <Syringe size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Medication Levels</h3>
                <p className="text-xs text-indigo-500">Illustrative estimate of relative medication exposure (not a blood-level measurement).</p>
              </div>
            </div>
            <HelpCircle size={18} className="text-indigo-400" />
          </div>
          <div className="border-b-2 border-indigo-500 w-12 mb-3" />
          <Link to="/insights" className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-3 flex items-center gap-2 block border border-transparent dark:border-indigo-500/15">
            <Info size={16} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300">View full medication level chart in Insights <ArrowRight size={12} className="inline" /></p>
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center px-4 mb-4">
          Levli is a personal logbook, not medical advice. Do not use it to adjust your dose — consult your prescriber.
        </p>
      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-teal-600 dark:bg-teal-500 text-white rounded-2xl shadow-lg shadow-teal-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors text-sm px-5 py-3"
      style={{ boxShadow: "0 4px 24px 4px rgba(20,184,166,0.35)" }}
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
    </div>
  );
}