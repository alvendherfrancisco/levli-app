import React, { useState } from "react";
import { X, Save, MapPin, Star, ChevronDown, HelpCircle } from "lucide-react";

const medications = ["Ozempic®", "Wegovy®", "Mounjaro®", "Zepbound®"];
const injectionSites = [
  "Stomach – Upper Left", "Stomach – Upper Right", "Stomach – Lower Left", "Stomach – Lower Right",
  "Thigh – Left", "Thigh – Right", "Upper Arm – Left", "Upper Arm – Right",
];

export default function AddShotModal({ open, onClose }) {
  const [pain, setPain] = useState(0);
  const [medication, setMedication] = useState("Ozempic®");
  const [site, setSite] = useState("Stomach – Upper Left");
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
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
              <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-base">Jun 29, 2026</span>
                <span className="text-gray-400">📅</span>
              </div>
              <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-base">10:06 PM</span>
                <span className="text-gray-400">🕐</span>
              </div>
            </div>
          </div>

          {/* Medication */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Medication</label>
            <div className="relative">
              <button
                onClick={() => setShowMedDropdown(!showMedDropdown)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left"
              >
                <span className="text-base">{medication}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showMedDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  {medications.map((m) => (
                    <button key={m} onClick={() => { setMedication(m); setShowMedDropdown(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm">
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dose */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Dose (mg)</label>
            <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center">
              <input type="number" defaultValue="2.50" className="flex-1 outline-none text-base" step="0.25" />
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
              <button className="text-blue-600 text-sm font-semibold">Use</button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span className="text-base font-semibold">{site}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showSiteDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {injectionSites.map((s) => (
                    <button key={s} onClick={() => { setSite(s); setShowSiteDropdown(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Pain Level</label>
            <div className="px-1">
              <input
                type="range"
                min="0"
                max="10"
                value={pain}
                onChange={(e) => setPain(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>10</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>No Pain</span>
                <span>Severe Pain</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Notes (Optional)</label>
            <textarea
              placeholder="Add any notes or side effects experienced"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:border-blue-300"
            />
          </div>
        </div>

        <div className="px-5 pb-8 pt-2">
          <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto max-w-[200px]">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}