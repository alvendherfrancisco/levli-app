import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, ChevronLeft, ChevronRight, Plus, Info, Wind } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
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

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const shotDayMap = {};
  shots.forEach((s) => {
    const d = parseShotDate(s.date);
    if (!d) return;
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!shotDayMap[day]) shotDayMap[day] = [];
      shotDayMap[day].push(s);
    }
  });

  const selectedDayKey = selectedDay ? toDayKey(new Date(year, month, selectedDay)) : null;
  const selectedShots = selectedDay ? (shotDayMap[selectedDay] || []) : [];
  const sideEffects = selectedDayKey ? getSideEffects(selectedDayKey) : "";
  const dayAdverseEvents = selectedDayKey ? (adverseEventsByDay[selectedDayKey] || []) : [];

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">History</h1>
        <Link to="/settings"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Settings size={18} className="text-gray-500" /></div></Link>
      </div>

      <div className="max-w-3xl mx-auto pb-4">
        {/* Calendar */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><ChevronLeft size={18} className="text-gray-500" /></button>
            <h2 className="text-lg font-bold text-gray-800">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><ChevronRight size={18} className="text-gray-500" /></button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <span key={d} className="text-xs font-medium text-indigo-500">{d}</span>
            ))}
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
                  className={`py-1.5 rounded-xl text-sm font-medium relative flex flex-col items-center transition-all active:scale-90 ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : isToday
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {day}
                  {hasShot && <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day metrics */}
        {selectedDayKey && <MetricsGrid dayKey={selectedDayKey} />}

        {/* Selected day shots */}
        {selectedDay && selectedShots.length > 0 && (
          <div className="px-4 mb-4 space-y-2">
            {selectedShots.map((s) => (
              <button key={s.id} onClick={() => openEdit(s)} className="w-full text-left active:scale-[0.99] transition-transform">
                <ShotCard {...s} drugClass={s.drug_class} />
              </button>
            ))}
          </div>
        )}
        {selectedDay && selectedShots.length === 0 && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100/80 text-gray-400 text-sm">
              No shots logged for {monthNames[month]} {selectedDay}
            </div>
          </div>
        )}

        {/* Side Effects for selected day */}
        {selectedDayKey && (
          <button
            onClick={() => setShowSideEffects(true)}
            className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 w-[calc(100%-2rem)] text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Wind size={16} className="text-teal-500" />
              </div>
              <span className="font-semibold text-gray-700 text-sm">Side effects</span>
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
                <p className="text-sm text-teal-600">Tap to add side effects for this day.</p>
              </div>
            )}
          </button>
        )}
      </div>

      <button
        onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3"
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
      {selectedDayKey && (
        <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={selectedDayKey} />
      )}
    </div>
  );
}