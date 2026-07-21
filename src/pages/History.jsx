import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Info, Wind } from "lucide-react";
import TopBar from "@/components/TopBar";
import ShotCard from "@/components/shots/ShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { WaveIcon } from "@/components/onboarding/LevliIcons";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, toDayKey } from "@/lib/dateUtils";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function History() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [editingShot, setEditingShot] = useState(null);
  const { shots, getSideEffects, adverseEventsByDay } = useAppState();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };

  const shotDayMap = {};
  shots.forEach((s) => { const d = parseShotDate(s.date); if (!d) return; if (d.getMonth() === month && d.getFullYear() === year) { const day = d.getDate(); if (!shotDayMap[day]) shotDayMap[day] = []; shotDayMap[day].push(s); } });

  const selectedDayKey = selectedDay ? toDayKey(new Date(year, month, selectedDay)) : null;
  const selectedShots = selectedDay ? (shotDayMap[selectedDay] || []) : [];
  const sideEffects = selectedDayKey ? getSideEffects(selectedDayKey) : "";
  const dayAdverseEvents = selectedDayKey ? (adverseEventsByDay[selectedDayKey] || []) : [];

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  return (
    <div className="min-h-screen w-full">
      <TopBar title="History" subtitle="Calendar view" />

      <div className="max-w-3xl mx-auto pb-4">
        {/* Calendar */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth}><ChevronLeft size={22} className="text-indigo-500" /></button>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth}><ChevronRight size={22} className="text-indigo-500" /></button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {["S","M","T","W","T","F","S"].map((d, i) => <span key={i} className="text-xs font-medium text-indigo-500">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasShot = !!shotDayMap[day];
              const isSelected = day === selectedDay;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`py-2 rounded-xl text-sm font-medium relative flex flex-col items-center transition-all ${isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : isToday ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`}>
                  {day}
                  {hasShot && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-emerald-400"}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDayKey && <MetricsGrid dayKey={selectedDayKey} />}

        {selectedDay && selectedShots.length > 0 && (
          <div className="px-4 mb-4 space-y-2.5">
            {selectedShots.map((s) => (
              <button key={s.id} onClick={() => openEdit(s)} className="w-full text-left">
                <ShotCard {...s} drugClass={s.drug_class} />
              </button>
            ))}
          </div>
        )}
        {selectedDay && selectedShots.length === 0 && (
          <div className="px-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100/80 dark:border-white/[0.04] text-gray-400 dark:text-gray-500 text-sm">
              No shots logged for {monthNames[month]} {selectedDay}
            </div>
          </div>
        )}

        {selectedDayKey && (
          <button onClick={() => setShowSideEffects(true)}
            className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] w-[calc(100%-2rem)] text-left transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"><WaveIcon size={36} /></div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Side effects</span>
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
                <Info size={16} className="text-teal-500 flex-shrink-0" />
                <p className="text-sm text-teal-700 dark:text-teal-300">Tap to add side effects for this day.</p>
              </div>
            )}
          </button>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 transition-all active:scale-95 text-sm px-5 py-3.5">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
      {selectedDayKey && <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={selectedDayKey} />}
    </div>
  );
}