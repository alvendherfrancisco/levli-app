import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, FileText, Plus, Syringe, Clock, CalendarCheck } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";
import { useAppState } from "@/lib/AppState";

function daysAgo(dateStr) {
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const parts = dateStr.replace(",", "").split(" ");
  const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((today - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

function addDays(dateStr, days) {
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const parts = dateStr.replace(",", "").split(" ");
  const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
  d.setDate(d.getDate() + days);
  return `${mNames[d.getMonth()]} ${d.getDate()}`;
}

export default function Shots() {
  const [showShot, setShowShot] = useState(false);
  const { shots } = useAppState();
  const navigate = useNavigate();

  const last = shots[0];
  const nextDate = last ? addDays(last.date, 7) : null;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Shots</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/report")}><FileText size={22} className="text-gray-500" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
      {/* Summary cards */}
      <div className="flex gap-2 px-4 mb-5 overflow-x-auto">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Syringe size={12} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-400">Total Shots</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{shots.length}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock size={12} className="text-yellow-600" />
            </div>
            <span className="text-xs text-gray-400">Last Dose</span>
          </div>
          {last ? (
            <>
              <p className="text-xl font-bold text-gray-900">{last.dose} mg</p>
              <p className="text-xs text-gray-400">{daysAgo(last.date)}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No shots yet</p>
          )}
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
              <CalendarCheck size={12} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-400">Next Shot</span>
          </div>
          {nextDate ? (
            <p className="text-xl font-bold text-gray-900">{nextDate}</p>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>
      </div>

      <div className="px-4 pb-32">
        <h2 className="text-lg font-bold text-gray-900 mb-3">History</h2>
        {shots.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 border border-gray-100">
            <Syringe size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No shots logged yet. Tap Add Shot to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shots.map((shot) => <ShotCard key={shot.id} {...shot} />)}
          </div>
        )}
      </div>

      </div>

      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 transition-colors text-sm px-5 py-3"
      >
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
    </div>
  );
}