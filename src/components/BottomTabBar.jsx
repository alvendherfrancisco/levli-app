import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Syringe, CalendarDays, BarChart3, ClipboardList, User } from "lucide-react";

const tabs = [
  { path: "/",        label: "Home",    icon: Home },
  { path: "/shots",   label: "Shots",   icon: Syringe },
  { path: "/history", label: "History", icon: CalendarDays },
  { path: "/insights",label: "Insights",icon: BarChart3 },
  { path: "/journal", label: "Journal", icon: ClipboardList },
  { path: "/profile", label: "Profile", icon: User },
];

export default function BottomTabBar() {
  const location = useLocation();
  const activeIdx = tabs.findIndex((t) => t.path === location.pathname);
  const tabRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeIdx];
    if (el) {
      const parent = el.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setPillStyle({ left: rect.left - parentRect.left, width: rect.width });
    }
  }, [activeIdx]);

  return (
    <>
      {/* Mobile: bottom bar with sliding pill */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-warm pb-safe z-40 shadow-warm">
        <div className="relative flex items-center justify-around px-2 py-2">
          {/* Sliding background pill */}
          <span
            className="absolute top-2 h-[calc(100%-16px)] bg-accent-tint rounded-full transition-all duration-200 ease-out pointer-events-none"
            style={{ left: pillStyle.left, width: pillStyle.width }}
          />
          {tabs.map((tab, i) => {
            const isActive = i === activeIdx;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                ref={(el) => (tabRefs.current[i] = el)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors z-10 ${
                  isActive ? "text-accent" : "text-ink-tertiary"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {isActive && <span className="text-[11px] font-semibold">{tab.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop: left side rail */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-surface border-r border-border-warm z-40 pt-8 pb-6 px-4 shadow-warm">
        <div className="mb-8 px-2">
          <span className="text-xl font-bold text-accent">Dosely</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all font-medium text-sm ${
                  isActive
                    ? "bg-accent-tint text-accent"
                    : "text-ink-secondary hover:bg-surface-alt hover:text-ink"
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