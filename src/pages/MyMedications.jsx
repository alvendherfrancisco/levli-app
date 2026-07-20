import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Pill, Calendar, User, Activity, Trash2, ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import MedicationModal from "@/components/modals/MedicationModal";

export default function MyMedications() {
  const { medications, deleteMedication, shots } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m) => { setEditing(m); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!confirm("Remove this medication from your regimen?")) return;
    await deleteMedication(id);
  };

  const statusColors = {
    active: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
    paused: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
    discontinued: "bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400",
    switched: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Medications</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><Plus size={24} className="text-teal-600" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Track your prescribed regimens. Titration stages show only what you or your prescriber entered — Levli never generates a schedule.
        </p>

        {medications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <Pill size={36} className="mx-auto mb-3 text-gray-300 dark:text-white/20" />
            <p className="text-sm text-gray-400 dark:text-[#9A9DAE] mb-4">No medications saved yet. Add your prescribed regimen to link your shot logs.</p>
            <button onClick={openNew} className="px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
              <Plus size={18} /> Add Medication
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((m) => (
              <div key={m.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <button onClick={() => openEdit(m)} className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{m.medication_name}</span>
                      {m.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[m.status] || statusColors.active}`}>{m.status}</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-[#9A9DAE]">
                      {m.prescribed_dose != null && (
                        <div className="flex items-center gap-2"><Activity size={14} className="text-teal-500" /> {m.prescribed_dose} {m.dose_unit || "mg"} · {m.frequency || "—"}</div>
                      )}
                      {m.indication && <div className="flex items-center gap-2"><Pill size={14} className="text-indigo-500" /> {m.indication}</div>}
                      {m.titration_stage && <div className="flex items-center gap-2"><Calendar size={14} className="text-amber-500" /> Stage: {m.titration_stage}</div>}
                      {m.prescriber_name && <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {m.prescriber_name}</div>}
                    </div>
                  </button>
                  <div className="flex flex-col gap-2 items-end">
                    <button onClick={() => openEdit(m)} className="text-gray-400 hover:text-teal-600"><ChevronRight size={20} /></button>
                    <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-teal-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Medication
      </button>

      <MedicationModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} editing={editing} />
    </div>
  );
}