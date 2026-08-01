import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import IonIcon from "@/components/IonIcon";
import { WeightFilledIcon } from "@/components/FilledIcons";
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
      icon: <WeightFilledIcon size={20} className="text-gray-900" />, label: "Weight",
      value: weight != null ? String(weight) : "–", unit: weightUnit, color: "#FFF3C1",
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      icon: <IonIcon name="flame" size={20} className="text-gray-900" />, label: "Calories",
      value: nutrition.calories, unit: "kcal", color: "#FFE5C1",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <IonIcon name="fish" size={20} className="text-gray-900" />, label: "Protein",
      value: nutrition.protein, unit: "g", color: "#C1F0E8",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <IonIcon name="leaf" size={20} className="text-gray-900" />, label: "Fiber",
      value: nutrition.fiber, unit: "g", color: "#E0F2C1",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <IonIcon name="fast-food" size={20} className="text-gray-900" />, label: "Carbs",
      value: nutrition.carbs, unit: "g", color: "#FFE8C1",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <IonIcon name="water" size={20} className="text-gray-900" />, label: "Water",
      value: nutrition.water, unit: liquidUnit, color: "#C1E3FF",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <IonIcon name="barbell" size={20} className="text-gray-900" />, label: "Exercise",
      value: exercise != null ? String(exercise) : "0", unit: "min", color: "#FFD6D6",
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      icon: <IonIcon name="camera" size={20} className="text-gray-900" />, label: "Progress",
      value: photo ? "✓" : "–", unit: "pic", color: "#F2D6FF",
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