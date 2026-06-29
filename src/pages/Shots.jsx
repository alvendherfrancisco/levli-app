import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, FileText, Plus, Syringe, Clock, CalendarCheck } from "lucide-react";
import ShotCard from "@/components/shots/ShotCard";
import AddShotModal from "@/components/modals/AddShotModal";

const sampleShots = [
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 30, 2025", time: "6:00 AM", site: "Stomach - Upper Right", pain: 0 },
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 22, 2025", time: "12:12 PM", site: "Stomach - Upper Right", pain: 2 },
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 15, 2025", time: "7:00 AM", site: "Stomach - Lower Left", pain: 5 },
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 08, 2025", time: "6:00 AM", site: "Stomach - Upper Right", pain: 1 },
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 01, 2025", time: "5:25 PM", site: "Stomach - Upper Right", pain: 1 },
  { medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "Apr 24, 2025", time: "8:00 AM", site: "Stomach - Upper Left", pain: 0 },
];

export default function Shots() {
  const [showShot, setShowShot] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Shots</h1>
        <div className="flex items-center gap-3">
          <FileText size={22} className="text-gray-500" />
          <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="flex gap-2 px-4 mb-5 overflow-x-auto">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Syringe size={12} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-400">Total Shots</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">6</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock size={12} className="text-yellow-600" />
            </div>
            <span className="text-xs text-gray-400">Last Dose</span>
          </div>
          <p className="text-xl font-bold text-gray-900">2.5 mg</p>
          <p className="text-xs text-gray-400">6 days ago</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
              <CalendarCheck size={12} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-400">Next Shot</span>
          </div>
          <p className="text-xl font-bold text-gray-900">Jun 6</p>
          <p className="text-xs text-gray-400">Today</p>
        </div>
      </div>

      {/* History */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">History</h2>
        <div className="space-y-2">
          {sampleShots.map((shot, i) => (
            <ShotCard key={i} {...shot} />
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40"
      >
        <Plus size={20} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
    </div>
  );
}