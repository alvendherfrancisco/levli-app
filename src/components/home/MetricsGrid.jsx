import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import { UtensilsCrossed, Leaf, Droplets, Dumbbell, Camera } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { todayKey } from "@/lib/dateUtils";
import { useToast } from "@/hooks/useToast";
import { toast } from "sonner";

export default function MetricsGrid({ dayKey }) {
  const dk = dayKey || todayKey();
  const {
    getNutrition, saveNutrition,
    getWeight, saveWeight,
    getExercise, saveExercise,
    getProgressPhoto, addProgressPhotoRecord, deleteLatestProgressPhoto,
    profile,
  } = useAppState();

  const [showNutrition, setShowNutrition] = useState(false);
  const [metricModal, setMetricModal] = useState(null);

  const nutrition = getNutrition(dk);
  const weight = getWeight(dk);
  const exercise = getExercise(dk);
  const photo = getProgressPhoto(dk);
  const weightUnit = profile?.weight_unit || "lb";
  const liquidUnit = profile?.liquid_unit || "oz";

  const allMetrics = [
    {
      icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-teal-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a4 4 0 0 1 4 4c0 .73-.19 1.41-.54 2H18c.95 0 1.75.67 1.95 1.56C21.96 18.57 22 18.78 22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2c0-.22.04-.43 2.05-8.44C4.25 9.67 5.05 9 6 9h2.54A3.9 3.9 0 0 1 8 7a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2" /></svg>), label: "Weight",
      value: weight != null ? String(weight) : "–", unit: weightUnit, color: "bg-teal-100",
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      icon: <UtensilsCrossed size={14} className="text-orange-500" />, label: "Calories",
      value: nutrition.calories, unit: "kcal", color: "bg-orange-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Dumbbell size={14} className="text-teal-500" />, label: "Protein",
      value: nutrition.protein, unit: "g", color: "bg-teal-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Leaf size={14} className="text-indigo-500" />, label: "Fiber",
      value: nutrition.fiber, unit: "g", color: "bg-indigo-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <UtensilsCrossed size={14} className="text-amber-500" />, label: "Carbs",
      value: nutrition.carbs, unit: "g", color: "bg-amber-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Droplets size={14} className="text-indigo-500" />, label: "Water",
      value: nutrition.water, unit: liquidUnit, color: "bg-indigo-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Dumbbell size={14} className="text-teal-600" />, label: "Exercise",
      value: exercise != null ? String(exercise) : "0", unit: "min", color: "bg-teal-100",
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      icon: <Camera size={14} className="text-amber-500" />, label: "Progress",
      value: photo ? "✓" : "–", unit: "pic", color: "bg-amber-100",
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", dayKey: dk, onSave: async (v, newDayKey) => { await addProgressPhotoRecord(newDayKey || dk, v); toast.success("Progress photo added successfully!"); }, onDelete: async () => { await deleteLatestProgressPhoto(dk); toast.success("Progress photo deleted successfully!"); } }),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 px-3 mb-4">
        {allMetrics.map((m) => (
          <MetricCard key={m.label} {...m} onAdd={m.onAdd} />
        ))}
      </div>
      <AddNutritionModal open={showNutrition} onClose={() => setShowNutrition(false)} dayKey={dk} />
      {metricModal && (
        <AddMetricModal
          open={!!metricModal}
          onClose={() => setMetricModal(null)}
          label={metricModal.label}
          unit={metricModal.unit}
          value={metricModal.current}
          dayKey={metricModal.dayKey}
          onSave={metricModal.onSave}
          onDelete={metricModal.onDelete}
        />
      )}
    </>
  );
}