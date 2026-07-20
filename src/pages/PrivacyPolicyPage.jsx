import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";

const Section = ({ title, children }) =>
<div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 mb-4">
    <h2 className="text-base font-bold text-gray-800 mb-2">{title}</h2>
    <div className="text-sm text-gray-500 leading-relaxed space-y-2">{children}</div>
  </div>;


export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="w-full flex items-center gap-3 px-5 pt-6 pb-4 bg-[#FAFAFA] sticky top-0 z-30">
        <button onClick={() => navigate(-1)}><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><ChevronLeft size={20} className="text-gray-500" /></div></button>
        <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><ShieldCheck size={20} className="text-indigo-500" /></div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Your data stays yours</p>
            <p className="text-xs text-gray-400">We never sell or share your health data.</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">Last updated: June 30, 2026</p>

        <Section title="1. What Data We Collect">
          <p>When you use Levli, we collect the following personal health data that you voluntarily provide:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Medication shot logs (drug name, dose, date, time, injection site, pain level, notes)</li>
            <li>Daily health metrics (weight, calories, protein, water, fiber, carbohydrates, exercise minutes)</li>
            <li>Progress photos uploaded by you</li>
            <li>Journal entries (text, mood, category, date)</li>
            <li>Profile information (height, goal weight, preferred units, default medication)</li>
            <li>Account information (email address, authentication data)</li>
          </ul>
        </Section>

        <Section title="2. How Your Data Is Stored">
          <p>All data you enter is stored securely in our cloud database and is tied directly to your individual user account. Your data is protected with industry-standard security measures including encrypted connections (HTTPS/TLS).</p>
          <p>Only you can access your own records. We do not share your health data between user accounts.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>Your data is used exclusively to provide and improve the Levli app experience, including:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Displaying your shot history and scheduling your next dose</li>
            <li>Computing estimated medication levels and health trends</li>
            <li>Generating reports and insights within the app</li>
          </ul>
          <p>We do not use your data for advertising or sell it to any third parties — ever.</p>
        </Section>

        <Section title="4. Third-Party Sharing">
          <p>We do <span className="text-gray-800 font-semibold">not</span> sell, rent, or trade your personal or health data to any third party. We do not share your data with advertisers, data brokers, or analytics companies.</p>
          <p>We may use trusted service providers (e.g., cloud hosting) solely to operate the app. These providers are contractually prohibited from using your data for any other purpose.</p>
        </Section>

        <Section title="5. Medical Disclaimer">
          <p>Levli is not a substitute for professional medical care. The information and data tracked in this app are for personal reference only.</p>
          <p className="text-gray-800 font-medium">Only your doctor can diagnose and treat medical problems. Always consult a qualified healthcare professional before making changes to your medication or treatment plan.</p>
        </Section>

        <Section title="6. Data Retention & Deletion">
          <p>Your data is retained for as long as your account is active. You may delete individual records at any time from within the app.</p>
          <p>To request full deletion of your account and all associated data, email us at:</p>
          <p className="text-indigo-600 font-medium mt-1">privacy@levli.app <span className="text-gray-400 text-xs">(placeholder — replace with your actual contact)</span></p>
          <p>We will process deletion requests within 30 days.</p>
        </Section>

        <Section title="7. Contact">
          <p>For any privacy-related questions or concerns, contact us at:</p>
          <p className="text-indigo-600 font-medium mt-1">privacy@levli.app <span className="text-gray-400 text-xs">(placeholder)</span></p>
        </Section>

        <div className="py-6 text-center">
          <p className="text-xs text-gray-400">© 2026 Levli · Placeholder privacy policy</p>
        </div>
      </div>
    </div>);
}