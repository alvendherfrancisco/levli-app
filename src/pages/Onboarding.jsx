import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import PhoneMockup from "@/components/onboarding/PhoneMockup";
import QuizScreen from "@/components/onboarding/QuizScreen";
import { Bell, Droplets } from "lucide-react";
import { useAppState } from "@/lib/AppState";

const TOTAL_STEPS = 14;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { setProfile, profile } = useAppState();
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleQuizAnswer = (questionKey, answers) => {
    setQuizAnswers((prev) => ({ ...prev, [questionKey]: answers }));
  };

  const next = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Save onboarding answers to profile
      const medAnswers = quizAnswers["medication"] || [];
      let defaultMed = "Ozempic®";
      if (medAnswers.some(a => a.includes("Tirzepatide"))) defaultMed = "Zepbound®";
      else if (medAnswers.some(a => a.includes("Semaglutide"))) defaultMed = "Ozempic®";

      const freqAnswers = quizAnswers["frequency"] || [];
      let daysBetween = "7";
      if (freqAnswers.some(a => a.includes("two weeks"))) daysBetween = "14";
      else if (freqAnswers.some(a => a.includes("monthly"))) daysBetween = "30";

      await setProfile({ ...profile, default_medication: defaultMed, days_between: daysBetween, onboarding_completed: true });
      navigate("/");
    }
  };

  return (
    <OnboardingScreen step={step} totalSteps={TOTAL_STEPS} onContinue={next}>
      {step === 0 && <WelcomeStep />}
      {step === 1 && <NeverMissStep />}
      {step === 2 && <VisualizeStep />}
      {step === 3 && <MedicationTrackingStep />}
      {step === 4 && <HistoryCalendarStep />}
      {step === 5 && <JournalStep />}
      {step === 6 && <ReportsStep />}
      {step === 7 && <NotificationStep onContinue={next} />}
      {step === 8 && <PersonalizeStep />}
      {step === 9 && (
        <QuizScreen
          question="What results matter most to you with GLP-1 therapy?"
          subtitle="Select all that apply to personalize your experience"
          multiSelect
          options={[
            "Achieving my weight loss goals",
            "Never missing my weekly shots",
            "Tracking and managing side effects",
            "Properly rotating injection sites",
            "Understanding my medication levels",
            "Sharing progress with my healthcare provider",
            "Optimizing my nutrition and hydration",
          ]}
        />
      )}
      {step === 10 && (
        <QuizScreen
          question="What challenges do you face with GLP-1 therapy?"
          subtitle="Select all that apply so we can help you succeed"
          multiSelect
          options={[
            "Forgetting to take my weekly shots",
            "Managing nausea and other side effects",
            "Anxiety about self-injecting",
            "Adapting to appetite changes",
            "Finding the optimal injection timing",
            "Tracking progress effectively",
            "Managing medication costs",
          ]}
        />
      )}
      {step === 11 && (
        <QuizScreen
          question="Which GLP-1 medication are you taking?"
          subtitle="Select all that apply"
          multiSelect
          options={[
            "Semaglutide (Ozempic, Wegovy)",
            "Tirzepatide (Mounjaro, Zepbound)",
            "Retatrutide (Clinical trial)",
            "Considering starting GLP-1 therapy",
          ]}
          onAnswerChange={(answers) => handleQuizAnswer("medication", answers)}
        />
      )}
      {step === 12 && (
        <QuizScreen
          question="How often do you take your GLP-1 shots?"
          subtitle="Select all that apply"
          multiSelect
          preSelected={["Once weekly (standard dosing)"]}
          options={[
            "Once weekly (standard dosing)",
            "Every two weeks",
            "Once monthly",
            "Currently dose escalating",
            "Irregular schedule due to side effects",
          ]}
          onAnswerChange={(answers) => handleQuizAnswer("frequency", answers)}
        />
      )}
      {step === 13 && <FinalStep />}
    </OnboardingScreen>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <Droplets size={32} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Welcome to GLP1 Tracker</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-6">
        The ultimate companion for your GLP-1 medication journey. Track shots, monitor progress, and achieve your health goals with confidence.
      </p>
      <PhoneMockup>
        <MiniHomeScreen />
      </PhoneMockup>
    </div>
  );
}

function NeverMissStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Never Miss a Shot Again</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Smart reminders and detailed shot logs ensure perfect adherence to your medication schedule. Your doctor will love the complete records.
      </p>
      <PhoneMockup>
        <MiniShotsScreen />
      </PhoneMockup>
    </div>
  );
}

function VisualizeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Visualize Your Success</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Watch your weight loss journey unfold with beautiful charts and progress tracking.
      </p>
      <PhoneMockup>
        <MiniInsightsScreen />
      </PhoneMockup>
    </div>
  );
}

function MedicationTrackingStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Advanced Medication Tracking</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Monitor estimated medication levels in your system with scientific precision.
      </p>
      <PhoneMockup>
        <MiniMedLevelsScreen />
      </PhoneMockup>
    </div>
  );
}

function HistoryCalendarStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Complete History & Calendar</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Navigate your entire GLP-1 journey. View any day's shots, weight, nutrition, and side effects at a glance.
      </p>
      <PhoneMockup>
        <MiniCalendarScreen />
      </PhoneMockup>
    </div>
  );
}

function JournalStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Your Personal Health Journal</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Document symptoms, celebrate victories, and track how you feel.
      </p>
      <PhoneMockup>
        <MiniJournalScreen />
      </PhoneMockup>
    </div>
  );
}

function ReportsStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Professional Medical Reports</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Generate comprehensive PDF reports of shots you've taken. Perfect for sharing with your healthcare provider.
      </p>
      <PhoneMockup>
        <MiniReportScreen />
      </PhoneMockup>
    </div>
  );
}

function NotificationStep({ onContinue }) {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Never Miss a Shot Again</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-6">
        GLP1 Tracker gently reminds you when it's time to take your shots — so you never have to worry about forgetting again.
      </p>
      <div className="bg-gray-900 rounded-2xl p-6 mb-4 border border-gray-800">
        <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={28} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Allow Notifications</h3>
        <p className="text-gray-400 text-sm">
          To make the most of GLP1 Tracker, please allow notifications so we can remind you when it's time to take your medications.
        </p>
      </div>
      {enabled ? (
        <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto border border-green-500/40">
          <Bell size={16} /> Notifications Enabled ✓
        </div>
      ) : (
        <button onClick={() => { setEnabled(true); setTimeout(onContinue, 800); }}
          className="px-6 py-3 border border-blue-500 text-blue-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto">
          <Bell size={16} /> Enable Notifications
        </button>
      )}
      <p className="text-gray-500 text-xs mt-4">You can adjust your notification preferences later in Settings.</p>
    </div>
  );
}

function PersonalizeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Let's Personalize Your Experience</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-6">
        Answer a few quick questions to help us tailor GLP1 Tracker to your specific needs.
      </p>
      <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
        <Droplets size={64} className="text-white" />
      </div>
      <p className="text-gray-400 text-sm">Your answers will help us provide you with the best experience possible.</p>
    </div>
  );
}

function FinalStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1 justify-center">
      <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mb-6">
        <Droplets size={40} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-3">You're All Set!</h1>
      <p className="text-gray-400 text-base leading-relaxed">
        Your personalized GLP-1 tracking experience is ready. Let's start your journey to better health.
      </p>
    </div>
  );
}

/* ─── Mini mockup screens ─── */

