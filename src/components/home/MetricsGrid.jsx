import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import { Scale, Flame, Beef, Leaf, Cookie, Droplets, Dumbbell, Camera } from "lucide-react";
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
      icon: <Scale size={14} className="text-yellow-600" />, label: "Weight",
      value: weight != null ? String(weight) : "–", unit: weightUnit, color: "bg-yellow-100",
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      icon: <Flame size={14} className="text-orange-500" />, label: "Calories",
      value: nutrition.calories, unit: "kcal", color: "bg-orange-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Beef size={14} className="text-teal-500" />, label: "Protein",
      value: nutrition.protein, unit: "g", color: "bg-teal-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Leaf size={14} className="text-green-500" />, label: "Fiber",
      value: nutrition.fiber, unit: "g", color: "bg-green-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Cookie size={14} className="text-amber-500" />, label: "Carbs",
      value: nutrition.carbs, unit: "g", color: "bg-amber-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Droplets size={14} className="text-blue-500" />, label: "Water",
      value: nutrition.water, unit: liquidUnit, color: "bg-blue-100",
      onAdd: () => setShowNutrition(true),
    },
    {
      icon: <Dumbbell size={14} className="text-red-400" />, label: "Exercise",
      value: exercise != null ? String(exercise) : "0", unit: "min", color: "bg-red-100",
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      icon: <Camera size={14} className="text-purple-500" />, label: "Progress",
      value: photo ? "✓" : "–", unit: "pic", color: "bg-purple-100",
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", onSave: async (v) => { await saveProgressPhoto(dk, v); photo ? toast.success("Progress photo updated successfully!") : toast.success("Progress photo added successfully!"); }, onDelete: async () => { await saveProgressPhoto(dk, null); toast.success("Progress photo deleted successfully!"); } }),
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
          onSave={metricModal.onSave}
          onDelete={metricModal.onDelete}
        />
      )}
    </>
  );
}