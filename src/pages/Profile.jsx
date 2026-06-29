import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Lock, User, Check } from "lucide-react";
import { useAppState } from "@/lib/AppState";

export default function Profile() {
  const { profile, setProfile } = useAppState();
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState({});

  const handleSave = (field) => {
    setProfile((prev) => ({ ...prev, [field]: local[field] }));
    setSaved((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [field]: false })), 1500);
  };

  const SaveBtn = ({ field }) => (
    <button onClick={() => handleSave(field)}
      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
        saved[field] ? "bg-green-500 text-white" : "bg-blue-600 text-white"
      }`}>
      {saved[field] ? <Check size={16} /> : "Save"}
    </button>
  );

  const UnitToggle = ({ label, opt1, opt2, field }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {[opt1, opt2].map((opt) => (
          <button key={opt}
            onClick={() => { setLocal((p) => ({ ...p, [field]: opt })); setProfile((p) => ({ ...p, [field]: opt })); }}
            className={`px-5 py-2 text-sm font-medium transition-colors ${local[field] === opt ? "bg-blue-100 text-blue-700" : "bg-white text-gray-500"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
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

        <label className="text-sm text-gray-700 font-medium block mb-2">Height</label>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={local.heightFt} onChange={(e) => setLocal({ ...local, heightFt: e.target.value })} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">ft</span>
          </div>
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={local.heightIn} onChange={(e) => setLocal({ ...local, heightIn: e.target.value })} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">in</span>
          </div>
          <SaveBtn field="heightFt" />
        </div>

        <label className="text-sm text-gray-700 font-medium block mb-2">Goal Weight</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
            <input type="number" value={local.goalWeight} onChange={(e) => setLocal({ ...local, goalWeight: e.target.value })} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">lb</span>
          </div>
          <SaveBtn field="goalWeight" />
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
            <input type="number" value={local.daysBetween} onChange={(e) => setLocal({ ...local, daysBetween: e.target.value })} className="w-full outline-none text-base" />
            <span className="text-gray-400 text-sm ml-1">days</span>
          </div>
          <SaveBtn field="daysBetween" />
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
        <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquidUnit" />
        <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="heightUnit" />
        <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weightUnit" />
      </div>

      <div className="mx-4 mb-8 bg-gray-100 rounded-2xl p-4 border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-1">Important</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems.
        </p>
      </div>
    </div>
  );
}