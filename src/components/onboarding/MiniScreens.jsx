import React from "react";

// ── Shared primitives ──────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-900 rounded-xl border border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

function MetricChip({ label, value, color = "blue" }) {
  const colors = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
    teal: "text-teal-400",
    purple: "text-purple-400",
    red: "text-red-400",
  };
  return (
    <div className="bg-gray-900 rounded-lg p-1.5 border border-gray-800">
      <div className="text-[6px] text-gray-500 mb-0.5">{label}</div>
      <div className={`text-[8px] font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

export function MiniHomeScreen() {
  const days = [
    { d: "Mon", n: 27 }, { d: "Tue", n: 28 }, { d: "Wed", n: 29 },
    { d: "Thu", n: 30 }, { d: "Fri", n: 1 },
  ];
  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-[10px] text-white">Good Morning! ☀️</span>
        <div className="w-4 h-4 rounded-md bg-gray-800 flex items-center justify-center">
          <span className="text-[7px]">⚙</span>
        </div>
      </div>

      {/* Date strip */}
      <div className="flex gap-0.5 justify-between">
        {days.map((d, i) => (
          <div key={d.d} className={`flex-1 text-center py-1 rounded-lg ${i === 2 ? "bg-blue-600" : "bg-gray-900 border border-gray-800"}`}>
            <div className={`text-[6px] ${i === 2 ? "text-blue-200" : "text-gray-500"}`}>{d.d}</div>
            <div className={`text-[8px] font-bold ${i === 2 ? "text-white" : "text-gray-300"}`}>{d.n}</div>
          </div>
        ))}
      </div>

      {/* Next Shot Card */}
      <Card className="p-2 flex items-start justify-between">
        <div>
          <div className="text-[6px] text-gray-500 mb-0.5">Next Shot</div>
          <div className="text-[9px] font-bold text-white">Jul 07, 2026</div>
          <div className="text-[6px] text-blue-400 mt-0.5">In 7 days</div>
          <div className="text-[6px] text-gray-500 mt-0.5">Last: Jun 30 · 2.5 mg</div>
        </div>
        {/* Mini progress ring */}
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" fill="none" stroke="#374151" strokeWidth="3" />
          <circle cx="14" cy="14" r="11" fill="none" stroke="#3b82f6" strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 11 * 0.65} ${2 * Math.PI * 11}`}
            strokeLinecap="round" transform="rotate(-90 14 14)" />
          <text x="14" y="17" textAnchor="middle" fontSize="5.5" fill="#93c5fd" fontWeight="bold">65%</text>
        </svg>
      </Card>

      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-1">
        <MetricChip label="Weight" value="178 lb" color="blue" />
        <MetricChip label="Calories" value="1,840" color="orange" />
        <MetricChip label="Protein" value="82 g" color="green" />
        <MetricChip label="Water" value="48 oz" color="teal" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        <MetricChip label="Fiber" value="18 g" color="purple" />
        <MetricChip label="Carbs" value="120 g" color="orange" />
        <MetricChip label="Exercise" value="30 min" color="green" />
        <MetricChip label="Progress" value="📷 pic" color="blue" />
      </div>

      {/* Side effects strip */}
      <Card className="p-1.5 flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: "rgba(20,184,166,0.15)" }}>
          <span className="text-[8px]">💨</span>
        </div>
        <span className="text-[6px] text-gray-400">Side effects · <span className="text-teal-400">Mild nausea</span></span>
      </Card>
    </div>
  );
}

// ── SHOTS ─────────────────────────────────────────────────────────────────────

