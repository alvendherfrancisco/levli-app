import React, { useState } from "react";
import { X, RotateCcw, Save } from "lucide-react";
import { useAppState } from "@/lib/AppState";

const EMPTY = { calories: "0.0", protein: "0.0", water: "0.0", fiber: "0.0", carbs: "0.0" };
const fields = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "water", label: "Water", unit: "oz" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "carbs", label: "Carbohydrates", unit: "g" },
];

export default function AddNutritionModal({ open, onClose }) {
  const { nutrition, setNutrition } = useAppState();
  const [values, setValues] = useState({ ...nutrition });

  if (!open) return null;

  const handleSave = () => {
    setNutrition(values);
    onClose();
  };

  const handleReset = () => setValues({ ...EMPTY });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[480px] animate-in slide-in-from-bottom sm:mx-4">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">Add Nutrition Data</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">{f.label}</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">
                <input type="number" value={values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="flex-1 outline-none text-base" />
                <span className="text-gray-400 text-sm ml-2">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-8 pt-2">
          <button onClick={handleReset} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold flex items-center justify-center gap-2">
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