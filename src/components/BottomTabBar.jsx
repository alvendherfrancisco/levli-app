import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Syringe, CalendarDays, BarChart3, ClipboardList, User } from "lucide-react";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/shots", label: "Shots", icon: Syringe },
  { path: "/history", label: "History", icon: CalendarDays },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/journal", label: "Journal", icon: ClipboardList },
  { path: "/profile", label: "Profile", icon: User },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <>
      {/* Mobile: bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-gray-100 dark:border-white/[0.07] pb-safe z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-[#9A9DAE]"
                }`}
                style={isActive ? { textShadow: undefined } : undefined}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={isActive ? { filter: "drop-shadow(0 0 6px rgba(91,141,239,0.5))" } : undefined}
                />
                {isActive && <span className="text-[11px] font-semibold">{tab.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white dark:bg-card border-r border-gray-100 dark:border-white/[0.07] z-40 pt-8 pb-6 px-4">
        <div className="mb-8 px-2">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Dosely</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-[#9A9DAE] hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-[#E8E9F0]"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}