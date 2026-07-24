import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Info, HelpCircle, Wind, ArrowRight, Pill, Package, ClipboardList } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { toDayKey } from "@/lib/dateUtils";
import { AmbientHeaderBg } from "@/components/levli/LevliUI";

export default function Home() {
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSideEffects, adverseEventsByDay } = useAppState();
  const dk = toDayKey(selectedDate);
  const sideEffects = getSideEffects(dk);
  const dayAdverseEvents = adverseEventsByDay[dk] || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full relative">
      <AmbientHeaderBg />
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-2 relative">
        <h1 className="text-2xl font-bold text-gray-800">{greeting} 👋</h1>
        <Link to="/settings">
          <div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all">
            <Settings size={18} className="text-gray-500" />
          </div>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto pb-6 relative z-10">
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <NextShotCard />
        <MetricsGrid dayKey={dk} />

        {/* Quick access: Side effects + Journal | Medication + Stock */}
        <div className="mx-4 mb-4 grid grid-cols-2 gap-3 w-[calc(100%-2rem)]">
          {/* Side effects */}
          <button
            onClick={() => setShowSideEffects(true)}
            className="bg-white rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-left active:scale-[0.98] transition-transform flex flex-col"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mb-2">
              <Wind size={16} className="text-teal-500" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Side effects</span>
            {sideEffects || dayAdverseEvents.length > 0 ? (
              <span className="text-xs text-teal-600 mt-0.5">
                {dayAdverseEvents.length > 0 ? `${dayAdverseEvents.length} logged` : "Updated"}
              </span>
            ) : (
              <span className="text-xs text-gray-400 mt-0.5">Tap to add</span>
            )}
          </button>

          {/* Journal */}
          <Link
            to="/journal"
            className="bg-white rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-left active:scale-[0.98] transition-transform flex flex-col"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
              <ClipboardList size={16} className="text-amber-500" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Journal</span>
            <span className="text-xs text-gray-400 mt-0.5">Notes & mood</span>
          </Link>

          {/* Medication */}
          <Link
            to="/medications"
            className="bg-white rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-left active:scale-[0.98] transition-transform flex flex-col"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
              <Pill size={16} className="text-indigo-500" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Medication</span>
            <span className="text-xs text-gray-400 mt-0.5">Your regimens</span>
          </Link>

          {/* Stock */}
          <Link
            to="/inventory"
            className="bg-white rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-left active:scale-[0.98] transition-transform flex flex-col"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
              <Package size={16} className="text-blue-500" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Stock</span>
            <span className="text-xs text-gray-400 mt-0.5">Inventory</span>
          </Link>
        </div>

        {/* Medication Exposure card */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <HelpCircle size={16} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Modelled Medication Exposure</h3>
                <p className="text-xs text-indigo-400">Illustrative estimate of relative medication exposure (not a blood-level measurement).</p>
              </div>
            </div>
          </div>
          <Link to="/insights" className="bg-indigo-50 rounded-xl p-3 flex items-center gap-2 block border border-indigo-100/50 active:scale-[0.99] transition-transform">
            <Info size={16} className="text-indigo-500 flex-shrink-0" />
            <p className="text-sm text-indigo-600">View full exposure chart in Insights <ArrowRight size={12} className="inline" /></p>
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 text-center px-4 mb-4">
          Levli is a personal logbook, not medical advice. Do not use it to adjust your dose — consult your prescriber.
        </p>
      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3"
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
    </div>
  );
}