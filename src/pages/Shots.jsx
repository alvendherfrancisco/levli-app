import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, FileText, Plus, Syringe, Clock, CalendarCheck, Loader2 } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";
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
  const daysBetween = (last && getDosingInterval(last.medication)) || parseInt(profile?.days_between || "7") || 7;
  const nextDate = last ? addDaysToShotDate(last.date, daysBetween) : null;

  // Adherence for the most recent medication over the last 90 days
  const lastMed = last?.medication;
  const adherence = lastMed ? calcAdherence(shots, lastMed, 90) : { logged: 0, scheduled: 0, adherencePct: null };

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shots</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/report")}><FileText size={22} className="text-gray-500" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 mb-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                <Syringe size={12} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Total Shots</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{shots.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                <Clock size={12} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Last Dose</span>
            </div>
            {last ? (
              <>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{last.dose} {last.dose_unit || "mg"}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{daysAgoLabel(last.date)}</p>
              </>
            ) : <p className="text-sm text-gray-400 dark:text-gray-500">No shots yet</p>}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <CalendarCheck size={12} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Next Shot</span>
            </div>
            {nextDate ? <p className="text-lg font-bold text-gray-900 dark:text-white">{nextDate}</p> : <p className="text-sm text-gray-400 dark:text-gray-500">—</p>}
          </div>
          {adherence.adherencePct != null && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck size={12} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">90d Adherence</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{adherence.adherencePct}%</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{adherence.logged}/{adherence.scheduled} doses</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-32">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">History</h2>
          {shotsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin text-teal-400" />
            </div>
          ) : shots.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center text-gray-400 dark:text-[#9A9DAE] border border-gray-100 dark:border-gray-800">
              <Syringe size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No shots logged yet. Tap Add Shot to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {shots.map((shot) => (
                <button key={shot.id} onClick={() => openEdit(shot)} className="w-full text-left">
                  <ShotCard {...shot} drugClass={shot.drug_class} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center px-4 pb-32">
        Levli is a personal logbook, not medical advice. Consult your prescriber for dosing decisions.
      </p>

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-teal-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
    </div>
  );
}