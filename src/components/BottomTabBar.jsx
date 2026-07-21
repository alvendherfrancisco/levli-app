import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Syringe, CalendarDays, BarChart3, ClipboardList, User, Pill, Package } from "lucide-react";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/shots", label: "Shots", icon: Syringe },
  { path: "/medications", label: "Meds", icon: Pill },
  { path: "/inventory", label: "Stock", icon: Package },
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-40">
        <div className="flex items-stretch justify-around px-0.5 py-1.5">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-xl transition-all flex-1 min-w-0 ${
                  isActive
                    ? "bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400"
                    : "text-gray-400 dark:text-[#9A9DAE]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={isActive ? { filter: "drop-shadow(0 0 6px rgba(20,184,166,0.5))" } : undefined}
                />
                {isActive && <span className="text-[9px] font-semibold leading-none truncate w-full text-center">{tab.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 pt-8 pb-6 px-4">
        <div className="mb-8 px-2">
          <span className="text-xl font-bold text-teal-600 dark:text-teal-400">Levli</span>
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
                    ? "bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400"
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