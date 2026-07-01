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

export async function seedDemoDataIfNeeded() {
  let user;
  try {
    user = await base44.auth.me();
  } catch {
    return;
  }
  if (!user || user.email !== DEMO_EMAIL) return;

  const existing = await base44.entities.Shot.list("-date", 1);
  if (existing.length > 0) return; // already seeded

  const today = new Date();

  // 26 weekly shots going back ~26 weeks
  const shots = [];
  for (let i = 25; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    shots.push({
      medication: "Ozempic®",
      dose: 2.5,
      drug_class: "Semaglutide",
      date: fmtDate(d),
      time: "8:00 AM",
      site: SITES[(25 - i) % SITES.length],
      pain: Math.floor(Math.random() * 4),
      notes: "",
    });
  }

  // 57 daily metrics going back 57 days with a gentle downward weight trend
  const dayMetrics = [];
  const startWeight = 195;
  for (let i = 56; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const progress = (56 - i) / 56;
    const weight = Math.round((startWeight - progress * 18 + (Math.random() * 1.5 - 0.75)) * 10) / 10;
    dayMetrics.push({
      day_key: dayKey(d),
      weight,
      calories: 1500 + Math.floor(Math.random() * 400),
      protein: 80 + Math.floor(Math.random() * 40),
      water: 40 + Math.floor(Math.random() * 40),
      fiber: 15 + Math.floor(Math.random() * 15),
      carbs: 100 + Math.floor(Math.random() * 80),
      exercise_min: Math.floor(Math.random() * 45),
    });
  }

  // 12 journal entries spread across the last ~50 days
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

  await base44.entities.Shot.bulkCreate(shots);
  await base44.entities.DayMetric.bulkCreate(dayMetrics);
  await base44.entities.JournalEntry.bulkCreate(journalEntries);
}