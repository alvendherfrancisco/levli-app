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
      {/* Mobile: floating bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-2.5 mb-2.5 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex items-stretch justify-around px-1 py-1.5">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-xl transition-all flex-1 min-w-0 active:scale-90"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? "bg-indigo-600" : "bg-transparent"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-medium leading-none truncate ${
                      isActive ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 z-40 pt-8 pb-6 px-4">
        <div className="mb-8 px-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Levli</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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