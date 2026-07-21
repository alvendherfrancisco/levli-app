import React from "react";
import { Link } from "react-router-dom";
import { User, Settings } from "lucide-react";

/**
 * Reusable top bar with greeting/title + Profile + Settings icons.
 * Transparent, sits above the ambient background.
 */
export default function TopBar({ title, subtitle, rightExtra }) {
  return (
    <div className="relative z-20 w-full flex items-center justify-between px-5 pt-6 pb-2">
      <div className="min-w-0">
        {title && <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">{title}</h1>}
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {rightExtra}
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-white/[0.06] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <User size={18} className="text-gray-500 dark:text-gray-400" />
        </Link>
        <Link
          to="/settings"
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-white/[0.06] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Settings size={18} className="text-gray-500 dark:text-gray-400" />
        </Link>
      </div>
    </div>
  );
}