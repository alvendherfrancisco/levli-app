import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import { Scale, Flame, Beef, Leaf, Cookie, Droplets, Dumbbell, Camera } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { todayKey } from "@/lib/dateUtils";

// Warm pastel tints per metric (bg, icon color)
const METRIC_STYLES = {
  Weight:   { bgColor: "#FBEFD8", iconColor: "#D9A23B" },
  Calories: { bgColor: "#FBE6DE", iconColor: "#E0795A" },
  Protein:  { bgColor: "#DEF0EC", iconColor: "#2FA690" },
  Fiber:    { bgColor: "#E7F2DD", iconColor: "#6FA84B" },
  Carbs:    { bgColor: "#FBEAD6", iconColor: "#E0944A" },
  Water:    { bgColor: "#DEEBF7", iconColor: "#4C8FD5" },
  Exercise: { bgColor: "#FBE2E2", iconColor: "#D9685C" },
  Progress: { bgColor: "#EFE2F7", iconColor: "#9266C2" },
};

const ICON_SIZE = 16;

export default function MetricsGrid({ dayKey }) {
  const dk = dayKey || todayKey();
  const {
    getNutrition, saveNutrition,
    getWeight, saveWeight,
    getExercise, saveExercise,
    getProgressPhoto, saveProgressPhoto,
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
      icon: <Scale size={ICON_SIZE} />, label: "Weight",
      value: weight != null ? String(weight) : "–", unit: weightUnit,
      ...METRIC_STYLES.Weight,
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: (v) => saveWeight(dk, v) }),
    },
    {
      icon: <Flame size={ICON_SIZE} />, label: "Calories",
      value: nutrition.calories, unit: "kcal",
      ...METRIC_STYLES.Calories,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Beef size={ICON_SIZE} />, label: "Protein",
      value: nutrition.protein, unit: "g",
      ...METRIC_STYLES.Protein,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Leaf size={ICON_SIZE} />, label: "Fiber",
      value: nutrition.fiber, unit: "g",
      ...METRIC_STYLES.Fiber,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Cookie size={ICON_SIZE} />, label: "Carbs",
      value: nutrition.carbs, unit: "g",
      ...METRIC_STYLES.Carbs,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Droplets size={ICON_SIZE} />, label: "Water",
      value: nutrition.water, unit: liquidUnit,
      ...METRIC_STYLES.Water,
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Dumbbell size={ICON_SIZE} />, label: "Exercise",
      value: exercise != null ? String(exercise) : "0", unit: "min",
      ...METRIC_STYLES.Exercise,
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: (v) => saveExercise(dk, v) }),
    },
    {
      icon: <Camera size={ICON_SIZE} />, label: "Progress",
      value: photo ? "✓" : "–", unit: "pic",
      ...METRIC_STYLES.Progress,
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", onSave: (v) => saveProgressPhoto(dk, v), onDelete: () => saveProgressPhoto(dk, null) }),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-4 mb-5">
        {allMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
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
          onSave={metricModal.onSave}
          onDelete={metricModal.onDelete}
        />
      )}
    </>
  );
}