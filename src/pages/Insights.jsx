import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings, TrendingDown, Syringe, HelpCircle, Zap, Gauge, Camera, Image, Clock } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppState } from "@/lib/AppState";
import { parseShotDate } from "@/lib/dateUtils";

// Half-lives in days per drug class
const HALF_LIFE = { Semaglutide: 7, Tirzepatide: 5, Liraglutide: 1, Retatrutide: 6, "GLP-1": 7 };

function buildMedLevelData(shots, days) {
  if (!shots.length) return [];
  const now = new Date(); now.setHours(0,0,0,0);
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
    points.push({ day: `${mNames[t.getMonth()]} ${t.getDate()}`, level: Math.round(level * 100) / 100 });
  }
  return points;
}

/**
 * Returns weight entries in the selected range, oldest → newest.
 * weightHistory is already sorted asc (YYYY-MM-DD strings from dayMetrics keys).
 * Each entry: { date: "Jan 29", weight: number, _isoDate: "YYYY-MM-DD" }
 */
function buildWeightData(weightHistory, daysBack) {
  if (!weightHistory.length) return [];
  const now = new Date(); now.setHours(23,59,59,999); // inclusive of today
  const cutoff = new Date(); cutoff.setHours(0,0,0,0); cutoff.setDate(cutoff.getDate() - daysBack);
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return weightHistory
    .filter(({ date }) => {
      // date is YYYY-MM-DD day_key — parse as local midnight to avoid UTC shift
      const [y, m, d] = date.split("-").map(Number);
      const local = new Date(y, m - 1, d);
      return local >= cutoff && local <= now;
    })
    .map(({ date, weight }) => {
      const [y, m, d] = date.split("-").map(Number);
      const local = new Date(y, m - 1, d);
      return { date: `${mNames[local.getMonth()]} ${local.getDate()}`, weight, _isoDate: date };
    });
}

const WEIGHT_RANGES = { "30 Days": 30, "180 Days": 180, "1 Year": 365 };
const MED_RANGES = { "7 Days": 7, "30 Days": 30, "90 Days": 90 };

