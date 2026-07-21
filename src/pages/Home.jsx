import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info, Syringe, Wind } from "lucide-react";
import { PillIcon, PackageIcon, CalendarIcon, DocumentIcon, SyringeIcon, WaveIcon, DropletIcon } from "@/components/onboarding/LevliIcons";
import TopBar from "@/components/TopBar";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import CheckInRow from "@/components/home/CheckInRow";
import QuickActions from "@/components/home/QuickActions";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import JournalEntryModal from "@/components/modals/JournalEntryModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { useAppState } from "@/lib/AppState";
import { toDayKey, todayKey } from "@/lib/dateUtils";
import { toast } from "sonner";

const MORE_CARDS = [
  { to: "/medications", label: "Medications", desc: "Track your regimens", Icon: PillIcon },
  { to: "/inventory", label: "Inventory", desc: "Stock & expiry", Icon: PackageIcon },
  { to: "/history", label: "History", desc: "Calendar view", Icon: CalendarIcon },
  { to: "/report", label: "Report", desc: "Export PDF", Icon: DocumentIcon },
];

export default function Home() {
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSideEffects, adverseEventsByDay, profile, saveWeight, addJournalEntry } = useAppState();
  const dk = toDayKey(selectedDate);
  const sideEffects = getSideEffects(dk);
  const dayAdverseEvents = adverseEventsByDay[dk] || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!";
  const userName = profile?.default_medication ? "" : "";

  const handleQuickAction = (key) => {
    if (key === "shot") setShowShot(true);
    else if (key === "symptom") setShowSideEffects(true);
    else if (key === "mood") setShowJournal(true);
    else if (key === "weight") setShowWeight(true);
    else if (key === "photo") setShowWeight(true);
  };

  return (
    <div className="min-h-screen w-full">
      <TopBar title={greeting} subtitle={userName || "How are you feeling today?"} />

      <div className="max-w-3xl mx-auto pb-8">
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <CheckInRow onLogMood={() => setShowJournal(true)} />
        <NextShotCard />
        <QuickActions onAction={handleQuickAction} />
        <MetricsGrid dayKey={dk} />

        {/* Side Effects card */}
        <button
          onClick={() => setShowSideEffects(true)}
          className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] w-[calc(100%-2rem)] text-left transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
              <WaveIcon size={36} />
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200 block">Side effects</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">Track how you're feeling</span>
            </div>
          </div>
          {sideEffects || dayAdverseEvents.length > 0 ? (
            <div className="bg-teal-50 dark:bg-teal-500/10 rounded-xl p-3 border border-transparent dark:border-teal-500/15">
              {dayAdverseEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {dayAdverseEvents.map((e) => (
                    <span key={e.id} className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full px-2 py-0.5 border border-teal-500/20">
                      {e.symptom} <span className="opacity-60">({e.severity})</span>
                    </span>
                  ))}
                </div>
              )}
              {sideEffects && <p className="text-sm text-gray-700 dark:text-gray-200">{sideEffects}</p>}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 flex items-center gap-2">
              <Info size={16} className="text-teal-500 dark:text-teal-400 flex-shrink-0" />
              <p className="text-sm text-teal-700 dark:text-teal-300">Tap to add side effects.</p>
            </div>
          )}
        </button>

        {/* Medication Exposure card */}
        <Link to="/insights" className="mx-4 mb-4 block">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-4 shadow-lg shadow-indigo-500/15 transition-all hover:shadow-xl">
            <div className="absolute -top-2 -right-2 animate-float-1 opacity-40"><DropletIcon size={56} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Syringe size={16} className="text-white" />
                <h3 className="font-bold text-white text-sm">Modelled Medication Exposure</h3>
              </div>
              <p className="text-white/80 text-xs mb-2">Illustrative estimate of relative medication exposure.</p>
              <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
                View full chart in Insights <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>

        {/* More for you section */}
        <div className="px-4 mb-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">More for you</p>
          <div className="grid grid-cols-2 gap-3">
            {MORE_CARDS.map(({ to, label, desc, Icon }) => (
              <Link key={to} to={to} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] transition-all hover:shadow-md active:scale-[0.98]">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={40} />
                </div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center px-4 mb-4">
          Levli is a personal logbook, not medical advice. Do not use it to adjust your dose — consult your prescriber.
        </p>
      </div>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={dk} />
      <JournalEntryModal open={showJournal} onClose={() => setShowJournal(false)} onSave={async (entry) => {
        await addJournalEntry(entry);
        toast.success("Mood logged!");
      }} />
      <AddMetricModal open={showWeight} onClose={() => setShowWeight(false)} label="Weight" unit={profile?.weight_unit || "lb"} value="" dayKey={dk}
        onSave={async (v) => { await saveWeight(dk, v); toast.success("Weight saved!"); }} />
    </div>
  );
}