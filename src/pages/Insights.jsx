import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings, TrendingDown, Syringe, HelpCircle, Zap, Gauge, Camera, Image, Clock, Plus, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import ProgressPhotoCard from "@/components/insights/ProgressPhotoCard";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, todayKey } from "@/lib/dateUtils";
import { HALF_LIFE_DAYS, isInvestigational } from "@/lib/medicationData";
import { toast } from "sonner";

const CLASS_COLORS = { Semaglutide: "#14B8A6", Tirzepatide: "#6366F1", Liraglutide: "#F59E0B" };

// Builds one curve per drug class (never summed across classes). Investigational
// classes are excluded so no curve is shown for unapproved products.
function buildMedLevelData(shots, days) {
  if (!shots.length) return { data: [], classes: [], disabled: false };
  const now = new Date(); now.setHours(0,0,0,0);
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const classesSet = new Set();
  shots.forEach((s) => { if (s.drug_class || s.drugClass) classesSet.add(s.drug_class || s.drugClass); });
  const classes = [...classesSet].filter((c) => !isInvestigational(c) && HALF_LIFE_DAYS[c]);
  if (!classes.length) return { data: [], classes: [], disabled: true };
  const points = [];
  for (let i = days; i >= 0; i--) {
    const t = new Date(now); t.setDate(t.getDate() - i);
    const point = { day: `${mNames[t.getMonth()]} ${t.getDate()}` };
    classes.forEach((cls) => {
      let level = 0;
      shots.forEach((s) => {
        if ((s.drug_class || s.drugClass) !== cls) return;
        const sd = parseShotDate(s.date);
        if (!sd) return;
        const halfLife = HALF_LIFE_DAYS[cls];
        const daysSince = (t - sd) / 86400000;
        if (daysSince >= 0 && daysSince < halfLife * 7) {
          level += (s.dose || 0) * Math.pow(0.5, daysSince / halfLife);
        }
      });
      point[cls] = Math.round(level * 100) / 100;
    });
    points.push(point);
  }
  return { data: points, classes, disabled: false };
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
  const { shots, weightHistory, profile, dayMetrics, progressPhotosList, addProgressPhotoRecord, updateProgressPhotoRecord, deleteProgressPhotoRecord } = useAppState();
  const [weightRange, setWeightRange] = useState("180 Days");
  const [medRange, setMedRange] = useState("30 Days");
  const [viewAllPhotos, setViewAllPhotos] = useState(false);
  const [photoModal, setPhotoModal] = useState(null); // { mode: "add", dayKey } | { mode: "edit", id, dayKey, url }
  const weightUnit = profile?.weight_unit || "lb";

  const medLevel = useMemo(() => buildMedLevelData(shots, MED_RANGES[medRange]), [shots, medRange]);
  const weightData = useMemo(() => buildWeightData(weightHistory, WEIGHT_RANGES[weightRange]), [weightHistory, weightRange]);

  const formatPhotoDate = (isoDate) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return { month: `${months[m-1]} ${d}`, year: String(y) };
  };

  // All photos sorted oldest → newest by the date they represent (day_key), not creation time
  const photosAsc = useMemo(() =>
    [...progressPhotosList].sort((a, b) => a.day_key.localeCompare(b.day_key)),
    [progressPhotosList]
  );
  const latestPhoto = photosAsc.length ? photosAsc[photosAsc.length - 1] : null;

  // Distinct days that have photos, oldest → newest
  const distinctDayKeys = useMemo(() => {
    const seen = [];
    photosAsc.forEach((p) => { if (!seen.includes(p.day_key)) seen.push(p.day_key); });
    return seen;
  }, [photosAsc]);

  const journeyDays = distinctDayKeys.length >= 2
    ? Math.round((new Date(distinctDayKeys[distinctDayKeys.length - 1]) - new Date(distinctDayKeys[0])) / 86400000)
    : 0;

  const latestPhotoDate = latestPhoto ? formatPhotoDate(latestPhoto.day_key) : null;
  const getWeightLabel = (dayKey) => {
    const w = dayMetrics[dayKey]?.weight;
    return w != null ? `${w.toFixed(1)} ${weightUnit}` : null;
  };

  // Collapsed view: latest photo of the previous distinct day + latest photo overall
  const prevDayKey = distinctDayKeys.length >= 2 ? distinctDayKeys[distinctDayKeys.length - 2] : null;
  const prevDayPhoto = prevDayKey ? [...photosAsc].reverse().find((p) => p.day_key === prevDayKey) : null;
  const gapDays = prevDayKey && latestPhoto
    ? Math.round((new Date(latestPhoto.day_key) - new Date(prevDayKey)) / 86400000)
    : null;

  const openAddPhoto = () => setPhotoModal({ mode: "add", dayKey: todayKey() });
  const openEditPhoto = (photo) => setPhotoModal({ mode: "edit", id: photo.id, dayKey: photo.day_key, url: photo.url });

  const handleSavePhotoModal = async (url, newDayKey) => {
    const dayKey = newDayKey || photoModal.dayKey;
    if (photoModal.mode === "add") {
      await addProgressPhotoRecord(dayKey, url);
      toast.success("Progress photo added successfully!");
    } else {
      await updateProgressPhotoRecord(photoModal.id, dayKey, url);
      toast.success("Progress photo updated successfully!");
    }
  };
  const handleDeletePhotoModal = async () => {
    await deleteProgressPhotoRecord(photoModal.id, photoModal.dayKey);
    toast.success("Progress photo deleted successfully!");
  };

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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Weight Change Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={18} className="text-teal-600" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Weight Change</h3>
          </div>
          <div className="border-b-2 border-teal-500 w-12 mb-3" />

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
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-2.5 text-center flex-1 min-w-0 border border-transparent dark:border-indigo-500/15">
              <Zap size={14} className="text-indigo-500 dark:text-indigo-400 mx-auto mb-1" style={{filter:"drop-shadow(0 0 6px rgba(99,102,241,0.4))"}} />
              <p className="text-gray-500 dark:text-[#9A9DAE] text-[11px]">Rate/Week</p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
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
                  <Line type="monotone" dataKey="weight" stroke="#14B8A6" strokeWidth={2} dot={{ fill: "#14B8A6", r: 3 }} activeDot={{ r: 5 }} />
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
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(20,184,166,0.13)" }}>
              <Camera size={16} className="text-teal-500" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Progress Pictures</h3>
          </div>
          <div className="border-b-2 border-teal-500 w-12 mb-3" />

          {photosAsc.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.15)" }}>
                <Image size={14} className="text-teal-400 mx-auto mb-1" />
                <p className="text-[11px] text-gray-500 dark:text-[#9A9DAE]">Total Photos</p>
                <p className="font-bold text-teal-500 dark:text-teal-400 text-sm">{photosAsc.length}</p>
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
          )}

          {photosAsc.length === 0 ? (
            <div className="space-y-4">
              <button onClick={openAddPhoto}
                className="w-full flex items-center gap-3 rounded-xl p-4 text-left" style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)" }}>
                <Camera size={22} className="text-teal-500 flex-shrink-0" />
                <p className="text-teal-500 font-medium text-sm">No progress pictures yet. Tap to add your first photo!</p>
              </button>
              <button
                onClick={openAddPhoto}
                className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors text-sm">
                <Plus size={18} /> Add Picture
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {viewAllPhotos ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {photosAsc.map((p) => (
                    <ProgressPhotoCard
                      key={p.id}
                      photo={p}
                      dateLabel={formatPhotoDate(p.day_key)}
                      weightLabel={getWeightLabel(p.day_key)}
                      tag={p.id === latestPhoto.id ? "latest" : (p.day_key === latestPhoto.day_key ? "same-day" : null)}
                      onClick={() => openEditPhoto(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {prevDayPhoto && (
                    <>
                      <ProgressPhotoCard
                        photo={prevDayPhoto}
                        dateLabel={formatPhotoDate(prevDayPhoto.day_key)}
                        weightLabel={getWeightLabel(prevDayPhoto.day_key)}
                        tag={null}
                        onClick={() => openEditPhoto(prevDayPhoto)}
                      />
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <ArrowRight size={18} className="text-teal-500" />
                        <span className="text-xs text-teal-400 whitespace-nowrap">{gapDays} days</span>
                      </div>
                    </>
                  )}
                  <ProgressPhotoCard
                    photo={latestPhoto}
                    dateLabel={formatPhotoDate(latestPhoto.day_key)}
                    weightLabel={getWeightLabel(latestPhoto.day_key)}
                    tag="latest"
                    onClick={() => openEditPhoto(latestPhoto)}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={openAddPhoto}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors text-sm">
                  <Plus size={16} /> Add Photo
                </button>
                {photosAsc.length >= 2 && (
                  <button
                    onClick={() => setViewAllPhotos((v) => !v)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-white/[0.07] text-teal-600 dark:text-teal-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-colors text-sm">
                    {viewAllPhotos ? <><Minimize2 size={16} /> Collapse</> : <><Maximize2 size={16} /> View All</>}
                  </button>
                )}
              </div>
            </div>
          )}

        <AddMetricModal
          open={!!photoModal}
          onClose={() => setPhotoModal(null)}
          label="Progress"
          unit="pic"
          value={photoModal?.mode === "edit" ? photoModal.url : "–"}
          dayKey={photoModal?.dayKey}
          onSave={handleSavePhotoModal}
          onDelete={photoModal?.mode === "edit" ? handleDeletePhotoModal : undefined}
        />
        </div>

        {/* Medication Levels Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Syringe size={18} className="text-indigo-600" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Medication Levels</h3>
                <p className="text-xs text-indigo-500">Illustrative relative-exposure estimate (not a blood-level measurement).</p>
              </div>
            </div>
            <HelpCircle size={18} className="text-indigo-400" />
          </div>
          <div className="border-b-2 border-indigo-500 w-12 mb-3" />

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
            medLevel.disabled ? (
              <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-xl px-4">
                <p className="text-sm text-gray-400 dark:text-[#9A9DAE] text-center">Exposure estimation is not available for this medication. This appears for investigational or unsupported products.</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={medLevel.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" interval={Math.floor(medLevel.data.length / 5)} />
                    <YAxis tick={{ fontSize: 10 }} stroke="#999" width={36} />
                    <Tooltip
                      formatter={(v, name) => [`${v} relative units`, name]}
                      contentStyle={{ background: "rgba(20,22,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E9F0" }}
                    />
                    {medLevel.classes.map((cls) => (
                      <Area key={cls} type="monotone" dataKey={cls} stroke={CLASS_COLORS[cls] || "#6366F1"} fill={CLASS_COLORS[cls] || "#6366F1"} fillOpacity={0.08} strokeWidth={2} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-xl">
              <p className="text-sm text-gray-400 dark:text-[#9A9DAE]">Log your first shot to see relative exposure here.</p>
            </div>
          )}
          <p className="text-xs text-gray-400 dark:text-[#9A9DAE] text-center mt-2">Time vs modelled relative exposure (illustrative)</p>
          <p className="text-[11px] text-gray-400 dark:text-[#9A9DAE] text-center mt-1 px-2">Illustrative estimate only — not a blood-level measurement. Do not use it to adjust your dose. Confirm any decisions with your prescriber.</p>
          {!medLevel.disabled && medLevel.classes.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
              {medLevel.classes.map((cls) => (
                <div key={cls} className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 rounded" style={{ background: CLASS_COLORS[cls] || "#6366F1" }} />
                  <span className="text-xs text-gray-500 dark:text-[#9A9DAE]">{cls}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}