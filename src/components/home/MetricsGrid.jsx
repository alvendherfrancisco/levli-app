import React, { useState } from "react";
import MetricTile from "@/components/home/MetricTile";
import { ScaleIcon, NutritionIcon } from "@/components/onboarding/LevliIcons";
import { FlameIcon, WaterIcon, DumbbellIcon, CameraTileIcon, ProteinIcon, CarbsIcon } from "@/components/levli/MetricIcons";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { todayKey } from "@/lib/dateUtils";
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

  const isZero = (v) => v == null || v === "" || v === "0" || v === "0.0";

  const allMetrics = [
    {
      icon: <ScaleIcon size={32} />, label: "Weight", tint: "purple",
      value: weight != null ? String(weight) : "–", unit: weightUnit, empty: weight == null,
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      icon: <FlameIcon size={32} />, label: "Calories", tint: "pink",
      value: nutrition.calories, unit: "kcal", empty: isZero(nutrition.calories),
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <ProteinIcon size={32} />, label: "Protein", tint: "teal",
      value: nutrition.protein, unit: "g", empty: isZero(nutrition.protein),
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <NutritionIcon size={32} />, label: "Fiber", tint: "green",
      value: nutrition.fiber, unit: "g", empty: isZero(nutrition.fiber),
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <CarbsIcon size={32} />, label: "Carbs", tint: "amber",
      value: nutrition.carbs, unit: "g", empty: isZero(nutrition.carbs),
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <WaterIcon size={32} />, label: "Water", tint: "blue",
      value: nutrition.water, unit: liquidUnit, empty: isZero(nutrition.water),
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <DumbbellIcon size={32} />, label: "Exercise", tint: "teal",
      value: exercise != null ? String(exercise) : "0", unit: "min", empty: exercise == null,
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      icon: <CameraTileIcon size={32} />, label: "Progress", tint: "orange",
      value: photo ? "Saved" : "–", unit: "", empty: !photo,
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", dayKey: dk, onSave: async (v, newDayKey) => { await addProgressPhotoRecord(newDayKey || dk, v); toast.success("Progress photo added successfully!"); }, onDelete: async () => { await deleteLatestProgressPhoto(dk); toast.success("Progress photo deleted successfully!"); } }),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-4 mb-4">
        {allMetrics.map((m, i) => (
          <MetricTile key={m.label} {...m} index={i} />
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