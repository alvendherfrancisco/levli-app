import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Syringe, Info, HelpCircle, Wind } from "lucide-react";
import DateStrip from "@/components/home/DateStrip";
import NextShotCard from "@/components/home/NextShotCard";
import MetricsGrid from "@/components/home/MetricsGrid";
import AddNutritionModal from "@/components/modals/AddNutritionModal";
import AddShotModal from "@/components/modals/AddShotModal";

export default function Home() {
  const [showNutrition, setShowNutrition] = useState(false);
  const [showShot, setShowShot] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning!" : hour < 18 ? "Good Afternoon!" : "Good Evening!";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
        <Link to="/settings">
          <Settings size={24} className="text-gray-600" />
        </Link>
      </div>

      {/* Date strip */}
      <DateStrip />

      {/* Next Shot */}
      <NextShotCard hasShots={false} />

      {/* Metrics grid */}
      <MetricsGrid onAddMetric={(label) => {
        if (["Calories","Protein","Water","Fiber","Carbs"].includes(label)) setShowNutrition(true);
      }} />

      {/* Side Effects card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
            <Wind size={16} className="text-teal-500" />
          </div>
          <span className="font-semibold text-gray-700">Side effects</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
          <Info size={16} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">Tap to add side effects.</p>
        </div>
      </div>

      {/* Medication Levels card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Syringe size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Medication Levels</h3>
              <p className="text-xs text-blue-500">Estimated medication levels in your system over time.</p>
            </div>
          </div>
          <HelpCircle size={18} className="text-blue-400" />
        </div>
        <div className="border-b-2 border-blue-500 w-12 mb-3" />
        <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
          <Info size={16} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">No shot data available.</p>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowShot(true)}
        className="fixed bottom-24 right-5 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} /> Add Shot
      </button>

      <AddNutritionModal open={showNutrition} onClose={() => setShowNutrition(false)} />
      <AddShotModal open={showShot} onClose={() => setShowShot(false)} />
    </div>
  );
}