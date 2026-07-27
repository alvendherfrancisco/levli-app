import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Syringe, Pill, MoreHorizontal, X } from "lucide-react";
import IonIcon from "@/components/IonIcon";
import { ShotsFilledIcon, MedsFilledIcon } from "@/components/FilledIcons";

const TABS = [
  { path: "/", label: "Home", kind: "ion", outline: "home-outline", active: "home" },
  { path: "/shots", label: "Shots", kind: "shots" },
  { path: "/history", label: "History", kind: "ion", outline: "calendar-outline", active: "calendar" },
  { path: "/insights", label: "Insights", kind: "ion", outline: "bar-chart-outline", active: "bar-chart" },
  { path: "/medications", label: "Meds", kind: "meds" },
  { path: "/inventory", label: "Stock", kind: "ion", outline: "cube-outline", active: "cube" },
  { path: "/journal", label: "Journal", kind: "ion", outline: "document-text-outline", active: "document-text" },
  { path: "/profile", label: "Profile", kind: "ion", outline: "person-outline", active: "person" },
];

const BAR_PATHS = ["/", "/shots", "/history", "/insights", "/journal"];
const MODAL_PATHS = ["/medications", "/inventory", "/profile"];

function TabIcon({ tab, size, active, className }) {
  if (tab.kind === "ion") {
    return <IonIcon name={active ? tab.active : tab.outline} size={size} className={className} />;
  }
  if (tab.kind === "shots") {
    return active
      ? <ShotsFilledIcon size={size} className={className} />
      : <Syringe size={size} strokeWidth={1.8} className={className} />;
  }
  if (tab.kind === "meds") {
    return active
      ? <MedsFilledIcon size={size} className={className} />
      : <Pill size={size} strokeWidth={1.8} className={className} />;
  }
  return null;
}

export default function BottomTabBar() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const barTabs = TABS.filter((t) => BAR_PATHS.includes(t.path));
  const modalTabs = TABS.filter((t) => MODAL_PATHS.includes(t.path));
  const moreActive = MODAL_PATHS.includes(location.pathname) || moreOpen;

  return (
    <>
      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 pt-8 pb-6 px-4">
        <div className="mb-8 px-2">
          <span className="text-xl font-bold text-teal-600 dark:text-teal-400">Levli</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map((tab) => {
            const isActive = location.pathname === tab.path;
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
                <TabIcon tab={tab} size={20} active={isActive} className={isActive ? "text-teal-600 dark:text-teal-400" : ""} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile: bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-40">
        <div className="flex items-stretch justify-around px-0.5 py-1.5">
          {barTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
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
                <TabIcon
                  tab={tab}
                  size={22}
                  active={isActive}
                  className={isActive ? "text-teal-600 dark:text-teal-400" : ""}
                />
                {isActive && <span className="text-[9px] font-semibold leading-none truncate w-full text-center">{tab.label}</span>}
              </Link>
            );
          })}
          {/* More button (three dots) */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-xl transition-all flex-1 min-w-0 ${
              moreActive
                ? "bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400"
                : "text-gray-400 dark:text-[#9A9DAE]"
            }`}
          >
            <MoreHorizontal
              size={22}
              strokeWidth={moreActive ? 2.6 : 1.8}
              className={moreActive ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}
              style={moreActive ? { filter: "drop-shadow(0 0 6px rgba(20,184,166,0.5))" } : undefined}
            />
            {moreActive && <span className="text-[9px] font-semibold leading-none">More</span>}
          </button>
        </div>
      </div>

      {/* Mobile: More sheet */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl w-full max-w-sm pb-safe animate-in slide-in-from-bottom shadow-2xl">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-base font-semibold text-gray-800 dark:text-[#E8E9F0]">More</h2>
              <button onClick={() => setMoreOpen(false)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="px-3 pb-6 pt-2 space-y-1">
              {modalTabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                      isActive
                        ? "bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400"
                        : "text-gray-600 dark:text-[#E8E9F0] hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <TabIcon
                      tab={tab}
                      size={24}
                      active={isActive}
                      className={isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-[#9A9DAE]"}
                    />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}