import React, { useState } from "react";
import { Scale, Flame, Beef, Leaf, Cookie, Droplets, Dumbbell, Camera } from "lucide-react";
import MetricCard from "@/components/home/MetricCard";
import { useAppState } from "@/lib/AppState";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { todayKey } from "@/lib/dateUtils";
import { useToast } from "@/hooks/useToast";
import { toast } from "sonner";

// Dark fill per metric — rotates deep indigo / teal / plum / charcoal-orange (Levli family).
const THEMES = {
  weight: { bg: "#0F766E", accent: "#5EEAD4", anim: "float" },            // deep teal
  calories: { bg: "#C2410C", accent: "#FED7AA", anim: "flicker" },        // charcoal-orange
  protein: { bg: "#6B21A8", accent: "#DDD6FE", anim: "pulse" },           // deep plum
  fiber: { bg: "#3730A3", accent: "#A5B4FC", anim: "sway", dots: [         // deep indigo
    { left: "22%", top: "28%", size: "5px", anim: "metricFall", dur: 4, delay: 0 },
    { left: "58%", top: "8%", size: "4px", anim: "metricFall", dur: 4, delay: 1.5 },
    { left: "78%", top: "42%", size: "5px", anim: "metricFall", dur: 4, delay: 2.6 },
  ] },
  carbs: { bg: "#9A3412", accent: "#FED7AA", anim: "flicker" },            // warm orange
  water: { bg: "#1E40AF", accent: "#93C5FD", anim: "float", dots: [        // deep blue
    { left: "25%", top: "18%", size: "5px", anim: "metricDrop", dur: 3.5, delay: 0 },
    { left: "62%", top: "4%", size: "4px", anim: "metricDrop", dur: 3.5, delay: 1.2 },
    { left: "82%", top: "34%", size: "5px", anim: "metricDrop", dur: 3.5, delay: 2.1 },
  ] },
  exercise: { bg: "#86198F", accent: "#F0ABFC", anim: "bounce" },           // deep fuchsia/plum
  progress: { bg: "#3730A3", accent: "#A5B4FC", anim: "pulse" },          // deep indigo
};

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

  const isZero = (v) => !v || parseFloat(v) === 0;

  const allMetrics = [
    {
      Icon: Scale, label: "Weight", theme: THEMES.weight,
      value: weight != null ? String(weight) : "—", unit: weightUnit, empty: weight == null,
      onAdd: () => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated successfully!") : toast.success("Weight added successfully!"); } }),
    },
    {
      Icon: Flame, label: "Calories", theme: THEMES.calories,
      value: nutrition.calories, unit: "kcal", empty: isZero(nutrition.calories),
      onAdd: () => setShowNutrition(true),
    },
    {
      Icon: Beef, label: "Protein", theme: THEMES.protein,
      value: nutrition.protein, unit: "g", empty: isZero(nutrition.protein),
      onAdd: () => setShowNutrition(true),
    },
    {
      Icon: Leaf, label: "Fiber", theme: THEMES.fiber,
      value: nutrition.fiber, unit: "g", empty: isZero(nutrition.fiber),
      onAdd: () => setShowNutrition(true),
    },
    {
      Icon: Cookie, label: "Carbs", theme: THEMES.carbs,
      value: nutrition.carbs, unit: "g", empty: isZero(nutrition.carbs),
      onAdd: () => setShowNutrition(true),
    },
    {
      Icon: Droplets, label: "Water", theme: THEMES.water,
      value: nutrition.water, unit: liquidUnit, empty: isZero(nutrition.water),
      onAdd: () => setShowNutrition(true),
    },
    {
      Icon: Dumbbell, label: "Exercise", theme: THEMES.exercise,
      value: exercise != null ? String(exercise) : "0", unit: "min", empty: exercise == null || exercise === 0,
      onAdd: () => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated successfully!") : toast.success("Exercise added successfully!"); } }),
    },
    {
      Icon: Camera, label: "Progress", theme: THEMES.progress,
      value: photo ? "1" : "—", unit: "pic", empty: !photo,
      onAdd: () => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", dayKey: dk, onSave: async (v, newDayKey) => { await addProgressPhotoRecord(newDayKey || dk, v); toast.success("Progress photo added successfully!"); }, onDelete: async () => { await deleteLatestProgressPhoto(dk); toast.success("Progress photo deleted successfully!"); } }),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 px-3 mb-4">
        {allMetrics.map((m) => (
          <MetricCard key={m.label} Icon={m.Icon} label={m.label} value={m.value} unit={m.unit} theme={m.theme} empty={m.empty} onAdd={m.onAdd} />
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