import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Info, ArrowRight } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import MedicationsCard from "@/components/home/MedicationsCard";
import StockCard from "@/components/home/StockCard";
import RecentHistoryCard from "@/components/home/RecentHistoryCard";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { toDayKey } from "@/lib/dateUtils";
import { AmbientHeaderBg } from "@/components/levli/LevliUI";
import { HeartIcon, ChartIcon } from "@/components/onboarding/LevliIcons";

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
      <div className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-sm w-full flex items-center justify-between px-5 pt-6 pb-2 relative">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">{greeting}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's your journey today.</p>
        </div>
        <Link to="/settings">
          <div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all">
            <Settings size={18} className="text-gray-500" />
          </div>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto pb-6 relative z-10">
        <div className="animate-section-in">
          <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <NextShotCard />
        </div>

        <div className="animate-section-in" style={{ animationDelay: "60ms" }}>
          <MetricsGrid dayKey={dk} />
        </div>

        <div className="animate-section-in" style={{ animationDelay: "120ms" }}>
          <MedicationsCard />
          <StockCard />
          <RecentHistoryCard />
        </div>

        {/* Side Effects card — illustrated, warm */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 w-[calc(100%-2rem)] text-left active:scale-[0.99] transition-transform animate-card-in relative overflow-hidden"
          style={{ animationDelay: "160ms" }}
        >
          <div className="absolute -right-3 -top-2 opacity-20 pointer-events-none">
            <HeartIcon size={72} />
          </div>
          <div className="relative flex items-center gap-2 mb-2">
            <HeartIcon size={32} />
            <span className="font-semibold text-gray-700 text-sm">Side effects</span>
          </div>
          {sideEffects || dayAdverseEvents.length > 0 ? (
            <div className="relative bg-teal-50 rounded-xl p-3 border border-teal-100/50">
              {dayAdverseEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {dayAdverseEvents.map((e) => (
                    <span key={e.id} className="text-xs bg-teal-500/10 text-teal-600 rounded-full px-2 py-0.5 border border-teal-500/20">
                      {e.symptom} <span className="opacity-60">({e.severity})</span>
                    </span>
                  ))}
                </div>
              )}
              {sideEffects && <p className="text-sm text-gray-600">{sideEffects}</p>}
            </div>
          ) : (
            <div className="relative bg-teal-50 rounded-xl p-3 flex items-center gap-2 border border-teal-100/50">
              <Info size={16} className="text-teal-500 flex-shrink-0" />
              <p className="text-sm text-teal-600">Tap to log how you're feeling today.</p>
            </div>
          )}
        </button>

        {/* Modelled Medication Exposure — illustrated */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 animate-card-in relative overflow-hidden" style={{ animationDelay: "200ms" }}>
          <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none">
            <ChartIcon size={84} />
          </div>
          <div className="relative flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <ChartIcon size={32} />
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Modelled Medication Exposure</h3>
                <p className="text-xs text-indigo-400">Illustrative estimate of relative medication exposure (not a blood-level measurement).</p>
              </div>
            </div>
          </div>
          <Link to="/insights" className="relative bg-indigo-50 rounded-xl p-3 flex items-center gap-2 block border border-indigo-100/50 active:scale-[0.99] transition-transform">
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