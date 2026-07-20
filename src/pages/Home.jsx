import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Info, ArrowRight } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { toDayKey } from "@/lib/dateUtils";
import { AmbientHeaderBg, WarmCallout } from "@/components/levli/LevliUI";
import { PillIcon, PackageIcon, ReportIcon, MoodIcon, SyringeIcon } from "@/components/onboarding/LevliIcons";

export default function Home() {
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSideEffects, adverseEventsByDay, shots } = useAppState();
  const dk = toDayKey(selectedDate);
  const sideEffects = getSideEffects(dk);
  const dayAdverseEvents = adverseEventsByDay[dk] || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { to: "/medications", icon: <PillIcon size={40} />, label: "Medications" },
    { to: "/inventory", icon: <PackageIcon size={40} />, label: "Stock" },
    { to: "/report", icon: <ReportIcon size={40} />, label: "Report" },
  ];

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

        {/* Quick actions */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to}
                className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                {a.icon}
                <span className="text-xs font-medium text-gray-500">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <NextShotCard />
        <MetricsGrid dayKey={dk} />

        {/* Side effects card */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 w-[calc(100%-2rem)] text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2 mb-2">
            <MoodIcon size={32} />
            <span className="font-semibold text-gray-700 text-sm">How are you feeling?</span>
          </div>
          {sideEffects || dayAdverseEvents.length > 0 ? (
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-100/50">
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
            <div className="bg-teal-50 rounded-xl p-3 flex items-center gap-2 border border-teal-100/50">
              <Info size={16} className="text-teal-500 flex-shrink-0" />
              <p className="text-sm text-teal-600">Tap to log how you're feeling today.</p>
            </div>
          )}
        </button>

        {/* Medication levels card */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <SyringeIcon size={32} />
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Medication levels</h3>
                <p className="text-xs text-gray-400">Estimated levels in your system.</p>
              </div>
            </div>
          </div>
          <Link to="/insights" className="bg-indigo-50 rounded-xl p-3 flex items-center gap-2 block border border-indigo-100/50 active:scale-[0.99] transition-transform">
            <Info size={16} className="text-indigo-500 flex-shrink-0" />
            <p className="text-sm text-indigo-600">See full chart in Insights <ArrowRight size={12} className="inline" /></p>
          </Link>
        </div>

        <WarmCallout tone="indigo">
          Levli is your personal logbook, not medical advice. Do not use it to adjust your dose — talk to your prescriber for decisions about your treatment.
        </WarmCallout>
      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3"
      >
        <Plus size={18} /> Log shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
    </div>
  );
}