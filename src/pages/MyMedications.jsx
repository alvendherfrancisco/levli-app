import React, { useState } from "react";
import { Plus, Activity, Trash2, ChevronRight, Calendar, User } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/lib/AppState";
import MedicationModal from "@/components/modals/MedicationModal";
import { PillIcon, DropletIcon } from "@/components/onboarding/LevliIcons";

export default function MyMedications() {
  const { medications, deleteMedication, shots } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m) => { setEditing(m); setModalOpen(true); };
  const handleDelete = async (id) => { if (!confirm("Remove this medication from your regimen?")) return; await deleteMedication(id); };

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    discontinued: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
    switched: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  };

  return (
    <div className="min-h-screen w-full">
      <TopBar title="My Medications" subtitle="Track your prescribed regimens" />

      <div className="max-w-3xl mx-auto px-4 pb-32">
        {medications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100/80 dark:border-white/[0.04] text-center">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <PillIcon size={64} />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">No medications saved yet. Add your prescribed regimen to link your shot logs.</p>
            <button onClick={openNew} className="px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto text-sm">
              <Plus size={18} /> Add Medication
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((m) => (
              <div key={m.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-gray-800 dark:text-white text-base sm:text-lg break-words">{m.medication_name}</span>
                      {m.status && <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${statusColors[m.status] || statusColors.active}`}>{m.status}</span>}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      {m.prescribed_dose != null && <div className="flex items-center gap-2"><Activity size={14} className="text-teal-500" /> {m.prescribed_dose} {m.dose_unit || "mg"} · {m.frequency || "—"}</div>}
                      {m.indication && <div className="flex items-center gap-2"><PillIcon size={16} /> {m.indication}</div>}
                      {m.titration_stage && <div className="flex items-center gap-2"><Calendar size={14} className="text-amber-500" /> Stage: {m.titration_stage}</div>}
                      {m.prescriber_name && <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {m.prescriber_name}</div>}
                    </div>
                  </button>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button onClick={() => openEdit(m)} className="text-gray-400 hover:text-indigo-600"><ChevronRight size={20} /></button>
                    <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 transition-all active:scale-95 text-sm px-5 py-3.5">
        <Plus size={18} /> Add Medication
      </button>

      <MedicationModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} editing={editing} />
    </div>
  );
}