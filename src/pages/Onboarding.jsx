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

function StepWithPhone({ title, subtitle, children }) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-1.5 leading-tight">{title}</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-xs">{subtitle}</p>
      <PhoneMockup>{children}</PhoneMockup>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-3 mt-1">
        <Droplets size={28} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold mb-1.5">Welcome to Dosely</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-xs">
        Your GLP-1 companion. Track shots, monitor progress, and reach your health goals.
      </p>
      <PhoneMockup><MiniHomeScreen /></PhoneMockup>
    </div>
  );
}

function NeverMissStep() {
  return (
    <StepWithPhone title="Never Miss a Shot Again" subtitle="Detailed shot logs and smart scheduling keep you perfectly on track.">
      <MiniShotsScreen />
    </StepWithPhone>
  );
}

function VisualizeStep() {
  return (
    <StepWithPhone title="Visualize Your Success" subtitle="Watch your weight loss journey unfold with beautiful charts and trends.">
      <MiniInsightsScreen />
    </StepWithPhone>
  );
}

function MedicationTrackingStep() {
  return (
    <StepWithPhone title="Track Medication Levels" subtitle="Monitor estimated drug concentration with a scientific pharmacokinetic model.">
      <MiniMedLevelsScreen />
    </StepWithPhone>
  );
}

function HistoryCalendarStep() {
  return (
    <StepWithPhone title="Complete History & Calendar" subtitle="Navigate your entire journey — view any day's shots, nutrition, and notes.">
      <MiniCalendarScreen />
    </StepWithPhone>
  );
}

function JournalStep() {
  return (
    <StepWithPhone title="Your Health Journal" subtitle="Log symptoms, celebrate wins, and track how you feel day by day.">
      <MiniJournalScreen />
    </StepWithPhone>
  );
}

