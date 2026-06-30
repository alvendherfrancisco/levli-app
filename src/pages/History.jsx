import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, ChevronLeft, ChevronRight, Plus, Info, Wind } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, toDayKey, fromDayKey } from "@/lib/dateUtils";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function History() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [editingShot, setEditingShot] = useState(null);
  const { shots, getSideEffects } = useAppState();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  // Build map of days → shots for this month/year
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

  const selectedDayKey = selectedDay
    ? toDayKey(new Date(year, month, selectedDay))
    : null;
  const selectedShots = selectedDay ? (shotDayMap[selectedDay] || []) : [];
  const sideEffects = selectedDayKey ? getSideEffects(selectedDayKey) : "";

  const openEdit = (shot) => { setEditingShot(shot); setShowShot(true); };
  const openNew = () => { setEditingShot(null); setShowShot(true); };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Calendar */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth}><ChevronLeft size={22} className="text-blue-500" /></button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth}><ChevronRight size={22} className="text-blue-500" /></button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <span key={d} className="text-xs font-medium text-blue-500">{d}</span>
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
                className={`py-1.5 rounded-lg text-sm font-medium relative flex flex-col items-center ${
                  isSelected ? "border-2 border-blue-500 text-blue-600" : isToday ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                }`}>
                  {day}
                  {hasShot && <div className="w-2 h-2 bg-green-500 rounded-full mt-0.5" />}
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
              <button key={s.id} onClick={() => openEdit(s)} className="w-full text-left">
                <ShotCard {...s} drugClass={s.drug_class} />
              </button>
            ))}
          </div>
        )}
        {selectedDay && selectedShots.length === 0 && (
          <div className="px-4 mb-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-sm">
              No shots logged for {monthNames[month]} {selectedDay}
            </div>
          </div>
        )}

        {/* Side Effects for selected day */}
        {selectedDayKey && (
          <button onClick={() => setShowSideEffects(true)}
            className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 w-[calc(100%-2rem)] text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Wind size={16} className="text-teal-500" />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Side effects</span>
            </div>
            {sideEffects ? (
              <p className="text-sm text-gray-700 bg-teal-50 rounded-xl p-3">{sideEffects}</p>
            ) : (
              <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">Tap to add side effects for this day.</p>
              </div>
            )}
          </button>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
      {selectedDayKey && (
        <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} dayKey={selectedDayKey} />
      )}
    </div>
  );
}