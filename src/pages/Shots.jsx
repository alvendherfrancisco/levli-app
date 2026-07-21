import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Syringe, Clock, CalendarCheck, Loader2 } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";
import TopIcons from "@/components/TopIcons";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysAgoLabel } from "@/lib/dateUtils";
import { getDosingInterval } from "@/lib/medicationData";
import { calcAdherence } from "@/lib/adherence";

export default function Shots() {
  const [showShot, setShowShot] = useState(false);
  const [editingShot, setEditingShot] = useState(null);
  const { shots, shotsLoading, profile } = useAppState();
  const navigate = useNavigate();

  const last = shots[0] || null;
  const daysBetween =
    (last && getDosingInterval(last.medication)) || parseInt(profile?.days_between || "7") || 7;
  const nextDate = last ? addDaysToShotDate(last.date, daysBetween) : null;

  const lastMed = last?.medication;
  const adherence = lastMed
    ? calcAdherence(shots, lastMed, 90)
    : { logged: 0, scheduled: 0, adherencePct: null };

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  const summaryCards = [
    { icon: <Syringe size={14} className="text-teal-500" />, label: "Total Shots", value: shots.length, tint: "bg-teal-100" },
    {
      icon: <Clock size={14} className="text-amber-500" />,
      label: "Last Dose",
      value: last ? `${last.dose} ${last.dose_unit || "mg"}` : "—",
      sub: last ? daysAgoLabel(last.date) : "",
      tint: "bg-amber-100",
    },
    {
      icon: <CalendarCheck size={14} className="text-green-500" />,
      label: "Next Shot",
      value: nextDate || "—",
      tint: "bg-green-100",
    },
    ...(adherence.adherencePct != null
      ? [{
          icon: <CalendarCheck size={14} className="text-indigo-500" />,
          label: "90d Consistency",
          value: `${adherence.adherencePct}%`,
          sub: `${adherence.logged}/${adherence.scheduled} doses`,
          tint: "bg-indigo-100",
        }]
      : []),
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Shots</h1>
        <div className="flex items-center gap-2">
          <Link to="/report"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><FileText size={18} className="text-gray-500" /></div></Link>
          <TopIcons />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 mb-5">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${card.tint}`}>
                  {card.icon}
                </div>
                <span className="text-xs text-gray-400">{card.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
              {card.sub && <p className="text-xs text-gray-400">{card.sub}</p>}
            </div>
          ))}
        </div>

        <div className="px-4 pb-32">
          <h2 className="text-lg font-bold text-gray-800 mb-3">History</h2>
          {shotsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin text-indigo-400" />
            </div>
          ) : shots.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-400 border border-gray-100/80">
              <Syringe size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No shots logged yet. Tap Add Shot to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {shots.map((shot) => (
                <button key={shot.id} onClick={() => openEdit(shot)} className="w-full text-left active:scale-[0.99] transition-transform">
                  <ShotCard {...shot} drugClass={shot.drug_class} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center px-4 pb-32">
        Levli is a personal logbook, not medical advice. Consult your prescriber for dosing decisions.
      </p>

      <button
        onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3"
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal
        open={showShot}
        onClose={() => { setShowShot(false); setEditingShot(null); }}
        editingShot={editingShot}
      />
    </div>
  );
}