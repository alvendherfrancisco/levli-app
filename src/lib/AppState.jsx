import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { toDayKey, todayKey } from "@/lib/dateUtils";
import { seedDemoDataIfNeeded } from "@/lib/seedDemoData";

const AppStateContext = createContext(null);

const DEFAULT_PROFILE = {
  height_ft: "5", height_in: "8", goal_weight: "160", days_between: "7",
  liquid_unit: "oz", height_unit: "in", weight_unit: "lb",
  default_medication: "Ozempic®", notifications_enabled: false, dark_mode: false,
};

export function AppStateProvider({ children }) {
  const [shots, setShots] = useState([]);
  const [shotsLoading, setShotsLoading] = useState(true);
  const [dayMetrics, setDayMetrics] = useState({}); // key: day_key → record
  const [journalEntries, setJournalEntries] = useState([]);
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [profileId, setProfileId] = useState(null);
  const [darkMode, setDarkModeState] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null); // null = loading

  // ── Dark mode ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ── Load all data on mount ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      await seedDemoDataIfNeeded();
      loadShots();
      loadJournal();
      loadProfile();
      loadDayMetrics();
    })();
  }, []);

  const loadShots = async () => {
    setShotsLoading(true);
    const data = await base44.entities.Shot.list("-date", 500);
    // sort by parsed date descending
    data.sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date);
      return db - da;
    });
    setShots(data);
    setShotsLoading(false);
  };

  const loadJournal = async () => {
    const data = await base44.entities.JournalEntry.list("-date", 200);
    setJournalEntries(data);
  };

  const loadProfile = async () => {
    const data = await base44.entities.UserProfile.list("", 1);
    if (data.length > 0) {
      const p = data[0];
      setProfileId(p.id);
      const merged = { ...DEFAULT_PROFILE, ...p };
      setProfileState(merged);
      setDarkModeState(!!p.dark_mode);
      setOnboardingCompleted(!!p.onboarding_completed);
    } else {
      setOnboardingCompleted(false);
    }
  };

  const loadDayMetrics = async () => {
    const data = await base44.entities.DayMetric.list("-day_key", 500);
    const map = {};
    data.forEach((d) => { map[d.day_key] = d; });
    setDayMetrics(map);
  };

  // ── Shots CRUD ─────────────────────────────────────────────────────────────
  const addShot = async (shot) => {
    const rec = await base44.entities.Shot.create({
      medication: shot.medication,
      dose: shot.dose,
      drug_class: shot.drugClass || "GLP-1",
      date: shot.date,
      time: shot.time,
      site: shot.site,
      pain: shot.pain,
      notes: shot.notes || "",
    });
    setShots((prev) => [rec, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    return rec;
  };

  const updateShot = async (id, updates) => {
    const rec = await base44.entities.Shot.update(id, updates);
    setShots((prev) => prev.map((s) => s.id === id ? { ...s, ...rec } : s));
  };

  const deleteShot = async (id) => {
    await base44.entities.Shot.delete(id);
    setShots((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Day Metrics ────────────────────────────────────────────────────────────
  const getDayMetric = (dayKey) => dayMetrics[dayKey] || null;

  const saveDayMetric = async (dayKey, updates) => {
    const existing = dayMetrics[dayKey];
    let rec;
    if (existing) {
      rec = await base44.entities.DayMetric.update(existing.id, updates);
    } else {
      rec = await base44.entities.DayMetric.create({ day_key: dayKey, ...updates });
    }
    setDayMetrics((prev) => ({ ...prev, [dayKey]: { ...(existing || {}), ...rec } }));
    return rec;
  };

  // Helpers used by Home/History
  const getNutrition = (dayKey) => {
    const m = dayMetrics[dayKey];
    if (!m) return { calories: "0.0", protein: "0.0", water: "0.0", fiber: "0.0", carbs: "0.0" };
    return {
      calories: m.calories != null ? String(m.calories) : "0.0",
      protein: m.protein != null ? String(m.protein) : "0.0",
      water: m.water != null ? String(m.water) : "0.0",
      fiber: m.fiber != null ? String(m.fiber) : "0.0",
      carbs: m.carbs != null ? String(m.carbs) : "0.0",
    };
  };

  const saveNutrition = (dayKey, values) => saveDayMetric(dayKey, {
    calories: parseFloat(values.calories) || 0,
    protein: parseFloat(values.protein) || 0,
    water: parseFloat(values.water) || 0,
    fiber: parseFloat(values.fiber) || 0,
    carbs: parseFloat(values.carbs) || 0,
  });

  const getSideEffects = (dayKey) => dayMetrics[dayKey]?.side_effects || "";
  const saveSideEffects = (dayKey, text) => saveDayMetric(dayKey, { side_effects: text });

  const getWeight = (dayKey) => dayMetrics[dayKey]?.weight || null;
  const saveWeight = (dayKey, val) => saveDayMetric(dayKey, { weight: parseFloat(val) || null });

  const getExercise = (dayKey) => dayMetrics[dayKey]?.exercise_min ?? null;
  const saveExercise = (dayKey, val) => saveDayMetric(dayKey, { exercise_min: parseFloat(val) || 0 });

  const getProgressPhoto = (dayKey) => dayMetrics[dayKey]?.progress_photo || null;
  const saveProgressPhoto = (dayKey, url) => saveDayMetric(dayKey, { progress_photo: url });

  // ── Journal CRUD ───────────────────────────────────────────────────────────
  const addJournalEntry = async (entry) => {
    const rec = await base44.entities.JournalEntry.create({
      text: entry.text,
      date: entry.date,
      time: entry.time,
      mood: entry.mood,
      mood_color: entry.moodColor || entry.mood_color || "",
      category: entry.category,
    });
    setJournalEntries((prev) => [rec, ...prev]);
    return rec;
  };

  const updateJournalEntry = async (id, updates) => {
    const rec = await base44.entities.JournalEntry.update(id, {
      text: updates.text,
      date: updates.date,
      time: updates.time,
      mood: updates.mood,
      mood_color: updates.moodColor || updates.mood_color || "",
      category: updates.category,
    });
    setJournalEntries((prev) => prev.map((e) => e.id === id ? { ...e, ...rec } : e));
  };

  const deleteJournalEntry = async (id) => {
    await base44.entities.JournalEntry.delete(id);
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Profile ────────────────────────────────────────────────────────────────
  const setProfile = async (updater) => {
    const next = typeof updater === "function" ? updater(profile) : { ...profile, ...updater };
    setProfileState(next);
    if (next.dark_mode !== undefined) setDarkModeState(!!next.dark_mode);
    if (next.onboarding_completed !== undefined) setOnboardingCompleted(!!next.onboarding_completed);
    const payload = {
      height_ft: next.height_ft, height_in: next.height_in,
      goal_weight: next.goal_weight, days_between: next.days_between,
      liquid_unit: next.liquid_unit, height_unit: next.height_unit,
      weight_unit: next.weight_unit, default_medication: next.default_medication,
      notifications_enabled: !!next.notifications_enabled,
      dark_mode: !!next.dark_mode,
      onboarding_completed: !!next.onboarding_completed,
    };
    if (profileId) {
      await base44.entities.UserProfile.update(profileId, payload);
    } else {
      const rec = await base44.entities.UserProfile.create(payload);
      setProfileId(rec.id);
    }
  };

  const setDarkMode = (val) => setProfile({ ...profile, dark_mode: val });

  // Clear all locally cached user data (used on logout)
  const resetState = () => {
    setShots([]);
    setDayMetrics({});
    setJournalEntries([]);
    setProfileState(DEFAULT_PROFILE);
    setProfileId(null);
    setDarkModeState(false);
    setOnboardingCompleted(null);
  };

  const completeOnboarding = async () => {
    setOnboardingCompleted(true);
    await setProfile({ ...profile, onboarding_completed: true });
  };

  // ── Computed helpers ───────────────────────────────────────────────────────
  /** Returns all weight entries sorted by date asc: [{date: "YYYY-MM-DD", weight}] */
  const weightHistory = Object.entries(dayMetrics)
    .filter(([, m]) => m.weight != null)
    .map(([key, m]) => ({ date: key, weight: m.weight }))
    .sort((a, b) => a.date.localeCompare(b.date));

  /** Injection site rotation recommendation */
  const getRecommendedSite = useCallback(() => {
    const sites = [
      "Stomach – Upper Left", "Stomach – Upper Right",
      "Stomach – Lower Left", "Stomach – Lower Right",
      "Thigh – Left", "Thigh – Right",
      "Upper Arm – Left", "Upper Arm – Right",
    ];
    if (shots.length === 0) return sites[0];
    const lastSite = shots[0].site;
    const lastIdx = sites.indexOf(lastSite);
    return sites[(lastIdx + 1) % sites.length];
  }, [shots]);

  return (
    <AppStateContext.Provider value={{
      // Shots
      shots, shotsLoading, addShot, updateShot, deleteShot, loadShots,
      // Day metrics
      dayMetrics, getDayMetric, saveDayMetric,
      getNutrition, saveNutrition,
      getSideEffects, saveSideEffects,
      getWeight, saveWeight,
      getExercise, saveExercise,
      getProgressPhoto, saveProgressPhoto,
      // Journal
      journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry,
      // Profile
      profile, setProfile,
      // Derived
      weightHistory,
      getRecommendedSite,
      // Dark mode
      darkMode, setDarkMode,
      // Onboarding
      onboardingCompleted, completeOnboarding,
      // Reset (logout)
      resetState,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}