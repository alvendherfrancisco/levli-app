import React from "react";
import MetricCard from "@/components/home/MetricCard";
import { Scale, Flame, Beef, Leaf, Cookie, Droplets, Dumbbell, Camera } from "lucide-react";

const metrics = [
  { icon: <Scale size={16} className="text-yellow-600" />, label: "Weight", value: "–", unit: "lb", color: "bg-yellow-100" },
  { icon: <Flame size={16} className="text-orange-500" />, label: "Calories", value: "0", unit: "kcal", color: "bg-orange-100" },
  { icon: <Beef size={16} className="text-teal-500" />, label: "Protein", value: "0.0", unit: "g", color: "bg-teal-100" },
  { icon: <Leaf size={16} className="text-green-500" />, label: "Fiber", value: "0.0", unit: "g", color: "bg-green-100" },
  { icon: <Cookie size={16} className="text-amber-500" />, label: "Carbs", value: "0.0", unit: "g", color: "bg-amber-100" },
  { icon: <Droplets size={16} className="text-blue-500" />, label: "Water", value: "0.0", unit: "oz", color: "bg-blue-100" },
  { icon: <Dumbbell size={16} className="text-red-400" />, label: "Exercise", value: "0", unit: "min", color: "bg-red-100" },
  { icon: <Camera size={16} className="text-purple-500" />, label: "Progress", value: "–", unit: "pic", color: "bg-purple-100" },
];

export default function MetricsGrid({ onAddMetric }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} onAdd={() => onAddMetric?.(m.label)} />
      ))}
    </div>
  );
}