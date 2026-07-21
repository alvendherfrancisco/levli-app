import React from "react";
import { Link } from "react-router-dom";
import { Settings, User } from "lucide-react";

/**
 * Top-right icon pair: profile avatar (filled indigo) + settings (ghost).
 * Used on every main page header for always-one-tap account access.
 */
export default function TopIcons({ gap = "gap-2" }) {
  return (
    <div className={`flex items-center ${gap}`}>
      <Link to="/profile" aria-label="Profile">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center active:scale-95 transition-all shadow-sm shadow-indigo-600/20">
          <User size={16} className="text-white" strokeWidth={2.2} />
        </div>
      </Link>
      <Link to="/settings" aria-label="Settings">
        <div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all">
          <Settings size={18} className="text-gray-500" />
        </div>
      </Link>
    </div>
  );
}