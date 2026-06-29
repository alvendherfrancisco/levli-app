import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Lock, User } from "lucide-react";

export default function Profile() {
  const [heightFt, setHeightFt] = useState("0");
  const [heightIn, setHeightIn] = useState("0.0");
  const [goalWeight, setGoalWeight] = useState("0.0");
  const [daysBetween, setDaysBetween] = useState("7");
  const [liquidUnit, setLiquidUnit] = useState("oz");
  const [heightUnit, setHeightUnit] = useState("in");
  const [weightUnit, setWeightUnit] = useState("lb");

  const UnitToggle = ({ label, opt1, opt2, value, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        <button
          onClick={() => onChange(opt1)}
          className={`px-5 py-2 text-sm font-medium transition-colors ${value === opt1 ? "bg-blue-100 text-blue-700" : "bg-white text-gray-500"}`}
        >
          {opt1}
        </button>
        <button
          onClick={() => onChange(opt2)}
          className={`px-5 py-2 text-sm font-medium transition-colors ${value === opt2 ? "bg-blue-100 text-blue-700" : "bg-white text-gray-500"}`}
        >
          {opt2}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
      </div>

      {/* Profile Info */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Profile Info</h3>
        </div>
        <div className="border-b-2 border-blue-500 w-10 mb-4" />

        {/* Height */}
        <label className="text-sm text-gray-700 font-medium block mb-2">Height</label>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">ft</span>
          </div>
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">in</span>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">Save</button>
        </div>

        {/* Goal Weight */}
        <label className="text-sm text-gray-700 font-medium block mb-2">Goal Weight</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">lb</span>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">Save</button>
        </div>
      </div>

      {/* Shot Preferences */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Syringe size={16} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Shot Preferences</h3>
        </div>
        <div className="border-b-2 border-blue-500 w-10 mb-4" />

        <label className="text-sm text-gray-700 font-medium block mb-2">Days Between Shots</label>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={daysBetween} onChange={(e) => setDaysBetween(e.target.value)} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">days</span>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">Save</button>
        </div>
        <p className="text-xs text-gray-400">This affects how your next shot date is calculated</p>
      </div>

      {/* Measurement Units */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Lock size={16} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Measurement Units</h3>
        </div>
        <div className="border-b-2 border-blue-500 w-10 mb-4" />

        <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" value={liquidUnit} onChange={setLiquidUnit} />
        <UnitToggle label="Height Unit" opt1="cm" opt2="in" value={heightUnit} onChange={setHeightUnit} />
        <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" value={weightUnit} onChange={setWeightUnit} />
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mb-8 bg-gray-100 rounded-2xl p-4 border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-1">Important</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems. For specific medical advice, diagnoses, and treatment, consult your doctor.
        </p>
      </div>
    </div>
  );
}