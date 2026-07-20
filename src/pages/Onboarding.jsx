import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import PhoneMockup from "@/components/onboarding/PhoneMockup";
import QuizScreen from "@/components/onboarding/QuizScreen";
import UnitsStep from "@/components/onboarding/UnitsStep";
import { Bell, Droplets, ShieldCheck, Calendar, User } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { MiniHomeScreen, MiniShotsScreen, MiniInsightsScreen, MiniCalendarScreen, MiniJournalScreen, MiniProfileScreen } from "@/components/onboarding/MiniScreens";
import { MEDICATIONS } from "@/lib/medicationData";

const TOTAL_STEPS = 18;
const PRIVACY_POLICY_VERSION = "1.0";

// Check if a birthdate indicates a minor (under 18)
function isMinor(birthdate) {
  if (!birthdate) return false;
  const [y, m, d] = birthdate.split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { setProfile, profile, recordConsent, recordParentalConsent } = useAppState();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [units, setUnits] = useState({ weight_unit: "lb", height_unit: "in", liquid_unit: "oz" });
  const [birthdate, setBirthdate] = useState("");
  const [gdprConsented, setGdprConsented] = useState(false);
  const [parentalConsentName, setParentalConsentName] = useState("");

  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />;
  }

  const handleQuizAnswer = (questionKey, answers) => {
    setQuizAnswers((prev) => ({ ...prev, [questionKey]: answers }));
  };

  const next = async () => {
    // Block on consent step if not consented
    if (step === 9 && !gdprConsented) return;
    // Block on birthdate step if empty
    if (step === 10 && !birthdate) return;
    // Block on parental consent step if minor and no guardian name
    if (step === 11 && isMinor(birthdate) && !parentalConsentName.trim()) return;

    // Skip parental consent step (11) for non-minors
    let nextStep = step + 1;
    if (step === 10 && !isMinor(birthdate)) nextStep = 12;

    if (nextStep < TOTAL_STEPS) {
      setStep(nextStep);
    } else {
      // Record consents
      if (gdprConsented) await recordConsent(PRIVACY_POLICY_VERSION);
      if (isMinor(birthdate) && parentalConsentName.trim()) await recordParentalConsent(parentalConsentName);

      // Derive default medication from quiz answer
      const medAnswers = quizAnswers["medication"] || [];
      let defaultMed = "Ozempic®";
      if (medAnswers.length && MEDICATIONS.includes(medAnswers[0])) {
        defaultMed = medAnswers[0];
      } else if (medAnswers.some(a => a.includes("Tirzepatide"))) defaultMed = "Zepbound®";
      else if (medAnswers.some(a => a.includes("Semaglutide"))) defaultMed = "Ozempic®";

      const freqAnswers = quizAnswers["frequency"] || [];
      let daysBetween = "7";
      if (freqAnswers.some(a => a.includes("two weeks"))) daysBetween = "14";
      else if (freqAnswers.some(a => a.includes("monthly"))) daysBetween = "30";

      await setProfile({ ...profile, default_medication: defaultMed, days_between: daysBetween, ...units, birthdate, onboarding_completed: true });
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
        <ConsentStep consented={gdprConsented} setConsented={setGdprConsented} />
      )}
      {step === 10 && (
        <BirthdateStep birthdate={birthdate} setBirthdate={setBirthdate} />
      )}
      {step === 11 && isMinor(birthdate) && (
        <ParentalConsentStep guardianName={parentalConsentName} setGuardianName={setParentalConsentName} />
      )}
      {step === 12 && (
        <QuizScreen
          question="What results matter most to you?"
          subtitle="Select all that apply to personalize your experience"
          multiSelect
          options={[
            "Achieving my weight management goals",
            "Never missing my doses",
            "Tracking and managing side effects",
            "Properly rotating injection sites",
            "Understanding my medication exposure",
            "Sharing progress with my healthcare provider",
            "Tracking my nutrition and hydration",
          ]}
        />
      )}
      {step === 13 && (
        <QuizScreen
          question="What challenges do you face?"
          subtitle="Select all that apply so we can help you succeed"
          multiSelect
          options={[
            "Forgetting to take my doses",
            "Managing nausea and other side effects",
            "Anxiety about self-injecting",
            "Adapting to appetite changes",
            "Logging my injection times",
            "Tracking progress effectively",
            "Managing medication costs",
          ]}
        />
      )}
      {step === 14 && (
        <QuizScreen
          question="Which medication are you taking?"
          subtitle="Select all that apply"
          multiSelect
          options={MEDICATIONS.slice(0, 24)}
          onAnswerChange={(answers) => handleQuizAnswer("medication", answers)}
        />
      )}
      {step === 15 && (
        <QuizScreen
          question="How often do you take your medication?"
          subtitle="Select all that apply"
          multiSelect
          options={[
            "Once weekly",
            "Every two weeks",
            "Once monthly",
            "Daily",
            "Logging my current dose stage (as directed by my prescriber)",
            "Irregular schedule due to side effects",
          ]}
          onAnswerChange={(answers) => handleQuizAnswer("frequency", answers)}
        />
      )}
      {step === 16 && <UnitsStep units={units} setUnits={setUnits} />}
      {step === 17 && <FinalStep />}
    </OnboardingScreen>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <Droplets size={32} className="text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Welcome to Levli</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
        A companion app for logging your medication journey. Track shots, progress, and notes to share with your healthcare provider.
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Never Miss a Shot Again</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
        Log your shots and keep a complete record you can share with your healthcare provider. (Reminders are not active yet.)
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Visualize Your Success</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
        Track your weight entries over time with charts and progress photos.
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Advanced Medication Tracking</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
        See an illustrative chart of relative medication exposure over time. This is a rough estimate, not a precise measurement.
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Complete History & Calendar</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
        Navigate your entire medication journey. View any day's shots, weight, nutrition, and side effects at a glance.
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Your Personal Health Journal</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Your Health Profile</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Never Miss a Shot Again</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
        Allowing notifications lets Levli send you reminders in the future. Reminders are not active yet — you can still log your shots and review them any time.
      </p>
      <div className="bg-gray-900 rounded-2xl p-6 mb-4 border border-gray-800">
        <div className="w-14 h-14 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={28} className="text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Allow Notifications</h3>
        <p className="text-gray-400 text-sm">
          Allowing notifications now means Levli can send you reminders once that feature launches. You can adjust this later in Settings.
        </p>
      </div>
      {enabled ? (
        <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto border border-green-500/40 mb-4">
          <Bell size={16} /> Notifications Enabled ✓
        </div>
      ) : (
        <button onClick={() => setEnabled(true)}
          className="px-6 py-3 border border-teal-500 text-teal-400 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto mb-4">
          <Bell size={16} /> Enable Notifications
        </button>
      )}
      <p className="text-gray-500 text-xs mb-6">You can adjust your notification preferences later in Settings.</p>
      <button onClick={onContinue} className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg rounded-2xl transition-colors">
        Continue
      </button>
    </div>
  );
}

function PersonalizeStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Let's Personalize Your Experience</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
        Answer a few quick questions to help us tailor Levli to your specific needs.
      </p>
      <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
        <Droplets size={64} className="text-white" />
      </div>
      <p className="text-gray-400 text-sm">Your answers will help us provide you with the best experience possible.</p>
    </div>
  );
}

function ConsentStep({ consented, setConsented }) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <ShieldCheck size={32} className="text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Your Health Data Consent</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 text-left">
        Levli stores health information you log — including medications, doses, side effects, weight, and journal entries. Under GDPR, health data is a "special category" (Article 9) that requires your explicit consent.
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 text-left">
        By proceeding, you consent to Levli processing your health data to provide and improve your tracking experience. You can delete your data at any time. See our Privacy Policy for details.
      </p>
      <label className="flex items-start gap-3 cursor-pointer w-full bg-gray-900 rounded-2xl p-4 border border-gray-800 text-left mb-4">
        <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="w-5 h-5 mt-0.5 accent-teal-500 flex-shrink-0" />
        <span className="text-sm text-white">I consent to Levli processing my special-category health data as described in the Privacy Policy.</span>
      </label>
      {!consented && <p className="text-xs text-amber-500 mb-4">You must consent to proceed.</p>}
    </div>
  );
}

function BirthdateStep({ birthdate, setBirthdate }) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <Calendar size={32} className="text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Your Date of Birth</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 text-left">
        We use your date of birth to determine whether this account requires parental consent. If you are under 18, a parent or guardian must consent on your behalf.
      </p>
      <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
        className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl px-4 py-3 text-base outline-none focus:border-teal-500 dark:[color-scheme:dark]" />
      {!birthdate && <p className="text-xs text-amber-500 mt-3">Please enter your date of birth to continue.</p>}
    </div>
  );
}

function ParentalConsentStep({ guardianName, setGuardianName }) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 mt-4">
        <User size={32} className="text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Parental Consent Required</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 text-left">
        You appear to be under 18. A parent or legal guardian must provide consent for you to use Levli with health data tracking.
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 text-left">Please enter the full name of the parent or guardian consenting on your behalf:</p>
      <input type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Parent / guardian full name"
        className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl px-4 py-3 text-base outline-none focus:border-teal-500" />
      {!guardianName.trim() && <p className="text-xs text-amber-500 mt-3">Guardian name is required to proceed.</p>}
      <p className="text-gray-500 text-xs mt-4">By entering their name, your guardian confirms they consent to Levli processing your health data under GDPR Article 9.</p>
    </div>
  );
}

function FinalStep() {
  return (
    <div className="flex flex-col items-center text-center flex-1 justify-center">
      <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center mb-6">
        <Droplets size={40} className="text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">You're All Set!</h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
        Your personalized medication tracking experience is ready. Let's start your journey to better health.
      </p>
    </div>
  );
}