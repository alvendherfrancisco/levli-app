import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import PhoneMockup from "@/components/onboarding/PhoneMockup";
import QuizScreen from "@/components/onboarding/QuizScreen";
import UnitsStep from "@/components/onboarding/UnitsStep";
import { Bell, Droplets } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { MiniHomeScreen, MiniShotsScreen, MiniInsightsScreen, MiniCalendarScreen, MiniJournalScreen, MiniProfileScreen } from "@/components/onboarding/MiniScreens";

const TOTAL_STEPS = 15;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { setProfile, profile } = useAppState();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [units, setUnits] = useState({ weight_unit: "lb", height_unit: "in", liquid_unit: "oz" });

  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />;
  }

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

      await setProfile({ ...profile, default_medication: defaultMed, days_between: daysBetween, ...units, onboarding_completed: true });
      navigate("/");
    }
  };

  return (
    <OnboardingScreen step={step} totalSteps={TOTAL_STEPS} onContinue={next} hideButton={step === 7}>
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
          preSelected={[]}
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
      {step === 13 && <UnitsStep units={units} setUnits={setUnits} />}
      {step === 14 && <FinalStep />}
    </OnboardingScreen>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <Droplets size={32} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Welcome to Levli</h1>
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
        <MiniInsightsScreen />
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
      <h1 className="text-3xl font-bold mb-3">Your Health Profile</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        Set up your profile with physical stats, medication preferences, and measurement units — everything tailored to you.
      </p>
      <PhoneMockup>
        <MiniProfileScreen />
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
        Levli gently reminds you when it's time to take your shots — so you never have to worry about forgetting again.
      </p>
      <div className="bg-gray-900 rounded-2xl p-6 mb-4 border border-gray-800">
        <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={28} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Allow Notifications</h3>
        <p className="text-gray-400 text-sm">
          To make the most of Levli, please allow notifications so we can remind you when it's time to take your medications.
        </p>
      </div>
      {enabled ? (
        <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto border border-green-500/40 mb-4">
          <Bell size={16} /> Notifications Enabled ✓
        </div>
      ) : (
        <button onClick={() => setEnabled(true)}
          className="px-6 py-3 border border-blue-500 text-blue-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto mb-4">
          <Bell size={16} /> Enable Notifications
        </button>
      )}
      <p className="text-gray-500 text-xs mb-6">You can adjust your notification preferences later in Settings.</p>
      <button
        onClick={onContinue}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-2xl transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

function PersonalizeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-3">Let's Personalize Your Experience</h1>
      <p className="text-gray-400 text-base leading-relaxed mb-6">
        Answer a few quick questions to help us tailor Levli to your specific needs.
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