import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingDown, Syringe, HelpCircle, Zap, Gauge, Camera, Image, Clock, Plus, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { DropletIcon, ScaleIcon, ChartIcon, SyringeIcon, CameraIcon } from "@/components/onboarding/LevliIcons";
import TopBar from "@/components/TopBar";
import ProgressPhotoCard from "@/components/insights/ProgressPhotoCard";
import AddMetricModal from "@/components/modals/AddMetricModal";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppState } from "@/lib/AppState";
import { parseShotDate, todayKey } from "@/lib/dateUtils";
import { isInvestigational, getHalfLifeDays, getDosingInterval } from "@/lib/medicationData";
import { steadyStateFraction, accumulationRatio, PK_CALCULATION_VERSION } from "@/lib/pkCalculations";
import { toast } from "sonner";

const CLASS_COLORS = { Semaglutide: "#6366F1", Tirzepatide: "#14B8A6", Liraglutide: "#F59E0B" };

function buildMedLevelData(shots, days) {
  if (!shots.length) return { data: [], classes: [], disabled: false, steadyState: null, accumRatio: null };
  const now = new Date(); now.setHours(0,0,0,0);
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const classesSet = new Set();
  shots.forEach((s) => { if (s.drug_class || s.drugClass) classesSet.add(s.drug_class || s.drugClass); });
  const classes = [...classesSet].filter((c) => !isInvestigational(c) && getHalfLifeDays(getBrandForGeneric(c, shots), getRouteForClass(c, shots)));
  if (!classes.length) return { data: [], classes: [], disabled: true, steadyState: null, accumRatio: null };
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
        const brand = s.medication;
        const r = s.route || getRouteForClass(cls, shots);
        const halfLife = getHalfLifeDays(brand, r);
        if (!halfLife) return;
        const daysSince = (t - sd) / 86400000;
        if (daysSince >= 0 && daysSince < halfLife * 7) {
          level += (s.dose || 0) * Math.pow(0.5, daysSince / halfLife);
        }
      });
      point[cls] = Math.round(level * 100) / 100;
    });
    points.push(point);
  }
  const primaryClass = classes[0];
  const primaryBrand = getBrandForGeneric(primaryClass, shots);
  const primaryRoute = getRouteForClass(primaryClass, shots);
  const primaryHL = getHalfLifeDays(primaryBrand, primaryRoute);
  const interval = getDosingInterval(primaryBrand) || (primaryClass === "Liraglutide" ? 1 : 7);
  const ssFraction = primaryHL ? steadyStateFraction(primaryHL, interval, shots.length) : null;
  const accum = primaryHL ? accumulationRatio(primaryHL, interval) : null;
  return { data: points, classes, disabled: false, steadyState: ssFraction, accumRatio: accum, primaryClass, primaryHL, interval };
}

function getBrandForGeneric(generic, shots) {
  const brands = {};
  shots.forEach((s) => { if ((s.drug_class || s.drugClass) === generic) brands[s.medication] = (brands[s.medication] || 0) + 1; });
  return Object.keys(brands).sort((a, b) => brands[b] - brands[a])[0] || generic;
}
function getRouteForClass(cls, shots) {
  const s = shots.find((x) => (x.drug_class || x.drugClass) === cls && x.route);
  return s?.route || "subcutaneous";
}

function buildWeightData(weightHistory, daysBack) {
  if (!weightHistory.length) return [];
  const now = new Date(); now.setHours(23,59,59,999);
  const cutoff = new Date(); cutoff.setHours(0,0,0,0); cutoff.setDate(cutoff.getDate() - daysBack);
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const raw = weightHistory
    .filter(({ date }) => { const [y,m,d] = date.split("-").map(Number); const local = new Date(y,m-1,d); return local >= cutoff && local <= now; })
    .map(({ date, weight }) => { const [y,m,d] = date.split("-").map(Number); const local = new Date(y,m-1,d); return { date: `${mNames[local.getMonth()]} ${local.getDate()}`, weight, _isoDate: date }; });
  const withAvg = raw.map((point, i) => { const window = raw.slice(Math.max(0, i-6), i+1); const avg = window.reduce((a,p)=>a+p.weight,0)/window.length; return { ...point, rollingAvg: Math.round(avg*10)/10 }; });
  return withAvg;
}

