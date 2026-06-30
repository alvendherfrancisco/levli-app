import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings, TrendingDown, Syringe, HelpCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, fromDayKey } from "@/lib/dateUtils";

// Half-lives in days per drug class
const HALF_LIFE = { Semaglutide: 7, Tirzepatide: 5, Liraglutide: 1, Retatrutide: 6, "GLP-1": 7 };

function buildMedLevelData(shots, days) {
  if (!shots.length) return [];
  const now = new Date(); now.setHours(0,0,0,0);
  const points = [];
  for (let i = days; i >= 0; i--) {
    const t = new Date(now); t.setDate(t.getDate() - i);
    let level = 0;
    shots.forEach((s) => {
      const sd = parseShotDate(s.date);
      if (!sd) return;
      const halfLife = HALF_LIFE[s.drug_class || s.drugClass] || 7;
      const daysSince = (t - sd) / 86400000;
      if (daysSince >= 0 && daysSince < halfLife * 7) {
        level += (s.dose || 0) * Math.pow(0.5, daysSince / halfLife);
      }
    });
    const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    points.push({ day: `${mNames[t.getMonth()]} ${t.getDate()}`, level: Math.round(level * 100) / 100 });
  }
  return points;
}

function buildWeightData(weightHistory, daysBack) {
  if (!weightHistory.length) return [];
  const now = new Date(); now.setHours(0,0,0,0);
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - daysBack);
  return weightHistory
    .filter(({ date }) => new Date(date) >= cutoff)
    .map(({ date, weight }) => {
      const d = new Date(date);
      const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return { date: `${mNames[d.getMonth()]} ${d.getDate()}`, weight };
    });
}

const WEIGHT_RANGES = { "30 Days": 30, "180 Days": 180, "1 Year": 365 };
const MED_RANGES = { "7 Days": 7, "30 Days": 30, "90 Days": 90 };

export default function Insights() {
  const { shots, weightHistory, profile } = useAppState();
  const [weightRange, setWeightRange] = useState("180 Days");
  const [medRange, setMedRange] = useState("30 Days");
  const weightUnit = profile?.weight_unit || "lb";

  const medData = useMemo(() => buildMedLevelData(shots, MED_RANGES[medRange]), [shots, medRange]);
  const weightData = useMemo(() => buildWeightData(weightHistory, WEIGHT_RANGES[weightRange]), [weightHistory, weightRange]);

  // Weight stats
  const weightLoss = weightData.length >= 2 ? weightData[0].weight - weightData[weightData.length - 1].weight : null;
  const weeksCovered = weightData.length >= 2
    ? Math.max(1, WEIGHT_RANGES[weightRange] / 7)
    : 1;
  const ratePerWeek = weightLoss != null ? (weightLoss / weeksCovered).toFixed(1) : null;

  // BMI: weight in lbs, height in ft/in
  const latestWeight = weightHistory.length ? weightHistory[weightHistory.length - 1].weight : null;
  const heightFt = parseFloat(profile?.height_ft || 5);
  const heightIn = parseFloat(profile?.height_in || 8);
  const totalInches = heightFt * 12 + heightIn;
  const bmi = latestWeight && totalInches > 0
    ? ((latestWeight / (totalInches * totalInches)) * 703).toFixed(1)
    : null;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Weight Change Panel */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900 text-lg">Weight Change</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-12 mb-3" />

          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {Object.keys(WEIGHT_RANGES).map((r) => (
              <button key={r} onClick={() => setWeightRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  weightRange === r ? "bg-gray-100 text-gray-900 border border-gray-200" : "text-gray-400"
                }`}>{r}</button>
            ))}
          </div>

          {/* Summary chips */}
          <div className="flex flex-row gap-2 mb-4">
            <div className="bg-green-50 rounded-xl p-2.5 text-center flex-1 min-w-0">
              <TrendingDown size={14} className="text-green-500 mx-auto mb-1" />
              <p className="text-gray-500 text-[11px]">Weight Loss</p>
              <p className="font-bold text-green-600 text-sm">
                {weightLoss != null ? `${weightLoss >= 0 ? "-" : "+"}${Math.abs(weightLoss).toFixed(1)} ${weightUnit}` : "—"}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2.5 text-center flex-1 min-w-0">
              <span className="text-blue-500 text-sm">⚡</span>
              <p className="text-gray-500 text-[11px]">Rate/Week</p>
              <p className="font-bold text-blue-600 text-sm">
                {ratePerWeek != null ? `${parseFloat(ratePerWeek) >= 0 ? "-" : "+"}${Math.abs(parseFloat(ratePerWeek)).toFixed(1)} ${weightUnit}` : "—"}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-2.5 text-center flex-1 min-w-0">
              <span className="text-orange-500 text-sm">📊</span>
              <p className="text-gray-500 text-[11px]">Current BMI</p>
              <p className="font-bold text-orange-600 text-sm">{bmi || "—"}</p>
            </div>
          </div>

          {weightData.length >= 2 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" domain={["auto", "auto"]} />
                  <Tooltip formatter={(v) => [`${v} ${weightUnit}`, "Weight"]} />
                  <Line type="monotone" dataKey="weight" stroke="hsl(var(--accent-foreground))" strokeWidth={2} dot={{ fill: "hsl(var(--accent-foreground))", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Log your weight in the Home tab to see trends here.</p>
            </div>
          )}
        </div>

        {/* Medication Levels Panel */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Syringe size={18} className="text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Medication Levels</h3>
                <p className="text-xs text-blue-500">Estimated concentration using pharmacokinetic decay model.</p>
              </div>
            </div>
            <HelpCircle size={18} className="text-blue-400" />
          </div>
          <div className="border-b-2 border-blue-500 w-12 mb-3" />

          <div className="flex items-center gap-2 mb-4">
            {Object.keys(MED_RANGES).map((r) => (
              <button key={r} onClick={() => setMedRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  medRange === r ? "bg-gray-100 text-gray-900 border border-gray-200" : "text-gray-400"
                }`}>{r}</button>
            ))}
          </div>

          {shots.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" interval={Math.floor(medData.length / 5)} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                  <Tooltip formatter={(v) => [`${v} mg`, "Concentration"]} />
                  <Area type="monotone" dataKey="level" stroke="hsl(var(--accent-foreground))" fill="hsl(var(--accent-foreground))" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Log your first shot to see medication levels here.</p>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mt-2">Time vs Concentration (mg)</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-4 h-0.5 bg-blue-600 rounded" />
            <span className="text-xs text-gray-500">{shots[0]?.drug_class || "GLP-1"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}