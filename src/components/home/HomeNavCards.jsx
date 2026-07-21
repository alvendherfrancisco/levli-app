import React from "react";
import { Link } from "react-router-dom";
import { Pill, Package, CalendarDays } from "lucide-react";
import { useAppState } from "@/lib/AppState";

/**
 * Home-page navigation cards for Meds / Stock / History.
 * These remain fully functional — tappable through to their existing pages.
 */
export default function HomeNavCards() {
  const { medications, inventory, shots } = useAppState();
  const activeMeds = medications.filter((m) => m.status === "active");
  const activeStock = inventory.filter((i) => i.status === "active");
  const lowStock = activeStock.filter((i) => (i.remaining_quantity ?? 0) <= 3);

  const cards = [
    {
      to: "/medications", Icon: Pill, tint: "bg-indigo-100", iconColor: "text-indigo-500",
      label: "Medications",
      value: activeMeds.length > 0 ? `${activeMeds.length} active` : "Tap to add",
      sub: activeMeds[0]?.medication_name || "View regimen",
    },
    {
      to: "/inventory", Icon: Package, tint: "bg-teal-100", iconColor: "text-teal-500",
      label: "Stock",
      value: activeStock.length > 0 ? `${activeStock.length} items` : "Tap to add",
      sub: lowStock.length > 0 ? `${lowStock.length} low` : "All good",
    },
    {
      to: "/history", Icon: CalendarDays, tint: "bg-orange-100", iconColor: "text-orange-500",
      label: "History",
      value: shots.length > 0 ? `${shots.length} logs` : "No logs",
      sub: shots[0] ? `Last: ${shots[0].medication}` : "View all",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 px-3 mb-4">
      {cards.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 active:scale-[0.98] transition-transform"
        >
          <div className={`w-8 h-8 rounded-lg ${c.tint} flex items-center justify-center mb-2`}>
            <c.Icon size={16} className={c.iconColor} />
          </div>
          <p className="text-xs font-semibold text-gray-700">{c.label}</p>
          <p className="text-[11px] text-gray-400 truncate">{c.value}</p>
          {c.sub && <p className="text-[10px] text-gray-300 truncate">{c.sub}</p>}
        </Link>
      ))}
    </div>
  );
}