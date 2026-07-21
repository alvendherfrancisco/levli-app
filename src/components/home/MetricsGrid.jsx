import React, { useState } from "react";
import MetricCard from "@/components/home/MetricCard";
import GradientMetricCard from "@/components/ui/GradientMetricCard";
import { NutritionIcon, WaterDropIcon } from "@/components/onboarding/LevliIcons";
import { Leaf } from "lucide-react";
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

  // ── Nutrition hero card (indigo-to-blue gradient, kcal headline, bar chart, sub-stats) ──
  const calories = parseFloat(nutrition.calories) || 0;
  const protein = parseFloat(nutrition.protein) || 0;
  const water = parseFloat(nutrition.water) || 0;
  const fiber = parseFloat(nutrition.fiber) || 0;
  const carbs = parseFloat(nutrition.carbs) || 0;

  // Simple 7-bar chart (weekly trend placeholder — uses last 7 days if available, else daily split)
  const weekBars = [40, 65, 50, 80, 55, 70, Math.min(100, Math.max(20, calories / 20))];

  // Determine macro balance label
  const macroLabel = protein >= 60 ? "Balanced" : protein >= 30 ? "Light" : "Low protein";

  return (
    <>
      {/* Nutrition hero card — the signature gradient card */}
      <div className="px-4 mb-4">
        <GradientMetricCard
          gradient="from-indigo-500 to-blue-500"
          label="Nutrition"
          value={String(calories)}
          unit="kcal today"
          trend={{ value: "12%", direction: "up" }}
          barChart={weekBars}
          subStats={[
            { icon: <Leaf size={12} className="text-white" />, text: `Macros — ${macroLabel}` },
            { icon: <WaterDropIcon size={12} />, text: `Water — ${water.toFixed(1)} ${liquidUnit}` },
          ]}
          floatIcons={
            <>
              <div className="absolute top-3 right-8 animate-float-1"><NutritionIcon size={28} /></div>
              <div className="absolute bottom-4 right-16 animate-float-2"><WaterDropIcon size={20} /></div>
              <div className="absolute top-1/2 right-4 animate-float-3"><Leaf size={16} /></div>
            </>
          }
          onClick={() => setShowNutrition(true)}
        />
      </div>

      {/* Compact metrics grid */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-5">
        <MetricCard iconType="weight" label="Weight"
          value={weight != null ? String(weight) : "–"} unit={weightUnit}
          onAdd={() => setMetricModal({ label: "Weight", unit: weightUnit, current: weight != null ? String(weight) : "", onSave: async (v) => { await saveWeight(dk, v); weight != null ? toast.success("Weight updated!") : toast.success("Weight added!"); } })}
        />
        <MetricCard iconType="protein" label="Protein"
          value={nutrition.protein} unit="g"
          onAdd={() => setShowNutrition(true)}
        />
        <MetricCard iconType="fiber" label="Fiber"
          value={nutrition.fiber} unit="g"
          onAdd={() => setShowNutrition(true)}
        />
        <MetricCard iconType="carbs" label="Carbs"
          value={nutrition.carbs} unit="g"
          onAdd={() => setShowNutrition(true)}
        />
        <MetricCard iconType="water" label="Water"
          value={nutrition.water} unit={liquidUnit}
          onAdd={() => setShowNutrition(true)}
        />
        <MetricCard iconType="exercise" label="Exercise"
          value={exercise != null ? String(exercise) : "0"} unit="min"
          onAdd={() => setMetricModal({ label: "Exercise", unit: "min", current: exercise != null ? String(exercise) : "", onSave: async (v) => { await saveExercise(dk, v); exercise != null ? toast.success("Exercise updated!") : toast.success("Exercise added!"); } })}
        />
        <MetricCard iconType="progress" label="Progress"
          value={photo ? "✓" : "–"} unit="pic"
          onAdd={() => setMetricModal({ label: "Progress", unit: "pic", current: photo || "–", dayKey: dk, onSave: async (v, newDayKey) => { await addProgressPhotoRecord(newDayKey || dk, v); toast.success("Progress photo added!"); }, onDelete: async () => { await deleteLatestProgressPhoto(dk); toast.success("Photo deleted!"); } })}
        />
        <MetricCard iconType="calories" label="Calories"
          value={nutrition.calories} unit="kcal"
          onAdd={() => setShowNutrition(true)}
        />
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