export function MiniShotsScreen() {
  const shots = [
    { med: "Zepbound®", dose: "2.5", date: "Jun 30", time: "7:00 AM", site: "Stomach – Upper L", pain: 0, dc: "Tirzepatide" },
    { med: "Zepbound®", dose: "2.5", date: "Jun 23", time: "6:30 AM", site: "Thigh – Right", pain: 2, dc: "Tirzepatide" },
    { med: "Zepbound®", dose: "2.5", date: "Jun 16", time: "8:15 AM", site: "Stomach – Lower R", pain: 1, dc: "Tirzepatide" },
  ];
  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      <div className="font-bold text-[10px] text-white">Shots</div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-1">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-1.5 text-center">
          <div className="text-[6px] text-gray-500">Total</div>
          <div className="text-[10px] font-bold text-blue-400">12</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-1.5 text-center">
          <div className="text-[6px] text-gray-500">Last Dose</div>
          <div className="text-[8px] font-bold text-green-400">2.5 mg</div>
          <div className="text-[5px] text-gray-500">Jun 30</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-1.5 text-center">
          <div className="text-[6px] text-gray-500">Next Shot</div>
          <div className="text-[8px] font-bold text-orange-400">Jul 07</div>
          <div className="text-[5px] text-gray-500">In 7 days</div>
        </div>
      </div>

      <div className="text-[7px] font-semibold text-gray-400 mt-1">History</div>

      {shots.map((s, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-1.5 flex items-start gap-1.5">
          <div className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
            <span className="text-[9px]">💉</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-semibold text-white">{s.med}</span>
              <span className="text-[7px] font-bold text-blue-400">{s.dose} mg</span>
              <span className="text-[5px] px-1 py-[1px] rounded bg-transparent border text-green-400 border-green-500/30">{s.dc}</span>
            </div>
            <div className="text-[6px] text-gray-500">{s.date} · {s.time}</div>
            <div className="text-[6px] text-gray-500">📍 {s.site}{s.pain > 0 ? ` · Pain: ${s.pain}` : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── HISTORY / CALENDAR ────────────────────────────────────────────────────────

export function MiniCalendarScreen() {
  const shotDays = [2, 9, 16, 23, 30];
  const totalDays = 30;
  const startOffset = 2; // June starts on Monday (offset 2 from Sun=0)

  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      <div className="font-bold text-[10px] text-white">History</div>

      {/* Month header */}
      <div className="flex items-center justify-between">
        <span className="text-[6px] text-gray-500">◀</span>
        <span className="text-[8px] font-bold text-white">June 2026</span>
        <span className="text-[6px] text-gray-500">▶</span>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 text-center">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} className="text-[6px] text-gray-500 pb-0.5">{d}</div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const hasShot = shotDays.includes(day);
          const isSelected = day === 30;
          return (
            <div key={day} className={`flex flex-col items-center py-[1px] rounded-md ${isSelected ? "bg-blue-600" : ""}`}>
              <span className={`text-[6px] ${isSelected ? "text-white font-bold" : "text-gray-300"}`}>{day}</span>
              {hasShot && <div className={`w-1 h-1 rounded-full mt-[1px] ${isSelected ? "bg-white" : "bg-green-500"}`} />}
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      <Card className="p-1.5 space-y-1">
        <div className="text-[6px] font-semibold text-gray-400">Jun 30 — Shot logged</div>
        <div className="flex items-start gap-1.5">
          <div className="w-4 h-4 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
            <span className="text-[8px]">💉</span>
          </div>
          <div>
            <div className="text-[7px] font-semibold text-white">Zepbound® <span className="text-blue-400">2.5 mg</span></div>
            <div className="text-[6px] text-gray-500">7:00 AM · Stomach – Upper Left</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── INSIGHTS / WEIGHT ─────────────────────────────────────────────────────────

export function MiniInsightsScreen() {
  // Simple weight trend line points
  const pts = [62, 58, 53, 47, 42, 38, 33, 28, 22, 18, 14, 10];
  const W = 140, H = 44;
  const xStep = W / (pts.length - 1);
  const polyline = pts.map((v, i) => `${i * xStep},${v}`).join(" ");

  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      <div className="font-bold text-[10px] text-white">Insights</div>

      <Card className="p-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px]">📉</span>
          <span className="text-[8px] font-bold text-white">Weight Change</span>
        </div>
        {/* Range tabs */}
        <div className="flex gap-0.5 mb-1.5">
          {["30 Days", "180 Days", "1 Year"].map((r, i) => (
            <span key={r} className={`text-[6px] px-1.5 py-0.5 rounded-md font-medium ${i === 1 ? "bg-gray-700 text-white border border-gray-600" : "text-gray-500"}`}>{r}</span>
          ))}
        </div>
        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-1 mb-1.5">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-1 text-center">
            <div className="text-[5px] text-gray-500">Weight Loss</div>
            <div className="text-[7px] font-bold text-green-400">-38.5 lb</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1 text-center">
            <div className="text-[5px] text-gray-500">Rate/Week</div>
            <div className="text-[7px] font-bold text-blue-400">-1.5 lb</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-1 text-center">
            <div className="text-[5px] text-gray-500">BMI</div>
            <div className="text-[7px] font-bold text-orange-400">25.1</div>
          </div>
        </div>
        {/* Chart */}
        <svg viewBox={`0 0 ${W} ${H + 8}`} className="w-full" style={{ height: 44 }}>
          <polyline points={polyline} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((v, i) => (
            <circle key={i} cx={i * xStep} cy={v} r="1.5" fill="#3b82f6" />
          ))}
        </svg>
      </Card>

      {/* Med levels teaser */}
      <Card className="p-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px]">💉</span>
          <span className="text-[8px] font-bold text-white">Medication Levels</span>
        </div>
        <svg viewBox="0 0 140 36" className="w-full" style={{ height: 36 }}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 30 L18 8 L30 20 L48 5 L60 17 L78 4 L90 14 L108 8 L120 12 L140 10" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 30 L18 8 L30 20 L48 5 L60 17 L78 4 L90 14 L108 8 L120 12 L140 10 L140 36 L0 36Z" fill="url(#mg)" />
        </svg>
        <div className="text-[5px] text-gray-500 text-center mt-0.5">Time vs Concentration (mg) · Tirzepatide</div>
      </Card>
    </div>
  );
}

// ── JOURNAL ───────────────────────────────────────────────────────────────────

export function MiniJournalScreen() {
  const entries = [
    { emoji: "😊", mood: "Excellent", moodColor: "text-green-400", moodBg: "bg-green-500/10 border-green-500/20", cat: "Milestone", text: "Down 8 lbs this month! The appetite suppression is really working now.", date: "Jun 30 · 7:00 AM" },
    { emoji: "🙂", mood: "Good",      moodColor: "text-green-300", moodBg: "bg-green-500/10 border-green-500/20", cat: "General Note", text: "Started adding more protein. Nausea is much more manageable this week.", date: "Jun 28 · 6:00 PM" },
    { emoji: "😐", mood: "Neutral",   moodColor: "text-yellow-400", moodBg: "bg-yellow-500/10 border-yellow-500/20", cat: "Side Effect", text: "Mild nausea after today's shot. Drank extra water and rested.", date: "Jun 23 · 10:00 AM" },
  ];

  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[10px] text-white">Journal</span>
        <div className="flex gap-1">
          {["Mood","Side Effect","Milestone"].map(c => (
            <span key={c} className="text-[5px] px-1 py-[1px] rounded-md bg-gray-800 text-gray-400 border border-gray-700">{c}</span>
          ))}
        </div>
      </div>

      {entries.map((e, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-1.5 flex gap-1.5">
          <div className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-800">
            <span className="text-[10px]">{e.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className={`text-[5px] px-1 py-[1px] rounded border ${e.moodBg} ${e.moodColor}`}>{e.mood}</span>
              <span className="text-[5px] text-gray-500">· {e.cat}</span>
            </div>
            <div className="text-[6px] text-gray-300 leading-snug line-clamp-2">{e.text}</div>
            <div className="text-[5px] text-gray-600 mt-0.5">{e.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────

export function MiniProfileScreen() {
  return (
    <div className="px-2 pt-1 pb-2 space-y-1.5">
      <div className="font-bold text-[10px] text-white">Profile</div>

      {/* Avatar row */}
      <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white">JD</span>
        </div>
        <div>
          <div className="text-[8px] font-bold text-white">Jane Doe</div>
          <div className="text-[6px] text-gray-500">jane@example.com</div>
        </div>
      </div>

      {/* Physical metrics */}
      <Card className="p-1.5 space-y-1">
        <div className="text-[6px] font-semibold text-gray-400 uppercase">Physical Info</div>
        <div className="grid grid-cols-2 gap-1">
          <div className="flex justify-between"><span className="text-[6px] text-gray-500">Height</span><span className="text-[6px] text-white font-medium">5 ft 6 in</span></div>
          <div className="flex justify-between"><span className="text-[6px] text-gray-500">Goal Weight</span><span className="text-[6px] text-blue-400 font-medium">150 lb</span></div>
        </div>
      </Card>

      {/* Shot prefs */}
      <Card className="p-1.5 space-y-1">
        <div className="text-[6px] font-semibold text-gray-400 uppercase">Shot Preferences</div>
        <div className="flex justify-between"><span className="text-[6px] text-gray-500">Default Medication</span><span className="text-[6px] text-white font-medium">Zepbound®</span></div>
        <div className="flex justify-between"><span className="text-[6px] text-gray-500">Frequency</span><span className="text-[6px] text-white font-medium">Every 7 days</span></div>
      </Card>

      {/* Units */}
      <Card className="p-1.5 space-y-1">
        <div className="text-[6px] font-semibold text-gray-400 uppercase">Measurement Units</div>
        <div className="grid grid-cols-3 gap-1">
          {[["Weight","lb"],["Height","in"],["Liquid","oz"]].map(([l,v]) => (
            <div key={l} className="text-center">
              <div className="text-[5px] text-gray-500">{l}</div>
              <div className="text-[7px] font-bold text-blue-400">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}