import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, FileText, Plus, Syringe, Clock, CalendarCheck, Loader2 } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";
import { useAppState } from "@/lib/AppState";
import { addDaysToShotDate, daysAgoLabel } from "@/lib/dateUtils";

export default function Shots() {
  const [showShot, setShowShot] = useState(false);
  const [editingShot, setEditingShot] = useState(null);
  const { shots, shotsLoading, profile } = useAppState();
  const navigate = useNavigate();

  const daysBetween = parseInt(profile?.days_between || "7") || 7;
  const last = shots[0] || null;
  const nextDate = last ? addDaysToShotDate(last.date, daysBetween) : null;

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
        <div className="flex gap-2 px-4 mb-5 overflow-x-auto">
          <div className="bg-white dark:bg-card rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/[0.07] min-w-[120px]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Syringe size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Total Shots</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{shots.length}</p>
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/[0.07] min-w-[120px]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock size={12} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Last Dose</span>
            </div>
            {last ? (
              <>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{last.dose} mg</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{daysAgoLabel(last.date)}</p>
              </>
            ) : <p className="text-sm text-gray-400 dark:text-gray-500">No shots yet</p>}
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/[0.07] min-w-[120px]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CalendarCheck size={12} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Next Shot</span>
            </div>
            {nextDate ? <p className="text-lg font-bold text-gray-900 dark:text-white">{nextDate}</p> : <p className="text-sm text-gray-400 dark:text-gray-500">—</p>}
          </div>
        </div>

        <div className="px-4 pb-32">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">History</h2>
          {shotsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin text-blue-400" />
            </div>
          ) : shots.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-xl p-6 text-center text-gray-400 dark:text-[#9A9DAE] border border-gray-100 dark:border-white/[0.07]">
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

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
    </div>
  );
}