import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pill, ChevronRight, Calendar, User, Activity } from "lucide-react";
import MedicationModal from "@/components/modals/MedicationModal";
import { useAppState } from "@/lib/AppState";
import { ROUTE_LABELS } from "@/lib/medicationCatalogue";
import { getMolecularClassLabel } from "@/lib/capabilityProfile";
import { toast } from "sonner";

export default function MyMedications() {
  const { medications, addMedication, updateMedication, deleteMedication } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setShowModal(true); };
  const openEdit = (med) => { setEditing(med); setShowModal(true); };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateMedication(editing.id, data);
        toast.success("Medication updated successfully!");
      } else {
        await addMedication(data);
        toast.success("Medication added successfully!");
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      toast.error("Failed to save medication");
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!confirm("Delete this medication record? Your logged shots will not be affected.")) return;
    await deleteMedication(editing.id);
    toast.success("Medication deleted successfully!");
    setShowModal(false);
    setEditing(null);
  };

  const activeMeds = medications.filter((m) => m.status === "active");
  const inactiveMeds = medications.filter((m) => m.status !== "active");

  const MedCard = ({ med }) => (
    <button key={med.id} onClick={() => openEdit(med)} className="w-full text-left">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/15 flex items-center justify-center flex-shrink-0">
            <Pill size={18} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-[#E8E9F0] truncate">{med.medication_name}</span>
              {med.status !== "active" && (
                <span className="text-xs px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/[0.08] text-gray-500 capitalize">{med.status}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{getMolecularClassLabel(med.medication_name)}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
              {med.prescribed_dose != null && <span>{med.prescribed_dose} {med.dose_unit || "mg"}</span>}
              {med.frequency && <span>{med.frequency}</span>}
              {med.route && <span>{ROUTE_LABELS[med.route] || med.route}</span>}
            </div>
            {med.titration_stage && (
              <div className="mt-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg px-2.5 py-1.5 border border-transparent dark:border-indigo-500/15">
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  <span className="font-semibold">Current stage:</span> {med.titration_stage}
                  <span className="block text-[11px] text-indigo-400 mt-0.5">As directed by your prescriber</span>
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
              {med.start_date && <span className="flex items-center gap-1"><Calendar size={10} /> {med.start_date}</span>}
              {med.prescriber_name && <span className="flex items-center gap-1"><User size={10} /> {med.prescriber_name}</span>}
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
        </div>
      </div>
    </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Medications</h1>
        <button onClick={openNew}><Plus size={24} className="text-gray-600 dark:text-gray-400" /></button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        {medications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800 mt-4">
            <Pill size={36} className="mx-auto mb-3 text-gray-300 dark:text-white/20" />
            <p className="text-sm text-gray-400 dark:text-[#9A9DAE]">No medications added yet. Add your prescribed medications to track your regimen, titration stage, and prescriber details.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMeds.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1">Active</p>
                {activeMeds.map((med) => <MedCard key={med.id} med={med} />)}
              </>
            )}
            {inactiveMeds.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1">Inactive</p>
                {inactiveMeds.map((med) => <MedCard key={med.id} med={med} />)}
              </>
            )}
          </div>
        )}

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-6 px-4">
          Levli tracks your regimen as entered by you or your prescriber. It does not generate titration schedules or recommend dose changes.
        </p>
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 right-5 lg:right-8 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-teal-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Medication
      </button>

      <MedicationModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        onSave={handleSave}
        onDelete={editing ? handleDelete : null}
        initialEntry={editing}
      />
    </div>
  );
}