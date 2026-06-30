import React, { useState, useEffect } from "react";
import { X, RotateCcw, Save } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { todayKey } from "@/lib/dateUtils";

const EMPTY = { calories: "0.0", protein: "0.0", water: "0.0", fiber: "0.0", carbs: "0.0" };

export default function AddNutritionModal({ open, onClose, dayKey }) {
  const dk = dayKey || todayKey();
  const { getNutrition, saveNutrition, profile } = useAppState();
  const liquidUnit = profile?.liquid_unit || "oz";

  const fields = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "water", label: "Water", unit: liquidUnit },
    { key: "fiber", label: "Fiber", unit: "g" },
    { key: "carbs", label: "Carbohydrates", unit: "g" },
  ];

  const [values, setValues] = useState({ ...EMPTY });

  useEffect(() => {
    if (open) setValues(getNutrition(dk));
  }, [open, dk]);

  if (!open) return null;

  const handleSave = () => {
    saveNutrition(dk, values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[480px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold dark:text-[#E8E9F0]">Add Nutrition Data</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-gray-700 dark:text-[#9A9DAE] mb-1 block">{f.label}</label>
              <div className="flex items-center border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] rounded-xl px-4 py-3">
                <input type="number" min="0" value={values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="flex-1 outline-none text-base bg-transparent dark:text-[#E8E9F0]" />
                <span className="text-gray-400 text-sm ml-2">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-8 pt-2">
          <button onClick={() => setValues({ ...EMPTY })} className="flex-1 py-3.5 bg-gray-100 dark:bg-white/[0.07] text-gray-600 dark:text-[#9A9DAE] rounded-xl font-semibold flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleSave} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}