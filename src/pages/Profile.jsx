import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Lock, User, Check, Loader2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { toast } from "sonner";

// Only allow digits, one leading decimal, and basic numeric chars
function numericOnly(value, { allowDecimal = true, max = null, min = 0 } = {}) {
  let v = allowDecimal ? value.replace(/[^0-9.]/g, "") : value.replace(/[^0-9]/g, "");
  // Prevent multiple decimal points
  const parts = v.split(".");
  if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
  if (max !== null && parseFloat(v) > max) v = String(max);
  return v;
}

export default function Profile() {
  const { profile, setProfile } = useAppState();
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocal({ ...profile });
  }, [profile]);

  const heightUnit = local.height_unit || "in";

  const handleSave = async (fields) => {
    const updates = Array.isArray(fields) ? fields : [fields];
    const key = updates.join("+");
    // Validate numeric fields before saving
    const numericFields = ["height_ft", "height_in", "goal_weight", "days_between"];
    let hasError = false;
    updates.forEach((f) => {
      if (numericFields.includes(f)) {
        const v = local[f];
        if (v !== "" && v !== undefined && (isNaN(parseFloat(v)) || parseFloat(v) < 0)) {
          setErrors((p) => ({ ...p, [f]: "Must be a valid number" }));
          hasError = true;
        } else {
          setErrors((p) => ({ ...p, [f]: null }));
        }
      }
    });
    if (hasError) return;
    setSaving((p) => ({ ...p, [key]: true }));
    const partial = {};
    updates.forEach((f) => { partial[f] = local[f]; });
    try {
      await setProfile({ ...profile, ...partial });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
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
      saved[key] ? "bg-green-500 text-white" : "bg-teal-600 text-white"} disabled:opacity-60`
      }>
        {saving[key] ? <Loader2 size={14} className="animate-spin" /> : saved[key] ? <Check size={16} /> : "Save"}
      </button>);

  };

  const UnitToggle = ({ label, opt1, opt2, field }) =>
  <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        {[opt1, opt2].map((opt) =>
      <button key={opt}
      onClick={async () => {
        const next = { ...local, [field]: opt };
        setLocal(next);
        try {
          await setProfile({ ...profile, [field]: opt });
          toast.success("Profile updated successfully!");
        } catch (err) {
          toast.error("Failed to update profile");
        }
      }}
      className={`px-5 py-2 text-sm font-medium transition-colors ${
      local[field] === opt ?
      "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300" :
      "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`
      }>
            {opt}
          </button>
      )}
      </div>
    </div>;


  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Info */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <User size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Profile Info</h3>
          </div>
          <div className="border-b-2 border-teal-500 w-10 mb-4" />

          <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-2">Height</label>
          <div className="flex items-center gap-2 mb-1">
            {heightUnit === "cm" ?
            <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.height_ft ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}>
                <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0.0"
              onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value) })}
              className="w-full outline-none text-base bg-transparent text-gray-900 dark:text-white" />
                <span className="text-gray-400 text-sm ml-1">cm</span>
              </div> :
            <>
                <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.height_ft ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}>
                  <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0"
                onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value, { allowDecimal: false }) })}
                className="w-full outline-none text-base bg-transparent text-gray-900 dark:text-white" />
                  <span className="text-gray-400 text-sm ml-1">ft</span>
                </div>
                <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.height_in ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}>
                  <input type="text" inputMode="decimal" value={local.height_in || ""} placeholder="0.0"
                onChange={(e) => setLocal({ ...local, height_in: numericOnly(e.target.value, { max: 11.9 }) })}
                className="w-full outline-none text-base bg-transparent text-gray-900 dark:text-white" />
                  <span className="text-gray-400 text-sm ml-1">in</span>
                </div>
              </>
            }
            <SaveBtn fields={heightUnit === "cm" ? ["height_ft"] : ["height_ft", "height_in"]} />
          </div>
          {(errors.height_ft || errors.height_in) && <p className="text-xs text-red-500 mb-2">Please enter a valid number.</p>}
          {!errors.height_ft && !errors.height_in && <div className="mb-4" />}

          <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-2">Goal Weight</label>
          <div className="flex items-center gap-2">
            <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.goal_weight ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}>
              <input type="text" inputMode="decimal" value={local.goal_weight || ""} placeholder="0.0"
              onChange={(e) => setLocal({ ...local, goal_weight: numericOnly(e.target.value) })}
              className="w-full outline-none text-base bg-transparent text-gray-900 dark:text-white" />
              <span className="text-gray-400 text-sm ml-1">{local.weight_unit || "lb"}</span>
            </div>
            <SaveBtn fields={["goal_weight"]} />
          </div>
          {errors.goal_weight && <p className="text-xs text-red-500 mt-1">Please enter a valid number.</p>}
        </div>

        {/* Shot Preferences */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <Syringe size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Shot Preferences</h3>
          </div>
          <div className="border-b-2 border-teal-500 w-10 mb-4" />

          <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-2">Days Between Shots</label>
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.days_between ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}>
              <input type="text" inputMode="numeric" value={local.days_between || ""} placeholder="7"
              onChange={(e) => setLocal({ ...local, days_between: numericOnly(e.target.value, { allowDecimal: false, max: 90 }) })}
              className="w-full outline-none text-base bg-transparent text-gray-900 dark:text-white" />
              <span className="text-gray-400 text-sm ml-1">days</span>
            </div>
            <SaveBtn fields={["days_between"]} />
          </div>
          {errors.days_between ? <p className="text-xs text-red-500 mb-1">Please enter a whole number (1–90).</p> : null}
          <p className="text-xs text-gray-400 dark:text-gray-500">This affects how your next shot date is calculated</p>
        </div>

        {/* Measurement Units */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Lock size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Measurement Units</h3>
          </div>
          <div className="border-b-2 border-teal-500 w-10 mb-4" />
          <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquid_unit" />
          <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="height_unit" />
          <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weight_unit" />
        </div>

        <div className="mx-4 mb-8 bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Important</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems.
          </p>
        </div>
      </div>
    </div>);

}