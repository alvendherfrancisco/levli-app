import React, { useState } from "react";
import { FileText, Plus, Syringe, Clock, CalendarCheck, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";
import { SyringeIcon } from "@/components/onboarding/LevliIcons";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysAgoLabel } from "@/lib/dateUtils";
import { getDosingInterval } from "@/lib/medicationData";
import { calcAdherence } from "@/lib/adherence";

export default function Shots() {
  const [showShot, setShowShot] = useState(false);
  const [editingShot, setEditingShot] = useState(null);
  const { shots, shotsLoading, profile } = useAppState();

  const last = shots[0] || null;
  const daysBetween = (last && getDosingInterval(last.medication)) || parseInt(profile?.days_between || "7") || 7;
  const nextDate = last ? addDaysToShotDate(last.date, daysBetween) : null;

  const lastMed = last?.medication;
  const adherence = lastMed ? calcAdherence(shots, lastMed, 90) : { logged: 0, scheduled: 0, adherencePct: null };

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  const summaryCards = [
    { label: "Total Shots", value: String(shots.length), grad: "from-indigo-400 to-blue-500", Icon: Syringe, iconColor: "text-white" },
    { label: "Last Dose", value: last ? `${last.dose} ${last.dose_unit || "mg"}` : "—", sub: last ? daysAgoLabel(last.date) : "", grad: "from-amber-400 to-orange-500", Icon: Clock, iconColor: "text-white" },
    { label: "Next Shot", value: nextDate || "—", grad: "from-emerald-400 to-teal-500", Icon: CalendarCheck, iconColor: "text-white" },
    { label: "90d Adherence", value: adherence.adherencePct != null ? `${adherence.adherencePct}%` : "—", sub: adherence.adherencePct != null ? `${adherence.logged}/${adherence.scheduled} doses` : "", grad: "from-violet-400 to-indigo-500", Icon: CalendarCheck, iconColor: "text-white" },
  ];

  return (
    <div className="min-h-screen w-full">
      <TopBar title="Shots" />

      <div className="max-w-3xl mx-auto">
        {/* Summary cards with gradient icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 mb-5">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl p-3.5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center mb-2`}>
                <c.Icon size={18} className={c.iconColor} strokeWidth={2.2} />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{c.label}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white leading-tight">{c.value}</p>
              {c.sub && <p className="text-[10px] text-gray-400 dark:text-gray-500">{c.sub}</p>}
            </div>
          ))}
        </div>

        {/* History */}
        <div className="px-4 pb-32">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">History</h2>
          {shotsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin text-indigo-400" />
            </div>
          ) : shots.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100/80 dark:border-white/[0.04]">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center opacity-50">
                <SyringeIcon size={64} />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">No shots logged yet. Tap Add Shot to get started.</p>
              <button onClick={openNew} className="px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto text-sm">
                <Plus size={18} /> Add Shot
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {shots.map((shot) => (
                <button key={shot.id} onClick={() => openEdit(shot)} className="w-full text-left">
                  <ShotCard {...shot} drugClass={shot.drug_class} />
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center px-4 pb-32">
          Levli is a personal logbook, not medical advice. Consult your prescriber for dosing decisions.
        </p>
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 transition-all active:scale-95 text-sm px-5 py-3.5">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
    </div>
  );
}