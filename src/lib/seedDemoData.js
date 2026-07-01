import { base44 } from "@/api/base44Client";

// One-time demo data seeding for the demo account. Runs client-side so records
// are created under the currently signed-in user's own session (correct ownership).
const DEMO_EMAIL = "noga.byal@gmail.com";

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;
};
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const SITES = [
  "Stomach – Upper Left", "Stomach – Upper Right", "Stomach – Lower Left", "Stomach – Lower Right",
  "Thigh – Left", "Thigh – Right", "Upper Arm – Left", "Upper Arm – Right",
];
const MOODS = [
  { mood: "Great", mood_color: "bg-green-100 text-green-600" },
  { mood: "Good", mood_color: "bg-blue-100 text-blue-600" },
  { mood: "Okay", mood_color: "bg-yellow-100 text-yellow-600" },
  { mood: "Tired", mood_color: "bg-purple-100 text-purple-600" },
];
const CATEGORIES = ["Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];
const JOURNAL_TEXTS = [
  "Feeling less hungry today, appetite is really down.",
  "Mild nausea in the morning but it passed by noon.",
  "Had a great workout, energy levels are up!",
  "Down another pound, staying consistent with the plan.",
  "Injection site was a bit sore this time.",
  "Tried a new healthy recipe, felt great after.",
  "Energy dipped in the afternoon, took a short walk.",
  "Clothes are fitting looser, feeling motivated.",
  "Slight headache today, drank more water and felt better.",
  "Celebrated hitting a new milestone on the scale!",
  "Good sleep last night, woke up refreshed.",
  "Cravings were tough today but stayed on track.",
];

// 26 weekly doses, escalating: 0.5mg x6 → 1mg x7 → 1.7mg x7 → 2.5mg x6
const DOSE_STAGES = [
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  1, 1, 1, 1, 1, 1, 1,
  1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7,
  2.5, 2.5, 2.5, 2.5, 2.5, 2.5,
];

function randRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

export async function seedDemoDataIfNeeded() {
  let user;
  try {
    user = await base44.auth.me();
  } catch {
    return;
  }
  if (!user || user.email !== DEMO_EMAIL) return;

  const [existingShots, existingDayMetrics, existingJournal] = await Promise.all([
    base44.entities.Shot.list("-date", 1),
    base44.entities.DayMetric.list("-day_key", 1),
    base44.entities.JournalEntry.list("-date", 1),
  ]);

  const today = new Date();

  // ── Shots: 26 weekly shots with escalating doses ────────────────────────────
  if (existingShots.length === 0) {
    const shots = [];
    for (let i = 25; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 7);
      shots.push({
        medication: "Ozempic®",
        dose: DOSE_STAGES[25 - i],
        drug_class: "Semaglutide",
        date: fmtDate(d),
        time: "8:00 AM",
        site: SITES[(25 - i) % SITES.length],
        pain: Math.floor(Math.random() * 4),
        notes: "",
      });
    }
    await base44.entities.Shot.bulkCreate(shots);
  }

  // ── Day metrics: weekly kg weight trend (6mo) + daily nutrition (30d) ───────
  if (existingDayMetrics.length === 0) {
    const dayMetricsMap = {};

    // Weekly weight points, 98kg → 90kg over 26 weeks, with realistic fluctuation
    let currentWeight = 98;
    const weeks = 26;
    for (let w = 0; w < weeks; w++) {
      const remainingWeeks = weeks - w;
      const remainingLoss = currentWeight - 90;
      const avgNeeded = remainingWeeks > 0 ? remainingLoss / remainingWeeks : 0;
      const fluctuation = (Math.random() - 0.5) * 0.4;
      let loss = avgNeeded + fluctuation;
      loss = Math.max(0.1, Math.min(0.6, loss));
      currentWeight = Math.round((currentWeight - loss) * 10) / 10;
      if (w === weeks - 1) currentWeight = 90;

      const d = new Date(today);
      d.setDate(d.getDate() - (weeks - 1 - w) * 7);
      dayMetricsMap[dayKey(d)] = { day_key: dayKey(d), weight: currentWeight };
    }

    // Last 30 days: nutrition + exercise, merged with any existing weight day
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      dayMetricsMap[key] = {
        ...(dayMetricsMap[key] || { day_key: key }),
        calories: randRange(1600, 1900),
        protein: randRange(70, 90),
        water: randRange(1500, 2000),
        fiber: randRange(18, 25),
        carbs: randRange(130, 180),
        exercise_min: randRange(0, 45),
      };
    }

    await base44.entities.DayMetric.bulkCreate(Object.values(dayMetricsMap));
  }

  // ── Journal entries ──────────────────────────────────────────────────────────
  if (existingJournal.length === 0) {
    const journalEntries = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - Math.floor((56 / 12) * i));
      const moodPick = MOODS[i % MOODS.length];
      journalEntries.push({
        text: JOURNAL_TEXTS[i % JOURNAL_TEXTS.length],
        date: fmtDate(d),
        time: "7:30 PM",
        mood: moodPick.mood,
        mood_color: moodPick.mood_color,
        category: CATEGORIES[i % CATEGORIES.length],
      });
    }
    await base44.entities.JournalEntry.bulkCreate(journalEntries);
  }
}