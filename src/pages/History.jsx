import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, ChevronLeft, ChevronRight, Plus, Info, Wind } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddShotModal from "@/components/modals/AddShotModal";
import SideEffectsModal from "@/components/modals/SideEffectsModal";
import { useAppState } from "@/lib/AppState";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const mShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseShotDate(dateStr) {
  // "May 30, 2025" or "Jun 29, 2026"
  const parts = dateStr.replace(",", "").split(" ");
  const m = mShort.indexOf(parts[0]);
  return { month: m, day: parseInt(parts[1]), year: parseInt(parts[2]) };
}

export default function History() {
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [year, setYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(29);
  const [showShot, setShowShot] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const { shots, sideEffects } = useAppState();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
    setSelectedDay(null);
  };

  // Build a set of days that have shots this month/year
  const shotDayMap = {};
  shots.forEach((s) => {
    const p = parseShotDate(s.date);
    if (p.month === month && p.year === year) {
      if (!shotDayMap[p.day]) shotDayMap[p.day] = [];
      shotDayMap[p.day].push(s);
    }
  });

  const selectedShots = selectedDay ? (shotDayMap[selectedDay] || []) : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-30 bg-gray-50 flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
      </div>

      {/* Calendar */}
      <div className="px-4 mb-4 bg-white rounded-2xl mx-4 p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth}><ChevronLeft size={22} className="text-blue-500" /></button>
          <h2 className="text-lg font-bold">{monthNames[month]} {year}</h2>
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
            const todayMatch = day === 29 && month === 5 && year === 2026;
            return (
              <button key={day} onClick={() => setSelectedDay(day)}
                className={`py-1.5 rounded-lg text-sm font-medium relative flex flex-col items-center ${
                  isSelected ? "border-2 border-blue-500 text-blue-600" : todayMatch ? "text-blue-600" : "text-gray-700"
                }`}>
                {day}
                {hasShot && <div className="w-2 h-2 bg-green-500 rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day shots */}
      {selectedDay && selectedShots.length > 0 && (
        <div className="px-4 mb-4 space-y-2">
          {selectedShots.map((s) => <ShotCard key={s.id} {...s} />)}
        </div>
      )}
      {selectedDay && selectedShots.length === 0 && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 text-gray-400 text-sm">
            No shots logged for {monthNames[month]} {selectedDay}
          </div>
        </div>
      )}

      <MetricsGrid />

      {/* Side Effects */}
      <button
        onClick={() => setShowSideEffects(true)}
        className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-[calc(100%-2rem)] text-left"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
            <Wind size={16} className="text-teal-500" />
          </div>
          <span className="font-semibold text-gray-700">Side effects</span>
        </div>
        {sideEffects ? (
          <p className="text-sm text-gray-700 bg-teal-50 rounded-xl p-3">{sideEffects}</p>
        ) : (
          <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">Tap to add side effects.</p>
          </div>
        )}
      </button>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
      <SideEffectsModal open={showSideEffects} onClose={() => setShowSideEffects(false)} />
    </div>
  );
}