import React, { useState } from "react";
import { X, Save, MapPin, Star, ChevronDown } from "lucide-react";
import { useAppState } from "@/lib/AppState";

const medications = ["Zepbound®", "Mounjaro®", "Tirzepatide", "Wegovy®", "Ozempic®", "Semaglutide", "Retatrutide", "Saxenda®", "Liraglutide"];
const injectionSites = [
  "Stomach – Upper Left", "Stomach – Upper Right", "Stomach – Lower Left", "Stomach – Lower Right",
  "Thigh – Left", "Thigh – Right", "Upper Arm – Left", "Upper Arm – Right",
];

const DRUG_CLASS = { "Ozempic®": "Semaglutide", "Wegovy®": "Semaglutide", "Mounjaro®": "Tirzepatide", "Zepbound®": "Tirzepatide" };

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

export default function AddShotModal({ open, onClose }) {
  const { addShot } = useAppState();
  const [pain, setPain] = useState(0);
  const [medication, setMedication] = useState("Ozempic®");
  const [dose, setDose] = useState("2.50");
  const [site, setSite] = useState("Stomach – Upper Left");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    const d = new Date(date + "T" + time);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formattedDate = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,"0")}, ${d.getFullYear()}`;
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const formattedTime = `${h}:${pad(m)} ${ampm}`;
    addShot({ medication, dose: parseFloat(dose), drugClass: DRUG_CLASS[medication] || "GLP-1", date: formattedDate, time: formattedTime, site, pain, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold">Add Shot Log</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-5">
          {/* Date & Time */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Date & Time</label>
            <div className="flex gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-300" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-300" />
            </div>
          </div>

          {/* Medication */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Medication</label>
            <div className="relative">
              <button onClick={() => { setShowMedDropdown(!showMedDropdown); setShowSiteDropdown(false); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <span className="text-base">{medication}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showMedDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  {medications.map((m) => (
                    <button key={m} onClick={() => { setMedication(m); setShowMedDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${medication === m ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dose */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Dose (mg)</label>
            <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center">
              <input type="number" value={dose} onChange={(e) => setDose(e.target.value)} className="flex-1 outline-none text-base" step="0.25" />
              <span className="text-gray-400 text-sm">mg</span>
            </div>
          </div>

          {/* Injection Site */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Injection Site</label>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-2 flex items-start gap-2">
              <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700">Recommended: Stomach – Upper Left</p>
                <p className="text-xs text-blue-500">Great starting point for first injection</p>
              </div>
              <button onClick={() => setSite("Stomach – Upper Left")} className="text-blue-600 text-sm font-semibold">Use</button>
            </div>
            <div className="relative">
              <button onClick={() => { setShowSiteDropdown(!showSiteDropdown); setShowMedDropdown(false); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span className="text-base font-semibold">{site}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showSiteDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {injectionSites.map((s) => (
                    <button key={s} onClick={() => { setSite(s); setShowSiteDropdown(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${site === s ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Pain Level: <span className="text-blue-600">{pain}/10</span></label>
            <div className="px-1">
              <input type="range" min="0" max="10" value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 – No Pain</span>
                <span>10 – Severe</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Notes (Optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or side effects experienced"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:border-blue-300" />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save Shot
          </button>
        </div>
      </div>
    </div>
  );
}