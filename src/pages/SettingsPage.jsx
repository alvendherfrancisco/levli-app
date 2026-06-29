import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Moon, Lock, Mail, Bell, RotateCcw, Database, FileText, MessageSquare, ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useAppState();
  const [requireAuth, setRequireAuth] = useState(false);

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full transition-colors relative ${value ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  const MenuItem = ({ icon, label }) => (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings toggles */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">Settings</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Dark Mode</span>
            </div>
            <Toggle value={darkMode} onChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Require Authentication</span>
            </div>
            <Toggle value={requireAuth} onChange={setRequireAuth} />
          </div>
        </div>
      </div>

      {/* General */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">General</p>
        <div className="bg-white rounded-2xl px-4 shadow-sm border border-gray-100 divide-y divide-gray-100">
          <MenuItem icon={<Mail size={18} className="text-gray-500" />} label="Contact Us" />
          <MenuItem icon={<Bell size={18} className="text-gray-500" />} label="Notifications" />
          <MenuItem icon={<RotateCcw size={18} className="text-gray-500" />} label="Restore Purchases" />
          <MenuItem icon={<Database size={18} className="text-gray-500" />} label="Backup & Restore" />
        </div>
      </div>

      {/* Policy */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">Policy and application terms</p>
        <div className="bg-white rounded-2xl px-4 shadow-sm border border-gray-100 divide-y divide-gray-100">
          <MenuItem icon={<FileText size={18} className="text-gray-500" />} label="Privacy policy" />
          <MenuItem icon={<FileText size={18} className="text-gray-500" />} label="Terms and conditions" />
        </div>
      </div>

      {/* Feedback */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl px-4 shadow-sm border border-gray-100">
          <MenuItem icon={<MessageSquare size={18} className="text-gray-500" />} label="Leave feedback" />
        </div>
      </div>
    </div>
  );
}