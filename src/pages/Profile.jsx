import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Lock, User, Check, Loader2, Pill, Package, CalendarDays } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { toast } from "sonner";

function numericOnly(value, { allowDecimal = true, max = null, min = 0 } = {}) {
  let v = allowDecimal ? value.replace(/[^0-9.]/g, "") : value.replace(/[^0-9]/g, "");
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
      <button
        onClick={() => handleSave(fields)}
        disabled={saving[key]}
        className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all min-w-[60px] flex items-center justify-center active:scale-95 ${
          saved[key] ? "bg-green-500 text-white" : "bg-indigo-600 text-white"
        } disabled:opacity-60`}
      >
        {saving[key] ? <Loader2 size={14} className="animate-spin" /> : saved[key] ? <Check size={16} /> : "Save"}
      </button>
    );
  };

  const UnitToggle = ({ label, opt1, opt2, field }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <div className="flex rounded-full overflow-hidden border border-gray-200">
        {[opt1, opt2].map((opt) => (
          <button
            key={opt}
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
              local[field] === opt ? "bg-indigo-600 text-white" : "bg-white text-gray-500"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <div className="flex items-center gap-2">
          <Link to="/medications" title="Medications"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Pill size={16} className="text-indigo-500" /></div></Link>
          <Link to="/inventory" title="Stock"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Package size={16} className="text-teal-500" /></div></Link>
          <Link to="/history" title="History"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><CalendarDays size={16} className="text-blue-500" /></div></Link>
          <Link to="/settings"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Settings size={18} className="text-gray-500" /></div></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Info */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center"><User size={18} className="text-teal-500" /></div>
            <h3 className="font-bold text-gray-800 text-lg">Profile Info</h3>
          </div>

          <label className="text-sm text-gray-600 font-medium block mb-2">Height</label>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {heightUnit === "cm" ? (
              <div className={`flex-1 border-2 rounded-xl px-3 py-2.5 flex items-center bg-white min-w-[120px] ${errors.height_ft ? "border-orange-400" : "border-gray-200"}`}>
                <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0.0"
                  onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value) })}
                  className="w-full outline-none text-base bg-transparent text-gray-800 min-w-0" />
                <span className="text-gray-400 text-sm ml-1">cm</span>
              </div>
            ) : (
              <>
                <div className={`flex-1 border-2 rounded-xl px-3 py-2.5 flex items-center bg-white min-w-[80px] ${errors.height_ft ? "border-orange-400" : "border-gray-200"}`}>
                  <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0"
                    onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value, { allowDecimal: false }) })}
                    className="w-full outline-none text-base bg-transparent text-gray-800 min-w-0" />
                  <span className="text-gray-400 text-sm ml-1">ft</span>
                </div>
                <div className={`flex-1 border-2 rounded-xl px-3 py-2.5 flex items-center bg-white min-w-[80px] ${errors.height_in ? "border-orange-400" : "border-gray-200"}`}>
                  <input type="text" inputMode="decimal" value={local.height_in || ""} placeholder="0.0"
                    onChange={(e) => setLocal({ ...local, height_in: numericOnly(e.target.value, { max: 11.9 }) })}
                    className="w-full outline-none text-base bg-transparent text-gray-800 min-w-0" />
                  <span className="text-gray-400 text-sm ml-1">in</span>
                </div>
              </>
            )}
            <SaveBtn fields={heightUnit === "cm" ? ["height_ft"] : ["height_ft", "height_in"]} />
          </div>
          {(errors.height_ft || errors.height_in) && <p className="text-xs text-orange-500 mb-2">Please enter a valid number.</p>}
          {!errors.height_ft && !errors.height_in && <div className="mb-4" />}

          <label className="text-sm text-gray-600 font-medium block mb-2">Goal Weight</label>
          <div className="flex items-center gap-2">
            <div className={`flex-1 border-2 rounded-xl px-3 py-2.5 flex items-center bg-white ${errors.goal_weight ? "border-orange-400" : "border-gray-200"}`}>
              <input type="text" inputMode="decimal" value={local.goal_weight || ""} placeholder="0.0"
                onChange={(e) => setLocal({ ...local, goal_weight: numericOnly(e.target.value) })}
                className="w-full outline-none text-base bg-transparent text-gray-800" />
              <span className="text-gray-400 text-sm ml-1">{local.weight_unit || "lb"}</span>
            </div>
            <SaveBtn fields={["goal_weight"]} />
          </div>
          {errors.goal_weight && <p className="text-xs text-orange-500 mt-1">Please enter a valid number.</p>}
        </div>

        {/* Shot Preferences */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center"><Syringe size={18} className="text-indigo-500" /></div>
            <h3 className="font-bold text-gray-800 text-lg">Shot Preferences</h3>
          </div>

          <label className="text-sm text-gray-600 font-medium block mb-2">Days Between Shots</label>
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex-1 border-2 rounded-xl px-3 py-2.5 flex items-center bg-white ${errors.days_between ? "border-orange-400" : "border-gray-200"}`}>
              <input type="text" inputMode="numeric" value={local.days_between || ""} placeholder="7"
                onChange={(e) => setLocal({ ...local, days_between: numericOnly(e.target.value, { allowDecimal: false, max: 90 }) })}
                className="w-full outline-none text-base bg-transparent text-gray-800" />
              <span className="text-gray-400 text-sm ml-1">days</span>
            </div>
            <SaveBtn fields={["days_between"]} />
          </div>
          {errors.days_between ? <p className="text-xs text-orange-500 mb-1">Please enter a whole number (1–90).</p> : null}
          <p className="text-xs text-gray-400">This affects how your next shot date is calculated</p>
        </div>

        {/* Measurement Units */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center"><Lock size={18} className="text-amber-500" /></div>
            <h3 className="font-bold text-gray-800 text-lg">Measurement Units</h3>
          </div>
          <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquid_unit" />
          <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="height_unit" />
          <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weight_unit" />
        </div>

        <div className="mx-4 mb-8 bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
          <h4 className="font-bold text-gray-700 mb-1">A gentle reminder</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems.
          </p>
        </div>
      </div>
    </div>
  );
}