function MiniHomeScreen() {
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-[10px]">Good Morning!</span>
        <span className="text-[8px]">⚙️</span>
      </div>
      <div className="flex gap-1 mb-2 justify-center">
        {["Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
          <div key={d} className={`text-center px-1 py-0.5 rounded ${i === 2 ? "bg-blue-600 text-white" : ""}`}>
            <div className="text-[7px]">{d}</div>
            <div className="text-[8px] font-bold">{3 + i}</div>
            <div className="text-[7px]">Jun</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg p-1.5 mb-2">
        <div className="text-[7px] text-gray-400">Next Shot</div>
        <div className="text-[9px] font-bold">Fri, Jun 6, 2025</div>
        <div className="text-[7px] text-gray-400 mt-0.5">Last Dose: Fri, May 30 · 2.5 mg</div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[{l:"Weight",v:"178.5 lb"},{l:"Calories",v:"2100 kcal"},{l:"Protein",v:"60.0 g"},{l:"Fiber",v:"—"},{l:"Carbs",v:"—"},{l:"Water",v:"—"}].map(m=>(
          <div key={m.l} className="bg-gray-50 rounded p-1">
            <div className="text-[7px] text-gray-500">{m.l}</div>
            <div className="text-[8px] font-semibold">{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniShotsScreen() {
  return (
    <div className="p-2">
      <div className="font-bold text-[10px] mb-1">Shots</div>
      <div className="flex gap-1 mb-2">
        <div className="bg-gray-50 rounded p-1 flex-1"><div className="text-[7px] text-gray-400">Total Shots</div><div className="text-[10px] font-bold">6</div></div>
        <div className="bg-gray-50 rounded p-1 flex-1"><div className="text-[7px] text-gray-400">Last Dose</div><div className="text-[9px] font-bold">2.5 mg</div><div className="text-[6px] text-gray-400">6 days ago</div></div>
        <div className="bg-gray-50 rounded p-1 flex-1"><div className="text-[7px] text-gray-400">Next Shot</div><div className="text-[9px] font-bold">Jun 6</div><div className="text-[6px] text-gray-400">Today</div></div>
      </div>
      <div className="text-[8px] font-bold mb-1">History</div>
      {[{d:"May 30",t:"6:00 AM",s:"Stomach - Upper Right"},{d:"May 22",t:"12:12 PM",s:"Stomach - Upper Right",p:2},{d:"May 15",t:"7:00 AM",s:"Stomach - Lower Left",p:5}].map((s,i)=>(
        <div key={i} className="bg-gray-50 rounded p-1.5 mb-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[8px] font-semibold">Ozempic® <span className="text-blue-600">2.5 mg</span></div>
              <div className="text-[7px] text-gray-400">{s.d}, 2025 · {s.t}</div>
              <div className="text-[7px] text-gray-400">📍 {s.s} {s.p ? `· Pain: ${s.p}` : ""}</div>
            </div>
            <span className="text-[6px] bg-green-100 text-green-700 px-1 rounded">Semaglutide</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniInsightsScreen() {
  return (
    <div className="p-2">
      <div className="font-bold text-[10px] mb-1">Insights</div>
      <div className="bg-gray-50 rounded-lg p-1.5">
        <div className="text-[8px] font-bold mb-1">📈 Weight Change</div>
        <div className="flex gap-1 mb-1">
          <span className="text-[7px] px-1 py-0.5 bg-white rounded border">30 Days</span>
          <span className="text-[7px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded border border-blue-200 font-medium">180 Days</span>
          <span className="text-[7px] px-1 py-0.5 bg-white rounded border">1 Year</span>
        </div>
        <div className="flex gap-1 mb-1">
          <div className="bg-green-50 rounded p-1 flex-1 text-center"><div className="text-[6px] text-gray-500">Weight Loss</div><div className="text-[8px] font-bold text-green-600">-38.0 lbs</div></div>
          <div className="bg-blue-50 rounded p-1 flex-1 text-center"><div className="text-[6px] text-gray-500">Rate/Week</div><div className="text-[8px] font-bold text-blue-600">-3.1 lbs</div></div>
          <div className="bg-orange-50 rounded p-1 flex-1 text-center"><div className="text-[6px] text-gray-500">Current BMI</div><div className="text-[8px] font-bold text-orange-600">25.4</div></div>
        </div>
        {/* Simple chart representation */}
        <div className="h-16 flex items-end gap-[2px] px-1">
          {[100,95,88,82,78,72,68,65].map((h,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-1 h-1 rounded-full bg-blue-500 mb-[1px]" />
              <div className="w-[1px] bg-blue-400" style={{height: `${h * 0.14}px`}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMedLevelsScreen() {
  return (
    <div className="p-2">
      <div className="font-bold text-[10px] mb-1">Insights</div>
      <div className="bg-gray-50 rounded-lg p-1.5">
        <div className="text-[8px] font-bold mb-0.5">💉 Medication Levels</div>
        <div className="text-[6px] text-gray-400 mb-1">Estimated medication levels in your system over time.</div>
        <div className="flex gap-1 mb-1">
          <span className="text-[7px] px-1 py-0.5 bg-white rounded border">7 Days</span>
          <span className="text-[7px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded border border-blue-200 font-medium">30 Days</span>
          <span className="text-[7px] px-1 py-0.5 bg-white rounded border">90 Days</span>
        </div>
        {/* Sawtooth representation */}
        <svg viewBox="0 0 120 40" className="w-full h-12">
          <path d="M5 35 L15 10 L25 20 L35 8 L45 18 L55 6 L65 16 L75 8 L85 15 L95 10 L105 12 L115 14" fill="none" stroke="hsl(var(--accent-foreground))" strokeWidth="1.5" />
          <path d="M5 35 L15 10 L25 20 L35 8 L45 18 L55 6 L65 16 L75 8 L85 15 L95 10 L105 12 L115 14 L115 40 L5 40 Z" fill="hsl(var(--accent-foreground))" fillOpacity="0.1" />
        </svg>
        <div className="text-[6px] text-gray-400 text-center">Time vs Concentration (mg)</div>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <div className="w-2 h-[2px] bg-blue-600 rounded" />
          <span className="text-[6px] text-gray-500">Semaglutide</span>
        </div>
      </div>
    </div>
  );
}

function MiniCalendarScreen() {
  const shotDays = [1, 8, 15, 22, 30];
  return (
    <div className="p-2">
      <div className="font-bold text-[10px] mb-1">History</div>
      <div className="text-center text-[8px] font-semibold mb-1">May 2025</div>
      <div className="grid grid-cols-7 gap-[1px] text-center mb-1">
        {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} className="text-[6px] text-gray-400">{d}</div>)}
        {Array.from({length:3}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:31}).map((_,i)=>{
          const day = i+1;
          const hasShot = shotDays.includes(day);
          return (
            <div key={day} className={`text-[7px] py-[1px] ${day===30?"text-blue-600 font-bold border border-blue-400 rounded":""}`}>
              {day}
              {hasShot && <div className="w-1 h-1 bg-green-500 rounded-full mx-auto" />}
            </div>
          );
        })}
      </div>
      <div className="bg-gray-50 rounded p-1.5">
        <div className="text-[8px] font-semibold">Ozempic® <span className="text-blue-600">2.5 mg</span></div>
        <div className="text-[7px] text-gray-400">May 30, 2025 · 6:00 AM</div>
        <div className="text-[7px] text-gray-400">📍 Stomach - Upper Right</div>
      </div>
    </div>
  );
}

function MiniJournalScreen() {
  const entries = [
    { emoji: "😊", text: "Just completed my 4th week on Ozempic and I'm down 8 lbs!...", time: "7:00 AM", date: "Jun 5", mood: "Feeling Excellent", cat: "Mood", moodColor: "bg-green-100 text-green-700" },
    { emoji: "🙂", text: "Can't believe it's been a month since I started my GLP-1...", time: "6:00 PM", date: "Jun 3", mood: "Feeling Good", cat: "General Note", moodColor: "bg-green-100 text-green-600" },
    { emoji: "⚠️", text: "Had some rough nausea today after my Wegovy shot...", time: "5:18 PM", date: "Jun 1", mood: "Feeling Neutral", cat: "Side Effect", moodColor: "bg-yellow-100 text-yellow-700" },
    { emoji: "⚡", text: "Doctor appointment tomorrow! Excited to share my progress...", time: "1:44 PM", date: "May 27", mood: "Feeling Excellent", cat: "Energy", moodColor: "bg-green-100 text-green-700" },
  ];
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-[10px]">Journal</span>
        <span className="text-[8px]">+ ⚙️</span>
      </div>
      {entries.map((e, i) => (
        <div key={i} className="bg-gray-50 rounded p-1.5 mb-1">
          <div className="flex gap-1">
            <span className="text-[10px]">{e.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] leading-snug truncate">{e.text}</div>
              <div className="text-[6px] text-gray-400">{e.time} · {e.date}</div>
              <div className="flex gap-1 mt-0.5">
                <span className={`text-[5px] px-1 rounded ${e.moodColor}`}>{e.mood}</span>
                <span className="text-[5px] text-gray-400">• {e.cat}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniReportScreen() {
  return (
    <div className="p-2">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[8px]">←</span>
        <span className="font-bold text-[10px]">Report</span>
      </div>
      <div className="bg-gray-50 rounded-lg p-1.5">
        <div className="text-[8px] font-bold mb-0.5">GLP-1 Shot History Report</div>
        <div className="text-[6px] text-gray-400 mb-1">Date Range: May 30 - Jun 05, 2025</div>
        <div className="text-[7px] font-semibold mb-0.5">Summary</div>
        <div className="space-y-[1px] text-[6px] mb-1">
          <div className="flex justify-between"><span className="text-gray-500">Total Shots</span><span>6</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total Dose</span><span>15.0 mg</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Average Dose</span><span>2.5 mg</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Average Pain Level</span><span>1.5/10</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Shots with Pain</span><span>4 (66.7%)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Period Covered</span><span>36 days</span></div>
        </div>
        <div className="text-[7px] font-semibold mb-0.5">Detailed Shot History</div>
        <table className="w-full text-[5px]">
          <thead><tr className="bg-gray-200"><th className="p-0.5">Date</th><th className="p-0.5">Med</th><th className="p-0.5">Dose</th><th className="p-0.5">Site</th><th className="p-0.5">Pain</th></tr></thead>
          <tbody>
            <tr><td className="p-0.5">May 30</td><td className="p-0.5">Ozempic®</td><td className="p-0.5">2.5mg</td><td className="p-0.5">Stomach UR</td><td className="p-0.5 text-green-600">0</td></tr>
            <tr className="bg-gray-50"><td className="p-0.5">May 22</td><td className="p-0.5">Ozempic®</td><td className="p-0.5">2.5mg</td><td className="p-0.5">Stomach UR</td><td className="p-0.5 text-yellow-600">2</td></tr>
            <tr><td className="p-0.5">May 15</td><td className="p-0.5">Ozempic®</td><td className="p-0.5">2.5mg</td><td className="p-0.5">Stomach LL</td><td className="p-0.5 text-red-600">5</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}