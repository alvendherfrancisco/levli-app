import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Syringe, BarChart3, BookOpen } from "lucide-react";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/shots", label: "Shots", icon: Syringe },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/journal", label: "Journal", icon: BookOpen },
];

export default function BottomTabBar() {
  const location = useLocation();
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile: floating pill bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe px-3 pb-3">
        <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100/80 dark:border-white/[0.06]">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const active = isActive(tab.path);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex flex-col items-center justify-center w-16 h-12 rounded-full transition-all duration-300 ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-r border-gray-100/80 dark:border-white/[0.06] z-40 pt-10 pb-6 px-4">
        <div className="mb-10 px-3 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">Levli</span>
        </div>
        <nav className="flex flex-col gap-1.5 flex-1">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}