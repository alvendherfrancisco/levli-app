import React, { createContext, useContext, useState } from "react";

const SAMPLE_SHOTS = [
  { id: 1, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 30, 2025", time: "6:00 AM", site: "Stomach – Upper Right", pain: 0, notes: "" },
  { id: 2, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 22, 2025", time: "12:12 PM", site: "Stomach – Upper Right", pain: 2, notes: "" },
  { id: 3, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 15, 2025", time: "7:00 AM", site: "Stomach – Lower Left", pain: 5, notes: "" },
  { id: 4, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 08, 2025", time: "6:00 AM", site: "Stomach – Upper Right", pain: 1, notes: "" },
  { id: 5, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "May 01, 2025", time: "5:25 PM", site: "Stomach – Upper Right", pain: 1, notes: "" },
  { id: 6, medication: "Ozempic®", dose: 2.5, drugClass: "Semaglutide", date: "Apr 24, 2025", time: "8:00 AM", site: "Stomach – Upper Left", pain: 0, notes: "" },
];

const SAMPLE_JOURNAL = [
  { id: 1, text: "Just completed my 4th week on Ozempic and I'm down 8 lbs! The appetite suppression is amazing...", date: "Jun 5, 2025", time: "7:00 AM", mood: "Feeling Excellent", moodColor: "bg-green-100 text-green-700", category: "Mood" },
  { id: 2, text: "Can't believe it's been a month since I started my GLP-1 journey! Down 12 pounds...", date: "Jun 3, 2025", time: "6:00 PM", mood: "Feeling Good", moodColor: "bg-green-100 text-green-600", category: "General Note" },
  { id: 3, text: "Had some rough nausea today after my Wegovy shot. Discovered that eating small...", date: "Jun 1, 2025", time: "5:18 PM", mood: "Feeling Neutral", moodColor: "bg-yellow-100 text-yellow-700", category: "Side Effect" },
  { id: 4, text: "Doctor appointment tomorrow! Excited to share my progress. Weight is down 15...", date: "May 27, 2025", time: "1:44 PM", mood: "Feeling Excellent", moodColor: "bg-green-100 text-green-700", category: "Energy" },
  { id: 5, text: "Had a challenging day with cravings. Went to a birthday party and really wanted...", date: "May 20, 2025", time: "3:54 PM", mood: "Feeling Good", moodColor: "bg-green-100 text-green-600", category: "General Note" },
];

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [shots, setShots] = useState(SAMPLE_SHOTS);
  const [nutrition, setNutrition] = useState({ calories: "0.0", protein: "0.0", water: "0.0", fiber: "0.0", carbs: "0.0" });
  const [sideEffects, setSideEffects] = useState("");
  const [journalEntries, setJournalEntries] = useState(SAMPLE_JOURNAL);
  const [profile, setProfile] = useState({ heightFt: "5", heightIn: "8", goalWeight: "160", daysBetween: "7", liquidUnit: "oz", heightUnit: "in", weightUnit: "lb" });

  const addShot = (shot) => {
    const newShot = { ...shot, id: Date.now() };
    setShots((prev) => [newShot, ...prev]);
  };

  const getNextShotDate = () => {
    if (shots.length === 0) return null;
    // Most recent shot is first
    return shots[0];
  };

  const addJournalEntry = (entry) => {
    setJournalEntries((prev) => [{ ...entry, id: Date.now() }, ...prev]);
  };

  const updateJournalEntry = (id, updates) => {
    setJournalEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  return (
    <AppStateContext.Provider value={{
      shots, addShot, getNextShotDate,
      nutrition, setNutrition,
      sideEffects, setSideEffects,
      journalEntries, addJournalEntry, updateJournalEntry,
      profile, setProfile,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}