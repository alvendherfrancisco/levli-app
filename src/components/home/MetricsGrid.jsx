import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import { Scale, Flame, Beef, Leaf, Cookie, Droplets, Dumbbell, Camera } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";

export default function MetricsGrid() {
  const { nutrition, setNutrition } = useAppState();
  const [showNutrition, setShowNutrition] = useState(false);
  const [metricModal, setMetricModal] = useState(null);
  const [weight, setWeight] = useState("–");
  const [exercise, setExercise] = useState("0");
  const [progress, setProgress] = useState("–");

  const nutritionMetrics = [
    { key: "calories", icon: <Flame size={14} className="text-orange-500" />, label: "Calories", unit: "kcal", color: "bg-orange-100", value: nutrition.calories },
    { key: "protein", icon: <Beef size={14} className="text-teal-500" />, label: "Protein", unit: "g", color: "bg-teal-100", value: nutrition.protein },
    { key: "fiber", icon: <Leaf size={14} className="text-green-500" />, label: "Fiber", unit: "g", color: "bg-green-100", value: nutrition.fiber },
    { key: "carbs", icon: <Cookie size={14} className="text-amber-500" />, label: "Carbs", unit: "g", color: "bg-amber-100", value: nutrition.carbs },
    { key: "water", icon: <Droplets size={14} className="text-blue-500" />, label: "Water", unit: "oz", color: "bg-blue-100", value: nutrition.water },
  ];

  const allMetrics = [
    { icon: <Scale size={14} className="text-yellow-600" />, label: "Weight", value: weight, unit: "lb", color: "bg-yellow-100",
      onAdd: () => setMetricModal({ label: "Weight", unit: "lb", current: weight, onSave: (v) => setWeight(v) }) },
    ...nutritionMetrics.map((m) => ({ ...m, onAdd: () => setShowNutrition(true) })),
    { icon: <Dumbbell size={14} className="text-red-400" />, label: "Exercise", value: exercise, unit: "min", color: "bg-red-100",
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise, onSave: (v) => setExercise(v) }) },
    { icon: <Camera size={14} className="text-purple-500" />, label: "Progress", value: progress && progress !== "–" ? "✓" : "–", unit: "pic", color: "bg-purple-100",
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: progress, onSave: (v) => setProgress(v) }) },
  ];

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 px-3 mb-4">
        {allMetrics.map((m) => (
          <MetricCard key={m.label} {...m} onAdd={m.onAdd} />
        ))}
      </div>
      <AddNutritionModal open={showNutrition} onClose={() => setShowNutrition(false)} />
      {metricModal && (
        <AddMetricModal
          open={!!metricModal}
          onClose={() => setMetricModal(null)}
          label={metricModal.label}
          unit={metricModal.unit}
          value={metricModal.current}
          onSave={metricModal.onSave}
        />
      )}
    </>
  );
}