const WEIGHT_RANGES = { "30 Days": 30, "180 Days": 180, "1 Year": 365 };
const MED_RANGES = { "7 Days": 7, "30 Days": 30, "90 Days": 90 };

export default function Insights() {
  const { shots, weightHistory, profile, dayMetrics, progressPhotosList, addProgressPhotoRecord, updateProgressPhotoRecord, deleteProgressPhotoRecord } = useAppState();
  const [weightRange, setWeightRange] = useState("180 Days");
  const [medRange, setMedRange] = useState("30 Days");
  const [viewAllPhotos, setViewAllPhotos] = useState(false);
  const [photoModal, setPhotoModal] = useState(null);
  const weightUnit = profile?.weight_unit || "lb";

  const medLevel = useMemo(() => buildMedLevelData(shots, MED_RANGES[medRange]), [shots, medRange]);
  const weightData = useMemo(() => buildWeightData(weightHistory, WEIGHT_RANGES[weightRange]), [weightHistory, weightRange]);

  const formatPhotoDate = (isoDate) => { const [y,m,d] = isoDate.split("-").map(Number); const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return { month: `${months[m-1]} ${d}`, year: String(y) }; };
  const photosAsc = useMemo(() => [...progressPhotosList].sort((a,b) => a.day_key.localeCompare(b.day_key)), [progressPhotosList]);
  const latestPhoto = photosAsc.length ? photosAsc[photosAsc.length - 1] : null;
  const distinctDayKeys = useMemo(() => { const seen = []; photosAsc.forEach((p) => { if (!seen.includes(p.day_key)) seen.push(p.day_key); }); return seen; }, [photosAsc]);
  const journeyDays = distinctDayKeys.length >= 2 ? Math.round((new Date(distinctDayKeys[distinctDayKeys.length-1]) - new Date(distinctDayKeys[0])) / 86400000) : 0;
  const getWeightLabel = (dayKey) => { const w = dayMetrics[dayKey]?.weight; return w != null ? `${w.toFixed(1)} ${weightUnit}` : null; };
  const prevDayKey = distinctDayKeys.length >= 2 ? distinctDayKeys[distinctDayKeys.length - 2] : null;
  const prevDayPhoto = prevDayKey ? [...photosAsc].reverse().find((p) => p.day_key === prevDayKey) : null;
  const gapDays = prevDayKey && latestPhoto ? Math.round((new Date(latestPhoto.day_key) - new Date(prevDayKey)) / 86400000) : null;
  const openAddPhoto = () => setPhotoModal({ mode: "add", dayKey: todayKey() });
  const openEditPhoto = (photo) => setPhotoModal({ mode: "edit", id: photo.id, dayKey: photo.day_key, url: photo.url });
  const handleSavePhotoModal = async (url, newDayKey) => {
    const dayKey = newDayKey || photoModal.dayKey;
    if (photoModal.mode === "add") { await addProgressPhotoRecord(dayKey, url); toast.success("Progress photo added!"); }
    else { await updateProgressPhotoRecord(photoModal.id, dayKey, url); toast.success("Progress photo updated!"); }
  };
  const handleDeletePhotoModal = async () => { await deleteProgressPhotoRecord(photoModal.id, photoModal.dayKey); toast.success("Photo deleted!"); };

  const weightLoss = weightData.length >= 2 ? weightData[0].weight - weightData[weightData.length-1].weight : null;
  const actualWeeks = weightData.length >= 2 ? Math.max(1, (() => { const [y1,m1,d1] = weightData[0]._isoDate.split("-").map(Number); const [y2,m2,d2] = weightData[weightData.length-1]._isoDate.split("-").map(Number); return (new Date(y2,m2-1,d2) - new Date(y1,m1-1,d1)) / (7*86400000); })()) : 1;
  const ratePerWeek = weightLoss != null ? (weightLoss / actualWeeks) : null;
  const baselineWeight = weightData.length ? weightData[0].weight : null;
  const currentWeight = weightData.length ? weightData[weightData.length-1].weight : null;
  const pctWeightChange = (baselineWeight != null && currentWeight != null && baselineWeight > 0) ? Math.round(((baselineWeight - currentWeight) / baselineWeight) * 1000) / 10 : null;

  const latestWeight = weightHistory.length ? weightHistory[weightHistory.length-1].weight : null;
  const heightFt = parseFloat(profile?.height_ft) || 0;
  const heightIn = parseFloat(profile?.height_in) || 0;
  const heightUnit = profile?.height_unit || "in";
  let heightM = 0;
  if (heightUnit === "cm") heightM = heightFt / 100;
  else { const totalInches = heightFt * 12 + heightIn; heightM = totalInches * 0.0254; }
  const weightKg = latestWeight ? (weightUnit === "kg" ? latestWeight : latestWeight * 0.453592) : null;
  const bmi = weightKg && heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : null;
  const heightMissing = heightM === 0 && latestWeight != null;

  const summaryChips = [
    { label: "Weight Loss", value: weightLoss != null ? `${weightLoss >= 0 ? "-" : "+"}${Math.abs(weightLoss).toFixed(1)} ${weightUnit}` : "—", grad: "from-emerald-400 to-teal-500" },
    { label: "% Change", value: pctWeightChange != null ? `${pctWeightChange >= 0 ? "-" : "+"}${Math.abs(pctWeightChange)}%` : "—", grad: "from-indigo-400 to-blue-500" },
    { label: "Rate/Week", value: ratePerWeek != null ? `${ratePerWeek >= 0 ? "-" : "+"}${Math.abs(ratePerWeek).toFixed(1)} ${weightUnit}` : "—", grad: "from-violet-400 to-indigo-500" },
    { label: "BMI", value: bmi || (heightMissing ? "Add height" : "—"), grad: "from-orange-400 to-pink-500" },
  ];

  return (
    <div className="min-h-screen w-full">
      <TopBar title="Insights" />

      <div className="max-w-3xl mx-auto">
        {/* Weight Change Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <ScaleIcon size={36} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Weight Change</h3>
          </div>

          <div className="flex items-center gap-1.5 mb-4 flex-wrap mt-3">
            {Object.keys(WEIGHT_RANGES).map((r) => (
              <button key={r} onClick={() => setWeightRange(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${weightRange === r ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400"}`}>{r}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {summaryChips.map((chip) => (
              <div key={chip.label} className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-2.5 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mb-0.5">{chip.label}</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{chip.value}</p>
              </div>
            ))}
          </div>

          {bmi && <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">BMI is a screening measure, not a diagnostic tool. It does not account for body composition.</p>}

          {weightData.length >= 2 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.12)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={["auto", "auto"]} width={36} />
                  <Tooltip formatter={(v, name) => [`${v} ${weightUnit}`, name === "rollingAvg" ? "7-day avg" : "Weight"]} contentStyle={{ background: "rgba(31,31,40,0.95)", border: "none", borderRadius: 12, color: "#E8E9F0", fontSize: 12 }} />
                  <Line type="monotone" dataKey="weight" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: "#6366F1", r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="rollingAvg" stroke="#14B8A6" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-2xl gap-3">
              <div className="opacity-40"><ScaleIcon size={48} /></div>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center px-4">{weightHistory.length === 0 ? "Log your weight in the Home tab to see trends here." : "Log at least 2 weight entries in this time range to see a chart."}</p>
            </div>
          )}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">Solid line: daily entries · Dashed: 7-day rolling average</p>
        </div>

        {/* Progress Pictures Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <CameraIcon size={36} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Progress Pictures</h3>
          </div>

          {photosAsc.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 mt-3 mb-4">
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-2.5 text-center">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Total</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{photosAsc.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-2.5 text-center">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Journey Days</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{journeyDays}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-2.5 text-center">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Latest</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{latestPhoto ? formatPhotoDate(latestPhoto.day_key).month : "—"}</p>
              </div>
            </div>
          )}

          {photosAsc.length === 0 ? (
            <div className="space-y-3 mt-3">
              <div className="flex flex-col items-center gap-3 py-8 bg-gray-50 dark:bg-white/[0.03] rounded-2xl">
                <div className="opacity-40"><CameraIcon size={48} /></div>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">No progress pictures yet.</p>
                <button onClick={openAddPhoto} className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 text-sm">
                  <Plus size={16} /> Add Picture
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {viewAllPhotos ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {photosAsc.map((p) => (
                    <ProgressPhotoCard key={p.id} photo={p} dateLabel={formatPhotoDate(p.day_key)} weightLabel={getWeightLabel(p.day_key)} tag={p.id === latestPhoto.id ? "latest" : (p.day_key === latestPhoto.day_key ? "same-day" : null)} onClick={() => openEditPhoto(p)} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                  {prevDayPhoto && (
                    <>
                      <ProgressPhotoCard photo={prevDayPhoto} dateLabel={formatPhotoDate(prevDayPhoto.day_key)} weightLabel={getWeightLabel(prevDayPhoto.day_key)} tag={null} onClick={() => openEditPhoto(prevDayPhoto)} />
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <ArrowRight size={16} className="text-indigo-500" />
                        <span className="text-[10px] text-indigo-400 whitespace-nowrap">{gapDays}d</span>
                      </div>
                    </>
                  )}
                  <ProgressPhotoCard photo={latestPhoto} dateLabel={formatPhotoDate(latestPhoto.day_key)} weightLabel={getWeightLabel(latestPhoto.day_key)} tag="latest" onClick={() => openEditPhoto(latestPhoto)} />
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={openAddPhoto} className="flex-1 py-3 bg-indigo-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-sm">
                  <Plus size={16} /> Add Photo
                </button>
                {photosAsc.length >= 2 && (
                  <button onClick={() => setViewAllPhotos((v) => !v)} className="flex-1 py-3 bg-gray-100 dark:bg-white/[0.06] text-indigo-600 dark:text-indigo-300 rounded-full font-semibold flex items-center justify-center gap-2 text-sm">
                    {viewAllPhotos ? <><Minimize2 size={16} /> Collapse</> : <><Maximize2 size={16} /> View All</>}
                  </button>
                )}
              </div>
            </div>
          )}
          <AddMetricModal open={!!photoModal} onClose={() => setPhotoModal(null)} label="Progress" unit="pic" value={photoModal?.mode === "edit" ? photoModal.url : "–"} dayKey={photoModal?.dayKey} onSave={handleSavePhotoModal} onDelete={photoModal?.mode === "edit" ? handleDeletePhotoModal : undefined} />
        </div>

        {/* Medication Exposure Panel */}
        <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100/80 dark:border-white/[0.04]">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <SyringeIcon size={36} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Medication Exposure</h3>
                <p className="text-xs text-indigo-500 dark:text-indigo-400">Illustrative relative-exposure estimate.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3 mb-4 flex-wrap">
            {Object.keys(MED_RANGES).map((r) => (
              <button key={r} onClick={() => setMedRange(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${medRange === r ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400"}`}>{r}</button>
            ))}
          </div>

          {shots.length > 0 ? (
            medLevel.disabled ? (
              <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-2xl px-4">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Exposure estimation is not available for this medication.</p>
              </div>
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={medLevel.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.12)" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} interval={Math.floor(medLevel.data.length / 5)} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} width={36} />
                      <Tooltip formatter={(v, name) => [`${v} relative units`, name]} contentStyle={{ background: "rgba(31,31,40,0.95)", border: "none", borderRadius: 12, color: "#E8E9F0", fontSize: 12 }} />
                      {medLevel.classes.map((cls) => (
                        <Area key={cls} type="monotone" dataKey={cls} stroke={CLASS_COLORS[cls] || "#6366F1"} fill={CLASS_COLORS[cls] || "#6366F1"} fillOpacity={0.12} strokeWidth={2.5} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {medLevel.steadyState != null && (
                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-3 text-center">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Steady-state reached</p>
                      <p className="font-bold text-indigo-600 dark:text-indigo-300 text-sm">{Math.round(medLevel.steadyState * 100)}%</p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-500/10 rounded-2xl p-3 text-center">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Accumulation ratio</p>
                      <p className="font-bold text-teal-600 dark:text-teal-300 text-sm">{medLevel.accumRatio != null ? medLevel.accumRatio.toFixed(2) : "—"}</p>
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/[0.03] rounded-2xl gap-3">
              <div className="opacity-40"><DropletIcon size={48} /></div>
              <p className="text-sm text-gray-400 dark:text-gray-500">Log your first shot to see relative exposure here.</p>
            </div>
          )}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2 px-2">Illustrative estimate only — not a blood-level measurement. Do not use it to adjust your dose. Confirm any decisions with your prescriber.</p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 text-center mt-1">Calculation version: {PK_CALCULATION_VERSION}</p>
          {!medLevel.disabled && medLevel.classes.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
              {medLevel.classes.map((cls) => (
                <div key={cls} className="flex items-center gap-1.5">
                  <div className="w-4 h-1 rounded" style={{ background: CLASS_COLORS[cls] || "#6366F1" }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{cls}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}