export default function Insights() {
  const { shots, weightHistory, profile, dayMetrics } = useAppState();
  const [weightRange, setWeightRange] = useState("180 Days");
  const [medRange, setMedRange] = useState("30 Days");
  const weightUnit = profile?.weight_unit || "lb";

  const medData = useMemo(() => buildMedLevelData(shots, MED_RANGES[medRange]), [shots, medRange]);
  const weightData = useMemo(() => buildWeightData(weightHistory, WEIGHT_RANGES[weightRange]), [weightHistory, weightRange]);

  // Progress pictures: all days with a photo, sorted newest first
  const progressPhotos = useMemo(() =>
    Object.entries(dayMetrics)
      .filter(([, m]) => m.progress_photo)
      .map(([key, m]) => ({ isoDate: key, url: m.progress_photo }))
      .sort((a, b) => b.isoDate.localeCompare(a.isoDate)),
    [dayMetrics]
  );

  const formatPhotoDate = (isoDate) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return { month: `${months[m-1]} ${d}`, year: String(y) };
  };

  // Journey days = days between first and latest photo
  const journeyDays = progressPhotos.length >= 2
    ? Math.round((new Date(progressPhotos[0].isoDate) - new Date(progressPhotos[progressPhotos.length-1].isoDate)) / 86400000)
    : 0;

  const latestPhotoDate = progressPhotos.length ? formatPhotoDate(progressPhotos[0].isoDate) : null;

  // ── Weight stats ────────────────────────────────────────────────────────────
  // weightData is oldest→newest; loss = first weight minus last weight
  const weightLoss = weightData.length >= 2
    ? weightData[0].weight - weightData[weightData.length - 1].weight
    : null;

  // Use actual elapsed time between first and last entry for rate
  const actualWeeks = weightData.length >= 2
    ? Math.max(1, (() => {
        const [y1,m1,d1] = weightData[0]._isoDate.split("-").map(Number);
        const [y2,m2,d2] = weightData[weightData.length-1]._isoDate.split("-").map(Number);
        const msElapsed = new Date(y2,m2-1,d2) - new Date(y1,m1-1,d1);
        return msElapsed / (7 * 86400000);
      })())
    : 1;
  const ratePerWeek = weightLoss != null ? (weightLoss / actualWeeks) : null;

  // ── BMI ─────────────────────────────────────────────────────────────────────
  // Most recent weight entry across all history (not just current range)
  const latestWeight = weightHistory.length ? weightHistory[weightHistory.length - 1].weight : null;
  const heightFt = parseFloat(profile?.height_ft) || 0;
  const heightIn = parseFloat(profile?.height_in) || 0;
  const heightUnit = profile?.height_unit || "in";

  // Convert height to meters
  let heightM = 0;
  if (heightUnit === "cm") {
    // When unit is cm, height_ft holds the cm value
    heightM = heightFt / 100;
  } else {
    const totalInches = heightFt * 12 + heightIn;
    heightM = totalInches * 0.0254;
  }

  // Convert weight to kg
  const weightKg = latestWeight
    ? (weightUnit === "kg" ? latestWeight : latestWeight * 0.453592)
    : null;

  const bmi = weightKg && heightM > 0
    ? (weightKg / (heightM * heightM)).toFixed(1)
    : null;

  const heightMissing = heightM === 0 && latestWeight != null;

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-background w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Weight Change Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07] overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Weight Change</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-12 mb-3" />

          {/* Range tabs */}
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {Object.keys(WEIGHT_RANGES).map((r) => (
              <button key={r} onClick={() => setWeightRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  weightRange === r
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                    : "text-gray-400 dark:text-gray-500"
                }`}>{r}</button>
            ))}
          </div>

          {/* Summary chips */}
          <div className="flex flex-row gap-2 mb-4">
            <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-2.5 text-center flex-1 min-w-0 border border-transparent dark:border-green-500/15">
              <TrendingDown size={14} className="text-green-500 dark:text-green-400 mx-auto mb-1" style={{filter:"drop-shadow(0 0 6px rgba(34,197,94,0.4))"}} />
              <p className="text-gray-500 dark:text-[#9A9DAE] text-[11px]">Weight Loss</p>
              <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                {weightLoss != null
                  ? `${weightLoss >= 0 ? "-" : "+"}${Math.abs(weightLoss).toFixed(1)} ${weightUnit}`
                  : "—"}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-2.5 text-center flex-1 min-w-0 border border-transparent dark:border-blue-500/15">
              <Zap size={14} className="text-blue-500 dark:text-blue-400 mx-auto mb-1" style={{filter:"drop-shadow(0 0 6px rgba(59,130,246,0.4))"}} />
              <p className="text-gray-500 dark:text-[#9A9DAE] text-[11px]">Rate/Week</p>
              <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                {ratePerWeek != null
                  ? `${ratePerWeek >= 0 ? "-" : "+"}${Math.abs(ratePerWeek).toFixed(1)} ${weightUnit}`
                  : "—"}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-2.5 text-center flex-1 min-w-0 border border-transparent dark:border-orange-500/15">
              <Gauge size={14} className="text-orange-500 dark:text-orange-400 mx-auto mb-1" style={{filter:"drop-shadow(0 0 6px rgba(249,115,22,0.4))"}} />
              <p className="text-gray-500 dark:text-[#9A9DAE] text-[11px]">Current BMI</p>
              <p className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                {bmi || (heightMissing ? <span className="text-[10px] font-medium">Add height in Profile</span> : "—")}
              </p>
            </div>
          </div>

          {weightData.length >= 2 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#999" domain={["auto", "auto"]} width={36} />
                  <Tooltip
                    formatter={(v) => [`${v} ${weightUnit}`, "Weight"]}
                    contentStyle={{ background: "rgba(20,22,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E9F0" }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3B6FE0" strokeWidth={2} dot={{ fill: "#3B6FE0", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-xl gap-2">
              <p className="text-sm text-gray-400 dark:text-[#9A9DAE] text-center px-4">
                {weightHistory.length === 0
                  ? "Log your weight in the Home tab to see trends here."
                  : "Log at least 2 weight entries in this time range to see a chart."}
              </p>
            </div>
          )}
        </div>

        {/* Progress Pictures Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.13)" }}>
              <Camera size={16} className="text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Progress Pictures</h3>
          </div>
          <div className="border-b-2 border-blue-500 w-12 mb-3" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <Image size={14} className="text-blue-400 mx-auto mb-1" />
              <p className="text-[11px] text-gray-500 dark:text-[#9A9DAE]">Total Photos</p>
              <p className="font-bold text-blue-500 dark:text-blue-400 text-sm">{progressPhotos.length}</p>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <Clock size={14} className="text-green-400 mx-auto mb-1" />
              <p className="text-[11px] text-gray-500 dark:text-[#9A9DAE]">Journey Days</p>
              <p className="font-bold text-green-500 dark:text-green-400 text-sm">{journeyDays}</p>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <Camera size={14} className="text-amber-400 mx-auto mb-1" />
              <p className="text-[11px] text-gray-500 dark:text-[#9A9DAE]">Latest</p>
              <p className="font-bold text-amber-500 dark:text-amber-400 text-sm">{latestPhotoDate ? latestPhotoDate.month : "—"}</p>
            </div>
          </div>

          {progressPhotos.length === 0 ? (
            <div className="h-36 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-xl gap-2">
              <Camera size={28} className="text-gray-300 dark:text-white/20" />
              <p className="text-sm text-gray-400 dark:text-[#9A9DAE] text-center px-4">Add progress photos on the Home tab to track your visual journey.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {progressPhotos.map((p) => {
                const fd = formatPhotoDate(p.isoDate);
                const isLatest = p.isoDate === progressPhotos[0].isoDate;
                return (
                  <div key={p.isoDate} className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-white/[0.08]">
                    <img src={p.url} alt={`Progress ${p.isoDate}`} className="w-full object-cover" style={{ minHeight: 140, maxHeight: 200 }} />
                    {isLatest && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Latest</span>
                    )}
                    <div className="text-center py-1.5">
                      <p className="text-xs font-semibold text-gray-700 dark:text-[#E8E9F0]">{fd.month}</p>
                      <p className="text-[10px] text-gray-400 dark:text-[#9A9DAE]">{fd.year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Medication Levels Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Syringe size={18} className="text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Medication Levels</h3>
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
                  medRange === r
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                    : "text-gray-400 dark:text-gray-500"
                }`}>{r}</button>
            ))}
          </div>

          {shots.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" interval={Math.floor(medData.length / 5)} />
                  <YAxis tick={{ fontSize: 10 }} stroke="#999" width={36} />
                  <Tooltip
                    formatter={(v) => [`${v} mg`, "Concentration"]}
                    contentStyle={{ background: "rgba(20,22,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E9F0" }}
                  />
                  <Area type="monotone" dataKey="level" stroke="#3B6FE0" fill="#3B6FE0" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-xl">
              <p className="text-sm text-gray-400 dark:text-[#9A9DAE]">Log your first shot to see medication levels here.</p>
            </div>
          )}
          <p className="text-xs text-gray-400 dark:text-[#9A9DAE] text-center mt-2">Time vs Concentration (mg)</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-4 h-0.5 bg-blue-600 rounded" />
            <span className="text-xs text-gray-500 dark:text-[#9A9DAE]">{shots[0]?.drug_class || "GLP-1"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}