import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { todayKey } from "@/lib/dateUtils";
import { toast } from "sonner";
import { ScaleIcon, NutritionIcon, DropletIcon as WaterIcon, HeartIcon as ExerciseIcon } from "@/components/onboarding/LevliIcons";
import { Flame, Beef, Cookie, Camera } from "lucide-react";

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
      icon: ScaleIcon, label: "Weight",
      value: weight != null ? String(weight) : "–", unit: weightUnit,
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      icon: <Flame size={28} className="text-orange-500" />, label: "Calories",
      value: nutrition.calories, unit: "kcal", color: "bg-orange-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Beef size={28} className="text-teal-500" />, label: "Protein",
      value: nutrition.protein, unit: "g", color: "bg-teal-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: NutritionIcon, label: "Fiber",
      value: nutrition.fiber, unit: "g",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Cookie size={28} className="text-amber-500" />, label: "Carbs",
      value: nutrition.carbs, unit: "g", color: "bg-amber-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: WaterIcon, label: "Water",
      value: nutrition.water, unit: liquidUnit,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: ExerciseIcon, label: "Exercise",
      value: exercise != null ? String(exercise) : "0", unit: "min",
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      icon: <Camera size={28} className="text-amber-500" />, label: "Progress",
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