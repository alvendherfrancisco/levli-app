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

  const summaryCards = [
    {
      bg: "#DEEBF7", iconBg: "#4C8FD5", icon: <Syringe size={13} color="#fff" />,
      label: "Total Shots", value: shots.length, sub: null,
    },
    {
      bg: "#FBEFD8", iconBg: "#D9A23B", icon: <Clock size={13} color="#fff" />,
      label: "Last Dose", value: last ? `${last.dose} mg` : "—", sub: last ? daysAgoLabel(last.date) : null,
    },
    {
      bg: "#E7F2DD", iconBg: "#6FA84B", icon: <CalendarCheck size={13} color="#fff" />,
      label: "Next Shot", value: nextDate || "—", sub: null,
    },
  ];

  return (
    <div className="bg-canvas min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-canvas w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-ink">Shots</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/report")}><FileText size={22} className="text-ink-secondary" /></button>
          <Link to="/settings"><Settings size={22} className="text-ink-secondary" /></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Summary cards */}
        <div className="flex gap-3 px-4 mb-5 overflow-x-auto pb-1">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-surface rounded-[20px] p-4 shadow-card border border-border-warm min-w-[120px] flex-shrink-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: c.iconBg }}>
                  {c.icon}
                </div>
                <span className="text-xs text-ink-tertiary">{c.label}</span>
              </div>
              <p className="text-xl font-bold text-ink tabular-nums">{c.value}</p>
              {c.sub && <p className="text-xs text-ink-tertiary mt-0.5">{c.sub}</p>}
            </div>
          ))}
        </div>

        <div className="px-4 pb-32">
          <h2 className="text-lg font-bold text-ink mb-3">History</h2>
          {shotsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20 w-full" />
              ))}
            </div>
          ) : shots.length === 0 ? (
            <div className="bg-surface rounded-[20px] p-6 text-center border border-border-warm shadow-card">
              <div className="w-16 h-16 rounded-full bg-accent-tint flex items-center justify-center mx-auto mb-3">
                <Syringe size={28} className="text-accent opacity-60" />
              </div>
              <p className="text-sm text-ink-tertiary">No shots logged yet. Tap Add Shot to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
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
        className="fixed bottom-24 right-5 lg:right-8 bg-accent text-white rounded-[20px] shadow-float flex items-center gap-2 font-semibold z-40 hover:bg-accent-hover transition-colors text-sm px-5 py-3 active:scale-[0.97]">
        <Plus size={18} /> Add Shot
      </button>

      <AddShotModal open={showShot} onClose={() => { setShowShot(false); setEditingShot(null); }} editingShot={editingShot} />
    </div>
  );
}