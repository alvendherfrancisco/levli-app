import React from "react";
import { Plus } from "lucide-react";
import {
  ScaleIcon, FlameIcon, ProteinIcon, FiberIcon, CarbsIcon, WaterDropIcon, DumbbellIcon, CameraIcon,
} from "@/components/onboarding/LevliIcons";

/**
 * A compact metric card with the Levli custom icon — used in the small metrics grid.
 * White card, soft shadow, Levli gradient icon, bold value.
 */
export default function MetricCard({ iconType, label, value, unit, onAdd }) {
  const ICON_MAP = {
    weight: { Icon: ScaleIcon, grad: "from-violet-400 to-indigo-500" },
    calories: { Icon: FlameIcon, grad: "from-orange-400 to-pink-500" },
    protein: { Icon: ProteinIcon, grad: "from-pink-400 to-orange-400" },
    fiber: { Icon: FiberIcon, grad: "from-emerald-400 to-teal-500" },
    carbs: { Icon: CarbsIcon, grad: "from-amber-400 to-orange-500" },
    water: { Icon: WaterDropIcon, grad: "from-blue-400 to-teal-500" },
    exercise: { Icon: DumbbellIcon, grad: "from-violet-400 to-indigo-500" },
    progress: { Icon: CameraIcon, grad: "from-amber-400 to-pink-500" },
  };
  const { Icon, grad } = ICON_MAP[iconType] || ICON_MAP.weight;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100/80 dark:border-white/[0.04] min-h-[96px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <button onClick={onAdd} className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/[0.06] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/[0.12] transition-colors flex-shrink-0">
          <Plus size={12} className="text-gray-500 dark:text-white/70" />
        </button>
      </div>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mb-0.5 leading-tight">{label}</span>
      <p className="text-base font-bold text-gray-800 dark:text-white leading-tight">
        {value} <span className="text-xs font-normal text-gray-400 dark:text-gray-500">{unit}</span>
      </p>
    </div>
  );
}