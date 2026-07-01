import React, { useState, useEffect } from "react";
import { X, Save, MapPin, Star, ChevronDown, Trash2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { formatShotDate } from "@/lib/dateUtils";

const medications = ["Zepbound®", "Mounjaro®", "Tirzepatide", "Wegovy®", "Ozempic®", "Semaglutide", "Retatrutide", "Saxenda®", "Liraglutide"];
const injectionSites = [
  "Stomach – Upper Left", "Stomach – Upper Right", "Stomach – Lower Left", "Stomach – Lower Right",
  "Thigh – Left", "Thigh – Right", "Upper Arm – Left", "Upper Arm – Right",
];
const DRUG_CLASS = { "Ozempic®": "Semaglutide", "Wegovy®": "Semaglutide", "Mounjaro®": "Tirzepatide", "Zepbound®": "Tirzepatide", "Tirzepatide": "Tirzepatide", "Semaglutide": "Semaglutide", "Retatrutide": "Retatrutide", "Saxenda®": "Liraglutide", "Liraglutide": "Liraglutide" };

const pad = (n) => String(n).padStart(2, "0");

function toInputDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function toInputTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddShotModal({ open, onClose, editingShot }) {
  const { addShot, updateShot, deleteShot, profile, getRecommendedSite } = useAppState();

  const defaultMed = profile?.default_medication || "Ozempic®";
  const now = new Date();

  const [pain, setPain] = useState(0);
  const [medication, setMedication] = useState(defaultMed);
  const [dose, setDose] = useState("2.50");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(toInputDate(now));
  const [time, setTime] = useState(toInputTime(now));
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const recommendedSite = getRecommendedSite();

  useEffect(() => {
    if (open) {
      if (editingShot) {
        setMedication(editingShot.medication || defaultMed);
        setDose(String(editingShot.dose || "2.50"));
        setSite(editingShot.site || recommendedSite);
        setNotes(editingShot.notes || "");
        setPain(editingShot.pain ?? 0);
        // parse date/time back to input format
        try {
          const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
          const parts = editingShot.date.replace(",", "").split(" ");
          const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
          setDate(toInputDate(d));
        } catch { setDate(toInputDate(now)); }
        // parse time "6:00 AM" → "06:00"
        try {
          const [timePart, ampm] = editingShot.time.split(" ");
          let [h, m] = timePart.split(":").map(Number);
          if (ampm === "PM" && h !== 12) h += 12;
          if (ampm === "AM" && h === 12) h = 0;
          setTime(`${pad(h)}:${pad(m)}`);
        } catch { setTime(toInputTime(now)); }
      } else {
        const n = new Date();
        setMedication(defaultMed);
        setDose("2.50");
        setSite(recommendedSite);
        setNotes("");
        setPain(0);
        setDate(toInputDate(n));
        setTime(toInputTime(n));
      }
      setError("");
    }
  }, [open, editingShot]);

  if (!open) return null;

  const handleSave = async () => {
    const doseNum = parseFloat(dose);
    if (isNaN(doseNum) || doseNum <= 0 || doseNum > 100) {
      setError("Please enter a valid dose (0.1 – 100 mg).");
      return;
    }
    setSaving(true);
    setError("");
    const d = new Date(date + "T" + time);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formattedDate = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,"0")}, ${d.getFullYear()}`;
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const formattedTime = `${h}:${pad(m)} ${ampm}`;
    const payload = {
      medication, dose: doseNum, drugClass: DRUG_CLASS[medication] || "GLP-1",
      date: formattedDate, time: formattedTime, site, pain: pain || 0, notes,
    };
    if (editingShot) {
      await updateShot(editingShot.id, {
        medication: payload.medication, dose: payload.dose, drug_class: payload.drugClass,
        date: payload.date, time: payload.time, site: payload.site,
        pain: payload.pain, notes: payload.notes,
      });
    } else {
      await addShot(payload);
    }
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!editingShot) return;
    if (!confirm("Delete this shot?")) return;
    await deleteShot(editingShot.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">{editingShot ? "Edit Shot Log" : "Add Shot Log"}</h2>
          <div className="flex items-center gap-3">
            {editingShot && (
              <button onClick={handleDelete}><Trash2 size={20} className="text-red-400" /></button>
            )}
            <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          </div>
        </div>

        {error && <p className="mx-5 mb-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-3 py-2">{error}</p>}

        <div className="px-5 pb-4 space-y-5">
          {/* Date & Time */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Date & Time</label>
            <div className="flex gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="flex-1 border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-blue-300" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="flex-1 border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none focus:border-blue-300" />
            </div>
          </div>

          {/* Medication */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Medication</label>
            <div className="relative">
              <button onClick={() => { setShowMedDropdown(!showMedDropdown); setShowSiteDropdown(false); }}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <span className="text-base">{medication}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showMedDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg">
                  {medications.map((m) => (
                    <button key={m} onClick={() => { setMedication(m); setShowMedDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] ${medication === m ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-medium" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dose */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Dose (mg)</label>
            <div className="border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] rounded-xl px-4 py-3 flex items-center">
              <input type="number" value={dose} min="0.1" max="100" step="0.25"
                onChange={(e) => setDose(e.target.value)} className="flex-1 outline-none text-base bg-transparent dark:text-[#E8E9F0]" />
              <span className="text-gray-400 text-sm">mg</span>
            </div>
          </div>

          {/* Injection Site */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Injection Site</label>
            <div className="rounded-xl p-3 mb-2 flex items-start gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <MapPin size={16} className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Recommended: {recommendedSite}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400/70">Based on your rotation history</p>
              </div>
              <button onClick={() => setSite(recommendedSite)} className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Use</button>
            </div>
            <div className="relative">
              <button onClick={() => { setShowSiteDropdown(!showSiteDropdown); setShowMedDropdown(false); }}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span className="text-base font-semibold">{site}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showSiteDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {injectionSites.map((s) => (
                    <button key={s} onClick={() => { setSite(s); setShowSiteDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm dark:text-[#E8E9F0] ${site === s ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-medium" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Pain Level: <span className="text-blue-600">{pain}/10</span></label>
            <div className="px-1">
              <input type="range" min="0" max="10" value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 – No Pain</span><span>10 – Severe</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Notes (Optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or side effects experienced"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:border-blue-300" />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={16} /> {saving ? "Saving…" : editingShot ? "Update Shot" : "Save Shot"}
          </button>
        </div>
      </div>
    </div>
  );
}