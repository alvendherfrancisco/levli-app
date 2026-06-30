import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Lock, User, Check, Loader2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";

export default function Profile() {
  const { profile, setProfile } = useAppState();
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState({});

  // Keep local in sync when profile loads from DB
  useEffect(() => {
    setLocal({ ...profile });
  }, [profile]);

  const handleSave = async (fields) => {
    const updates = Array.isArray(fields) ? fields : [fields];
    const key = updates.join("+");
    setSaving((p) => ({ ...p, [key]: true }));
    const partial = {};
    updates.forEach((f) => { partial[f] = local[f]; });
    await setProfile({ ...profile, ...partial });
    setSaving((p) => ({ ...p, [key]: false }));
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 1500);
  };

  const SaveBtn = ({ fields }) => {
    const key = Array.isArray(fields) ? fields.join("+") : fields;
    return (
      <button onClick={() => handleSave(fields)}
        disabled={saving[key]}
        className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all min-w-[60px] flex items-center justify-center ${
          saved[key] ? "bg-green-500 text-white" : "bg-blue-600 text-white"
        } disabled:opacity-60`}>
        {saving[key] ? <Loader2 size={14} className="animate-spin" /> : saved[key] ? <Check size={16} /> : "Save"}
      </button>
    );
  };

  const UnitToggle = ({ label, opt1, opt2, field }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {[opt1, opt2].map((opt) => (
          <button key={opt}
            onClick={async () => {
              const next = { ...local, [field]: opt };
              setLocal(next);
              await setProfile({ ...profile, [field]: opt });
            }}
            className={`px-5 py-2 text-sm font-medium transition-colors ${local[field] === opt ? "bg-blue-100 text-blue-700" : "bg-white text-gray-500"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Info */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><User size={16} className="text-blue-600" /></div>
            <h3 className="font-bold text-gray-900 text-lg">Profile Info</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-10 mb-4" />

          <label className="text-sm text-gray-700 font-medium block mb-2">Height</label>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
              <input type="number" value={local.height_ft || ""} min="0" max="9"
                onChange={(e) => setLocal({ ...local, height_ft: e.target.value })} className="w-full outline-none text-base" />
              <span className="text-gray-400 text-sm ml-1">ft</span>
            </div>
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
              <input type="number" value={local.height_in || ""} min="0" max="11"
                onChange={(e) => setLocal({ ...local, height_in: e.target.value })} className="w-full outline-none text-base" />
              <span className="text-gray-400 text-sm ml-1">in</span>
            </div>
            <SaveBtn fields={["height_ft", "height_in"]} />
          </div>

          <label className="text-sm text-gray-700 font-medium block mb-2">Goal Weight</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
              <input type="number" value={local.goal_weight || ""} min="0"
                onChange={(e) => setLocal({ ...local, goal_weight: e.target.value })} className="w-full outline-none text-base" />
              <span className="text-gray-400 text-sm ml-1">{local.weight_unit || "lb"}</span>
            </div>
            <SaveBtn fields={["goal_weight"]} />
          </div>
        </div>

        {/* Shot Preferences */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Syringe size={16} className="text-blue-600" /></div>
            <h3 className="font-bold text-gray-900 text-lg">Shot Preferences</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-10 mb-4" />

          <label className="text-sm text-gray-700 font-medium block mb-2">Days Between Shots</label>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
              <input type="number" value={local.days_between || ""} min="1" max="90"
                onChange={(e) => setLocal({ ...local, days_between: e.target.value })} className="w-full outline-none text-base" />
              <span className="text-gray-400 text-sm ml-1">days</span>
            </div>
            <SaveBtn fields={["days_between"]} />
          </div>
          <p className="text-xs text-gray-400">This affects how your next shot date is calculated</p>

          <label className="text-sm text-gray-700 font-medium block mb-2 mt-4">Default Medication</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center">
              <input type="text" value={local.default_medication || ""}
                onChange={(e) => setLocal({ ...local, default_medication: e.target.value })} className="w-full outline-none text-base" />
            </div>
            <SaveBtn fields={["default_medication"]} />
          </div>
        </div>

        {/* Measurement Units */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Lock size={16} className="text-blue-600" /></div>
            <h3 className="font-bold text-gray-900 text-lg">Measurement Units</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-10 mb-4" />
          <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquid_unit" />
          <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="height_unit" />
          <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weight_unit" />
        </div>

        <div className="mx-4 mb-8 bg-gray-100 rounded-2xl p-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-1">Important</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems.
          </p>
        </div>
      </div>
    </div>
  );
}