function ReportsStep() {
  return (
    <StepWithPhone title="Professional Reports" subtitle="Generate PDF shot history reports to share with your healthcare provider.">
      <MiniReportScreen />
    </StepWithPhone>
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

/* ─── Mini mockup screens (dark-themed, matching app design) ─── */

function MiniHomeScreen() {
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 pb-1 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-[11px] text-white">Good Morning! ☀️</span>
        <div className="w-5 h-5 rounded-md bg-gray-800 flex items-center justify-center">
          <span className="text-[8px]">⚙</span>
        </div>
      </div>
      {/* Date strip */}
      <div className="flex gap-1 mb-2.5 justify-between">
        {[{d:"Tue",n:28},{d:"Wed",n:29},{d:"Thu",n:30,a:true},{d:"Fri",n:1},{d:"Sat",n:2}].map((x) => (
          <div key={x.d} className={`flex-1 text-center py-1 rounded-lg ${x.a ? "bg-blue-600" : "bg-gray-800/60"}`}>
            <div className={`text-[7px] ${x.a ? "text-blue-200" : "text-gray-500"}`}>{x.d}</div>
            <div className={`text-[9px] font-bold ${x.a ? "text-white" : "text-gray-300"}`}>{x.n}</div>
            {x.a && <div className="w-1 h-1 bg-blue-300 rounded-full mx-auto mt-0.5" />}
          </div>
        ))}
      </div>
      {/* Next Shot card */}
      <div className="bg-gray-900 rounded-xl p-2 mb-2 border border-gray-800">
        <div className="text-[7px] text-gray-500 mb-0.5">Next Shot</div>
        <div className="text-[10px] font-bold text-white">Jul 07, 2026</div>
        <div className="text-[7px] text-blue-400 font-medium">In 7 days</div>
        <div className="text-[7px] text-gray-500 mt-0.5">Last: Jun 30 · 2.5 mg</div>
      </div>
      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {[
          {l:"Weight",v:"178 lb",c:"text-purple-400"},
          {l:"Calories",v:"1,840",c:"text-orange-400"},
          {l:"Protein",v:"82 g",c:"text-green-400"},
          {l:"Water",v:"48 oz",c:"text-cyan-400"},
          {l:"Fiber",v:"22 g",c:"text-yellow-400"},
          {l:"Carbs",v:"120 g",c:"text-pink-400"},
          {l:"Exercise",v:"35 min",c:"text-red-400"},
          {l:"Progress",v:"— pic",c:"text-indigo-400"},
        ].map(m=>(
          <div key={m.l} className="bg-gray-900 rounded-lg p-1 border border-gray-800">
            <div className="text-[6px] text-gray-500">{m.l}</div>
            <div className={`text-[7px] font-bold ${m.c}`}>{m.v}</div>
          </div>
        ))}
      </div>
      {/* Side effects */}
      <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
        <div className="text-[8px] font-semibold text-gray-300 mb-1">Side Effects</div>
        <div className="bg-teal-500/10 rounded-lg px-2 py-1 border border-teal-500/20">
          <p className="text-[7px] text-teal-300">Mild nausea in the morning, resolved by noon.</p>
        </div>
      </div>
    </div>
  );
}

function MiniShotsScreen() {
  const shots = [
    {d:"Jun 30",t:"7:00 AM",s:"Stomach – Upper Right",p:0},
    {d:"Jun 23",t:"6:30 AM",s:"Thigh – Left",p:2},
    {d:"Jun 16",t:"8:00 AM",s:"Stomach – Lower Left",p:1},
  ];
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="font-bold text-[11px] text-white mb-2">Shots</div>
      {/* Summary chips */}
      <div className="flex gap-1 mb-2.5">
        <div className="bg-gray-900 rounded-lg p-1.5 flex-1 border border-gray-800">
          <div className="text-[6px] text-gray-500">Total</div>
          <div className="text-[11px] font-bold text-white">12</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-1.5 flex-1 border border-gray-800">
          <div className="text-[6px] text-gray-500">Last Dose</div>
          <div className="text-[9px] font-bold text-blue-400">2.5 mg</div>
          <div className="text-[6px] text-gray-500">Jun 30</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-1.5 flex-1 border border-gray-800">
          <div className="text-[6px] text-gray-500">Next Shot</div>
          <div className="text-[9px] font-bold text-green-400">Jul 07</div>
          <div className="text-[6px] text-gray-500">7 days</div>
        </div>
      </div>
      <div className="text-[8px] font-semibold text-gray-400 mb-1.5">Recent History</div>
      {shots.map((s,i)=>(
        <div key={i} className="bg-gray-900 rounded-xl px-2.5 py-2 mb-1.5 border border-gray-800">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px]">💉</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-semibold text-white">Ozempic®</span>
                <span className="text-[7px] font-bold text-blue-400">2.5 mg</span>
                <span className="text-[5px] bg-green-500/15 text-green-400 px-1 rounded border border-green-500/20">Semaglutide</span>
              </div>
              <div className="text-[6px] text-gray-500">{s.d} · {s.t}</div>
              <div className="text-[6px] text-gray-500">📍 {s.s}{s.p > 0 ? ` · Pain: ${s.p}` : ""}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniInsightsScreen() {
  const pts = [100,96,91,86,80,76,72,68,65,62];
  const max = 100; const min = 60;
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="font-bold text-[11px] text-white mb-2">Insights</div>
      <div className="bg-gray-900 rounded-xl p-2 mb-2 border border-gray-800">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[8px]">📉</span>
          <span className="text-[9px] font-bold text-white">Weight Change</span>
        </div>
        {/* Range tabs */}
        <div className="flex gap-1 mb-2">
          {["30D","180D","1Y"].map((r,i)=>(
            <span key={r} className={`text-[6px] px-1.5 py-0.5 rounded-md font-medium ${i===1?"bg-gray-700 text-white border border-gray-600":"text-gray-500"}`}>{r}</span>
          ))}
        </div>
        {/* Stat chips */}
        <div className="flex gap-1 mb-2">
          <div className="bg-green-500/10 rounded-lg p-1 flex-1 text-center border border-green-500/15">
            <div className="text-[6px] text-gray-500">Loss</div>
            <div className="text-[8px] font-bold text-green-400">-38 lb</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-1 flex-1 text-center border border-blue-500/15">
            <div className="text-[6px] text-gray-500">Rate</div>
            <div className="text-[8px] font-bold text-blue-400">-3.1/wk</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-1 flex-1 text-center border border-orange-500/15">
            <div className="text-[6px] text-gray-500">BMI</div>
            <div className="text-[8px] font-bold text-orange-400">25.4</div>
          </div>
        </div>
        {/* SVG line chart */}
        <svg viewBox="0 0 100 36" className="w-full" style={{height:36}}>
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {(() => {
            const w = 100; const h = 36; const pad = 4;
            const xs = pts.map((_,i) => pad + i * (w - pad*2) / (pts.length-1));
            const ys = pts.map(v => h - pad - (v - min) / (max - min) * (h - pad*2));
            const d = xs.map((x,i) => `${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
            const fill = d + ` L${xs[xs.length-1]},${h} L${xs[0]},${h} Z`;
            return (<><path d={fill} fill="url(#wg)"/><path d={d} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>{xs.map((x,i)=><circle key={i} cx={x} cy={ys[i]} r="1.5" fill="#3b82f6"/>)}</>);
          })()}
        </svg>
      </div>
      {/* Progress photos teaser */}
      <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px]">📸</span>
          <span className="text-[9px] font-bold text-white">Progress Pictures</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {["Jan","Mar","Jun"].map(m=>(
            <div key={m} className="bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-gray-700" style={{height:28}}>
              <span className="text-[6px] text-gray-400">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMedLevelsScreen() {
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="font-bold text-[11px] text-white mb-2">Insights</div>
      <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[8px]">💉</span>
          <span className="text-[9px] font-bold text-white">Medication Levels</span>
        </div>
        <div className="text-[6px] text-blue-400 mb-1.5">Pharmacokinetic decay model</div>
        <div className="flex gap-1 mb-2">
          {["7D","30D","90D"].map((r,i)=>(
            <span key={r} className={`text-[6px] px-1.5 py-0.5 rounded-md font-medium ${i===1?"bg-gray-700 text-white border border-gray-600":"text-gray-500"}`}>{r}</span>
          ))}
        </div>
        {/* Sawtooth med-level chart */}
        <svg viewBox="0 0 110 44" className="w-full" style={{height:44}}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M5 40 L14 10 L22 28 L32 7 L40 26 L50 5 L58 24 L68 8 L76 22 L86 10 L95 18 L105 12" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 40 L14 10 L22 28 L32 7 L40 26 L50 5 L58 24 L68 8 L76 22 L86 10 L95 18 L105 12 L105 44 L5 44 Z" fill="url(#mg)"/>
          {[[14,10],[32,7],[50,5],[68,8],[86,10]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6"/>
          ))}
        </svg>
        <div className="text-[6px] text-gray-500 text-center mt-1">Time vs Concentration (mg)</div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <div className="w-4 h-[2px] bg-blue-500 rounded"/>
          <span className="text-[6px] text-gray-400">Semaglutide</span>
        </div>
      </div>
    </div>
  );
}

function MiniCalendarScreen() {
  const shotDays = [2, 9, 16, 23, 30];
  const today = 30;
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="font-bold text-[11px] text-white mb-1.5">History</div>
      <div className="bg-gray-900 rounded-xl p-2 mb-2 border border-gray-800">
        <div className="text-center text-[9px] font-bold text-white mb-1.5">June 2026</div>
        <div className="grid grid-cols-7 gap-[2px] text-center mb-1">
          {["S","M","T","W","T","F","S"].map((d,i) => (
            <div key={i} className="text-[6px] text-gray-500 font-semibold">{d}</div>
          ))}
          {/* June 2026 starts on Monday (offset 1) */}
          <div/>
          {Array.from({length:30}).map((_,i)=>{
            const day = i+1;
            const hasShot = shotDays.includes(day);
            const isToday = day === today;
            return (
              <div key={day} className={`text-[7px] py-[1px] rounded-md relative ${isToday?"bg-blue-600 text-white font-bold":hasShot?"text-white":"text-gray-400"}`}>
                {day}
                {hasShot && !isToday && <div className="w-1 h-1 bg-green-400 rounded-full mx-auto mt-[1px]"/>}
              </div>
            );
          })}
        </div>
      </div>
      {/* Selected day detail */}
      <div className="bg-gray-900 rounded-xl px-2.5 py-2 border border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-green-500/15 flex items-center justify-center">
            <span className="text-[8px]">💉</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-semibold text-white">Ozempic®</span>
              <span className="text-[7px] font-bold text-blue-400">2.5 mg</span>
            </div>
            <div className="text-[6px] text-gray-500">Jun 30, 2026 · 7:00 AM</div>
            <div className="text-[6px] text-gray-500">📍 Stomach – Upper Right</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniJournalScreen() {
  const entries = [
    { emoji: "😊", text: "Down 8 lbs after 4 weeks on Ozempic! Feeling great.", time: "7:00 AM", date: "Jun 30", cat: "Milestone", badgeColor: "bg-green-500/15 text-green-400 border-green-500/20" },
    { emoji: "🙂", text: "One month in — appetite is much more manageable now.", time: "6:00 PM", date: "Jun 28", cat: "General Note", badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    { emoji: "😐", text: "Mild nausea this morning after my shot, but it passed.", time: "5:18 PM", date: "Jun 23", cat: "Side Effect", badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    { emoji: "⚡", text: "Energy levels through the roof today — best week yet!", time: "1:44 PM", date: "Jun 20", cat: "Energy", badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  ];
  return (
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-[11px] text-white">Journal</span>
        <div className="bg-blue-600 rounded-lg px-1.5 py-0.5">
          <span className="text-[7px] text-white font-semibold">+ New</span>
        </div>
      </div>
      {/* Filter chips */}
      <div className="flex gap-1 mb-2 overflow-hidden">
        {["All","Mood","Side Effect","Milestone"].map((c,i)=>(
          <span key={c} className={`text-[6px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${i===0?"bg-gray-700 text-white border-gray-600":"text-gray-500 border-gray-700"}`}>{c}</span>
        ))}
      </div>
      {entries.map((e, i) => (
        <div key={i} className="bg-gray-900 rounded-xl px-2 py-1.5 mb-1.5 border border-gray-800">
          <div className="flex gap-1.5 items-start">
            <span className="text-[11px] flex-shrink-0">{e.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] text-gray-200 leading-snug truncate">{e.text}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[6px] text-gray-500">{e.time} · {e.date}</span>
                <span className={`text-[5px] px-1 rounded border ${e.badgeColor}`}>{e.cat}</span>
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
    <div className="h-full flex flex-col bg-gray-950 px-2.5 pt-1 overflow-hidden">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[9px] text-gray-400">←</span>
        <span className="font-bold text-[11px] text-white">Shot Report</span>
      </div>
      <div className="bg-gray-900 rounded-xl p-2 mb-2 border border-gray-800">
        <div className="text-[8px] font-bold text-white mb-0.5">GLP-1 Shot History</div>
        <div className="text-[6px] text-gray-500 mb-1.5">Jun 01 – Jun 30, 2026</div>
        <div className="grid grid-cols-2 gap-1 mb-1.5">
          {[{l:"Total Shots",v:"12"},{l:"Total Dose",v:"30.0 mg"},{l:"Avg Dose",v:"2.5 mg"},{l:"Avg Pain",v:"1.2 / 10"}].map(r=>(
            <div key={r.l} className="bg-gray-800 rounded-lg p-1 border border-gray-700">
              <div className="text-[6px] text-gray-500">{r.l}</div>
              <div className="text-[8px] font-bold text-white">{r.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
        <div className="text-[7px] font-semibold text-gray-300 mb-1">Recent Shots</div>
        {[{d:"Jun 30",dose:"2.5mg",site:"Stomach UR",pain:0},{d:"Jun 23",dose:"2.5mg",site:"Thigh L",pain:2},{d:"Jun 16",dose:"2.5mg",site:"Stomach LL",pain:1}].map((r,i)=>(
          <div key={i} className={`flex items-center justify-between py-1 ${i<2?"border-b border-gray-800":""}`}>
            <div>
              <div className="text-[7px] text-gray-300">{r.d} · Ozempic® {r.dose}</div>
              <div className="text-[6px] text-gray-500">📍 {r.site}</div>
            </div>
            <span className={`text-[6px] font-bold ${r.pain===0?"text-green-400":r.pain<=2?"text-yellow-400":"text-red-400"}`}>Pain: {r.pain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}