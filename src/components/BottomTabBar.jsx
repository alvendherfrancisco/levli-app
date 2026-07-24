import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";
import {
  HomeIcon, ShotsIcon, HistoryIcon, InsightsIcon,
  MedsIcon, StockIcon, JournalIcon, ProfileIcon,
} from "@/components/NavIcons";

const desktopTabs = [
  { path: "/", label: "Home", Icon: HomeIcon },
  { path: "/shots", label: "Shots", Icon: ShotsIcon },
  { path: "/medications", label: "Meds", Icon: MedsIcon },
  { path: "/inventory", label: "Stock", Icon: StockIcon },
  { path: "/history", label: "History", Icon: HistoryIcon },
  { path: "/insights", label: "Insights", Icon: InsightsIcon },
  { path: "/journal", label: "Journal", Icon: JournalIcon },
  { path: "/profile", label: "Profile", Icon: ProfileIcon },
];

const mobileTabs = [
  { path: "/", label: "Home", Icon: HomeIcon },
  { path: "/shots", label: "Shots", Icon: ShotsIcon },
  { path: "/history", label: "History", Icon: HistoryIcon },
  { path: "/insights", label: "Insights", Icon: InsightsIcon },
];

const moreOptions = [
  { path: "/medications", label: "Meds", Icon: MedsIcon },
  { path: "/inventory", label: "Stock", Icon: StockIcon },
  { path: "/journal", label: "Journal", Icon: JournalIcon },
  { path: "/profile", label: "Profile", Icon: ProfileIcon },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Mobile: floating bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-2.5 mb-2.5 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex items-stretch justify-around px-1 py-1.5">
            {mobileTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.Icon;
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
                    <Icon size={18} filled={isActive} className={isActive ? "text-white" : "text-gray-400"} />
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
            {/* More button */}
            <button
              onClick={() => setShowMore(true)}
              className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 rounded-xl transition-all flex-1 min-w-0 active:scale-90"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-transparent">
                <MoreHorizontal size={18} strokeWidth={1.8} className="text-gray-400" />
              </div>
              <span className="text-[9px] font-medium leading-none text-gray-400">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* More modal (mobile) */}
      {showMore && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setShowMore(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-t-3xl w-full max-w-lg mx-0 sm:mx-4 p-5 pb-9 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">More</h2>
              <button onClick={() => setShowMore(false)} aria-label="Close">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {moreOptions.map((opt) => {
                const isActive = location.pathname === opt.path;
                const Icon = opt.Icon;
                return (
                  <button
                    key={opt.path}
                    onClick={() => {
                      navigate(opt.path);
                      setShowMore(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-all active:scale-95 ${
                      isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={22} filled={isActive} className={isActive ? "text-indigo-600" : "text-gray-500"} />
                    <span className="font-medium text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 z-40 pt-8 pb-6 px-4">
        <div className="mb-8 px-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Levli</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {desktopTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.Icon;
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
                <Icon size={20} filled={isActive} className={isActive ? "text-indigo-600" : "text-gray-500"} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}