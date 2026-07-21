import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Pill, Calendar, User, Activity, Trash2, ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import MedicationModal from "@/components/modals/MedicationModal";
import { PillIcon } from "@/components/onboarding/LevliIcons";
import { MascotEmptyState } from "@/components/levli/LevliUI";
import { EmptyMedicationsIllustration } from "@/components/levli/LevliIllustrations";

export default function MyMedications() {
  const { medications, deleteMedication } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m) => { setEditing(m); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!confirm("Remove this medication from your regimen?")) return;
    await deleteMedication(id);
  };

  const statusTones = {
    active: "bg-green-50 text-green-600",
    paused: "bg-amber-50 text-amber-600",
    discontinued: "bg-gray-100 text-gray-500",
    switched: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Medications</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Plus size={18} className="text-indigo-500" /></div></button>
          <Link to="/settings"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Settings size={18} className="text-gray-500" /></div></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        <p className="text-xs text-gray-400 mb-4">
          Track your prescribed regimens. Titration stages show only what you or your prescriber entered — Levli never generates a schedule.
        </p>

        {medications.length === 0 ? (
          <MascotEmptyState title="No medications yet" subtitle="Add your prescribed regimen to link your shot logs." illustration={<EmptyMedicationsIllustration />}>
            <button onClick={openNew} className="px-6 py-3.5 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
              <Plus size={18} /> Add medication
            </button>
          </MascotEmptyState>
        ) : (
          <div className="space-y-3">
            {medications.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="flex-shrink-0">
                        <PillIcon size={40} />
                      </div>
                      <span className="font-bold text-gray-800 text-base break-words">{m.medication_name}</span>
                      {m.status && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${statusTones[m.status] || statusTones.active}`}>
                          {m.status}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 ml-11">
                      {m.prescribed_dose != null && (
                        <div className="flex items-center gap-2"><Activity size={14} className="text-teal-400" /> {m.prescribed_dose} {m.dose_unit || "mg"} · {m.frequency || "—"}</div>
                      )}
                      {m.indication && <div className="flex items-center gap-2"><Pill size={14} className="text-indigo-400" /> {m.indication}</div>}
                      {m.titration_stage && <div className="flex items-center gap-2"><Calendar size={14} className="text-amber-400" /> Stage: {m.titration_stage}</div>}
                      {m.prescriber_name && <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {m.prescriber_name}</div>}
                    </div>
                  </button>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button onClick={() => openEdit(m)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><ChevronRight size={18} className="text-gray-400" /></button>
                    <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><Trash2 size={14} className="text-gray-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3">
        <Plus size={18} /> Add Medication
      </button>

      <MedicationModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} editing={editing} />
    </div>
  );
}