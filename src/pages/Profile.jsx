import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Syringe, Scale, User, Check, Loader2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";

export default function Profile() {
  const { profile, setProfile } = useAppState();
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    setLocal({ ...profile });
  }, [profile]);

  const heightUnit = local.height_unit || "in";
  const weightUnit = local.weight_unit || "lb";

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
      <button
        onClick={() => handleSave(fields)}
        disabled={saving[key]}
        className={`px-4 py-2.5 rounded-[14px] font-semibold text-sm transition-all min-w-[64px] flex items-center justify-center shadow-warm active:scale-[0.97] ${
          saved[key] ? "bg-success text-white" : "bg-accent text-white"
        } disabled:opacity-60`}
      >
        {saving[key] ? <Loader2 size={14} className="animate-spin" /> : saved[key] ? <Check size={16} /> : "Save"}
      </button>
    );
  };

  const UnitToggle = ({ label, opt1, opt2, field }) => (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-ink-secondary font-medium">{label}</span>
      <div className="flex rounded-[10px] overflow-hidden border border-border-warm">
        {[opt1, opt2].map((opt) => (
          <button
            key={opt}
            onClick={async () => {
              const next = { ...local, [field]: opt };
              setLocal(next);
              await setProfile({ ...profile, [field]: opt });
            }}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              local[field] === opt
                ? "bg-accent-tint text-accent font-semibold"
                : "bg-surface text-ink-tertiary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-canvas min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-canvas w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-ink">Profile</h1>
        <Link to="/settings"><Settings size={22} className="text-ink-secondary" /></Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-4 pb-8">
        {/* Profile Info */}
        <div className="bg-surface rounded-[20px] p-5 shadow-card border border-border-warm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-[10px] bg-accent-tint flex items-center justify-center">
              <User size={16} className="text-accent" />
            </div>
            <h3 className="font-bold text-ink text-lg">Profile Info</h3>
          </div>
          <div className="border-b-2 border-accent w-10 mb-5" />

          {/* Height — dynamic unit display */}
          <label className="text-sm text-ink font-semibold block mb-2">Height</label>
          <div className="flex items-center gap-2 mb-4">
            {heightUnit === "in" ? (
              <>
                <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
                  <input
                    type="number" value={local.height_ft || ""} min="0" max="9"
                    onChange={(e) => setLocal({ ...local, height_ft: e.target.value })}
                    className="w-full outline-none text-base bg-transparent text-ink"
                  />
                  <span className="text-ink-tertiary text-sm ml-1">ft</span>
                </div>
                <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
                  <input
                    type="number" value={local.height_in || ""} min="0" max="11"
                    onChange={(e) => setLocal({ ...local, height_in: e.target.value })}
                    className="w-full outline-none text-base bg-transparent text-ink"
                  />
                  <span className="text-ink-tertiary text-sm ml-1">in</span>
                </div>
                <SaveBtn fields={["height_ft", "height_in"]} />
              </>
            ) : (
              <>
                <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
                  <input
                    type="number" value={local.height_ft || ""} min="0"
                    onChange={(e) => setLocal({ ...local, height_ft: e.target.value })}
                    className="w-full outline-none text-base bg-transparent text-ink"
                    placeholder="0.0"
                  />
                  <span className="text-ink-tertiary text-sm ml-1">cm</span>
                </div>
                <SaveBtn fields={["height_ft"]} />
              </>
            )}
          </div>

          <label className="text-sm text-ink font-semibold block mb-2">Goal Weight</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
              <input
                type="number" value={local.goal_weight || ""} min="0"
                onChange={(e) => setLocal({ ...local, goal_weight: e.target.value })}
                className="w-full outline-none text-base bg-transparent text-ink"
              />
              <span className="text-ink-tertiary text-sm ml-1">{weightUnit}</span>
            </div>
            <SaveBtn fields={["goal_weight"]} />
          </div>
        </div>

        {/* Shot Preferences */}
        <div className="bg-surface rounded-[20px] p-5 shadow-card border border-border-warm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-[10px] bg-accent-tint flex items-center justify-center">
              <Syringe size={16} className="text-accent" />
            </div>
            <h3 className="font-bold text-ink text-lg">Shot Preferences</h3>
          </div>
          <div className="border-b-2 border-accent w-10 mb-5" />

          <label className="text-sm text-ink font-semibold block mb-2">Days Between Shots</label>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
              <input
                type="number" value={local.days_between || ""} min="1" max="90"
                onChange={(e) => setLocal({ ...local, days_between: e.target.value })}
                className="w-full outline-none text-base bg-transparent text-ink"
              />
              <span className="text-ink-tertiary text-sm ml-1">days</span>
            </div>
            <SaveBtn fields={["days_between"]} />
          </div>
          <p className="text-xs text-ink-tertiary mb-5">This affects how your next shot date is calculated</p>

          <label className="text-sm text-ink font-semibold block mb-2">Default Medication</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-border-warm rounded-[14px] px-3 py-2.5 bg-surface-alt flex items-center">
              <input
                type="text" value={local.default_medication || ""}
                onChange={(e) => setLocal({ ...local, default_medication: e.target.value })}
                className="w-full outline-none text-base bg-transparent text-ink"
              />
            </div>
            <SaveBtn fields={["default_medication"]} />
          </div>
        </div>

        {/* Measurement Units */}
        <div className="bg-surface rounded-[20px] p-5 shadow-card border border-border-warm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-[10px] bg-accent-tint flex items-center justify-center">
              <Scale size={16} className="text-accent" />
            </div>
            <h3 className="font-bold text-ink text-lg">Measurement Units</h3>
          </div>
          <div className="border-b-2 border-accent w-10 mb-2" />
          <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquid_unit" />
          <div className="border-t border-border-warm" />
          <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="height_unit" />
          <div className="border-t border-border-warm" />
          <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weight_unit" />
        </div>

        <div className="bg-surface-alt rounded-[20px] p-5 border border-border-warm">
          <h4 className="font-bold text-ink mb-1">Important</h4>
          <p className="text-xs text-ink-tertiary leading-relaxed">
            This application is not intended as a substitute for professional medical care. Only your doctor can diagnose and treat medical problems.
          </p>
        </div>
      </div>
    </div>
  );
}