import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { PillIcon, PackageIcon, CalendarIcon, DocumentIcon, BellIcon, ShieldIcon, HelpIcon, LogoutIcon, GearIcon, DropletIcon } from "@/components/onboarding/LevliIcons";
import { useAppState } from "@/lib/AppState";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

function numericOnly(value, { allowDecimal = true, max = null, min = 0 } = {}) {
  let v = allowDecimal ? value.replace(/[^0-9.]/g, "") : value.replace(/[^0-9]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
  if (max !== null && parseFloat(v) > max) v = String(max);
  return v;
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAppState();
  const { logout } = useAuth();
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => { setLocal({ ...profile }); }, [profile]);

  const heightUnit = local.height_unit || "in";

  const handleSave = async (fields) => {
    const updates = Array.isArray(fields) ? fields : [fields];
    const key = updates.join("+");
    const numericFields = ["height_ft", "height_in", "goal_weight", "days_between"];
    let hasError = false;
    updates.forEach((f) => {
      if (numericFields.includes(f)) {
        const v = local[f];
        if (v !== "" && v !== undefined && (isNaN(parseFloat(v)) || parseFloat(v) < 0)) { setErrors((p) => ({ ...p, [f]: "Must be a valid number" })); hasError = true; }
        else { setErrors((p) => ({ ...p, [f]: null })); }
      }
    });
    if (hasError) return;
    setSaving((p) => ({ ...p, [key]: true }));
    const partial = {}; updates.forEach((f) => { partial[f] = local[f]; });
    try { await setProfile({ ...profile, ...partial }); toast.success("Profile updated!"); }
    catch { toast.error("Failed to update profile"); }
    setSaving((p) => ({ ...p, [key]: false }));
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 1500);
  };

  const SaveBtn = ({ fields }) => {
    const key = Array.isArray(fields) ? fields.join("+") : fields;
    return (
      <button onClick={() => handleSave(fields)} disabled={saving[key]}
        className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all min-w-[60px] flex items-center justify-center ${saved[key] ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"} disabled:opacity-60`}>
        {saving[key] ? <Loader2 size={14} className="animate-spin" /> : saved[key] ? <Check size={16} /> : "Save"}
      </button>
    );
  };

  const UnitToggle = ({ label, opt1, opt2, field }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        {[opt1, opt2].map((opt) => (
          <button key={opt} onClick={async () => { const next = { ...local, [field]: opt }; setLocal(next); try { await setProfile({ ...profile, [field]: opt }); toast.success("Updated!"); } catch { toast.error("Failed"); } }}
            className={`px-5 py-2 text-sm font-medium transition-colors ${local[field] === opt ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>{opt}</button>
        ))}
      </div>
    </div>
  );

  const MENU_ITEMS = [
    { label: "Medications", to: "/medications", Icon: PillIcon },
    { label: "Inventory", to: "/inventory", Icon: PackageIcon },
    { label: "History", to: "/history", Icon: CalendarIcon },
    { label: "Report", to: "/report", Icon: DocumentIcon },
    { label: "Notifications", to: "/settings", Icon: BellIcon },
    { label: "Privacy", to: "/privacy", Icon: ShieldIcon },
    { label: "Settings", to: "/settings", Icon: GearIcon },
    { label: "Help", to: "/settings", Icon: HelpIcon },
  ];

  const handleLogout = () => { logout(); };

  return (
    <div className="min-h-screen w-full">
      <div className="sticky top-0 z-30 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Hero card with mascot */}
        <div className="mx-4 mb-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-teal-500 p-5 shadow-lg shadow-indigo-500/15">
          <div className="absolute -top-4 -right-4 animate-float-1 opacity-50"><DropletIcon size={80} /></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <DropletIcon size={56} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your journey</h2>
              <p className="text-white/80 text-sm">Track, understand, and feel in control</p>
            </div>
          </div>
        </div>

        {/* Menu grid (3 columns) */}
        <div className="px-4 mb-5">
          <div className="grid grid-cols-3 gap-3">
            {MENU_ITEMS.map(({ label, to, Icon }) => (
              <button key={label} onClick={() => navigate(to)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] flex flex-col items-center gap-2 transition-all hover:shadow-md active:scale-95">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Icon size={44} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Profile Info</h3>

          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium block mb-2">Height</label>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {heightUnit === "cm" ? (
              <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 min-w-[120px] ${errors.height_ft ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
                <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0.0" onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value) })} className="w-full outline-none text-base bg-transparent text-gray-800 dark:text-white min-w-0" />
                <span className="text-gray-400 text-sm ml-1">cm</span>
              </div>
            ) : (
              <>
                <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 min-w-[80px] ${errors.height_ft ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
                  <input type="text" inputMode="decimal" value={local.height_ft || ""} placeholder="0" onChange={(e) => setLocal({ ...local, height_ft: numericOnly(e.target.value, { allowDecimal: false }) })} className="w-full outline-none text-base bg-transparent text-gray-800 dark:text-white min-w-0" />
                  <span className="text-gray-400 text-sm ml-1">ft</span>
                </div>
                <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 min-w-[80px] ${errors.height_in ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
                  <input type="text" inputMode="decimal" value={local.height_in || ""} placeholder="0.0" onChange={(e) => setLocal({ ...local, height_in: numericOnly(e.target.value, { max: 11.9 }) })} className="w-full outline-none text-base bg-transparent text-gray-800 dark:text-white min-w-0" />
                  <span className="text-gray-400 text-sm ml-1">in</span>
                </div>
              </>
            )}
            <SaveBtn fields={heightUnit === "cm" ? ["height_ft"] : ["height_ft", "height_in"]} />
          </div>
          {(errors.height_ft || errors.height_in) && <p className="text-xs text-red-500 mb-3">Please enter a valid number.</p>}
          {!errors.height_ft && !errors.height_in && <div className="mb-4" />}

          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium block mb-2">Goal Weight</label>
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.goal_weight ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
              <input type="text" inputMode="decimal" value={local.goal_weight || ""} placeholder="0.0" onChange={(e) => setLocal({ ...local, goal_weight: numericOnly(e.target.value) })} className="w-full outline-none text-base bg-transparent text-gray-800 dark:text-white" />
              <span className="text-gray-400 text-sm ml-1">{local.weight_unit || "lb"}</span>
            </div>
            <SaveBtn fields={["goal_weight"]} />
          </div>
        </div>

        {/* Shot Preferences */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Shot Preferences</h3>
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium block mb-2">Days Between Shots</label>
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex-1 border rounded-xl px-3 py-2.5 flex items-center bg-white dark:bg-gray-800 ${errors.days_between ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
              <input type="text" inputMode="numeric" value={local.days_between || ""} placeholder="7" onChange={(e) => setLocal({ ...local, days_between: numericOnly(e.target.value, { allowDecimal: false, max: 90 }) })} className="w-full outline-none text-base bg-transparent text-gray-800 dark:text-white" />
              <span className="text-gray-400 text-sm ml-1">days</span>
            </div>
            <SaveBtn fields={["days_between"]} />
          </div>
          {errors.days_between ? <p className="text-xs text-red-500 mb-1">Please enter a whole number (1–90).</p> : null}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This affects how your next shot date is calculated</p>
        </div>

        {/* Measurement Units */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-3">Measurement Units</h3>
          <UnitToggle label="Liquid Unit" opt1="mL" opt2="oz" field="liquid_unit" />
          <UnitToggle label="Height Unit" opt1="cm" opt2="in" field="height_unit" />
          <UnitToggle label="Weight Unit" opt1="kg" opt2="lb" field="weight_unit" />
        </div>

        {/* Logout */}
        <div className="px-4 mb-8">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-gray-800 text-red-500 font-semibold rounded-2xl shadow-sm border border-gray-100/80 dark:border-white/[0.04] transition-all active:scale-[0.98]">
            <LogoutIcon size={20} /> Log Out
          </button>
        </div>

        <div className="pb-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">Version 1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">© 2026 Levli</p>
        </div>
      </div>
    </div>
  );
}