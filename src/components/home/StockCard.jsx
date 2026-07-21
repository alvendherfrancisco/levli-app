import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { StockTileIcon } from "@/components/levli/MetricIcons";

/**
 * Inventory / refill status at a glance — tappable through to the Stock page.
 */
export default function StockCard() {
  const { inventory } = useAppState();
  const active = (inventory || []).filter((i) => i.status === "active" || !i.status);

  const low = active.filter((i) => i.remaining_quantity != null && i.remaining_quantity <= 2);
  const today = new Date();
  const expiringSoon = active.filter((i) => {
    if (!i.expiry_date) return false;
    const d = new Date(i.expiry_date);
    const days = Math.round((d - today) / 86400000);
    return days >= 0 && days <= (i.expiry_warning_days || 14);
  });

  let statusText = "All stocked";
  let statusTone = "text-green-600";
  if (active.length === 0) {
    statusText = "Nothing tracked yet";
    statusTone = "text-gray-400";
  } else if (low.length > 0) {
    statusText = `${low.length} running low`;
    statusTone = "text-amber-600";
  } else if (expiringSoon.length > 0) {
    statusText = `${expiringSoon.length} expiring soon`;
    statusTone = "text-amber-600";
  }

  return (
    <Link
      to="/inventory"
      className="block mx-4 mb-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 animate-card-in active:scale-[0.99] transition-transform"
      style={{ animationDelay: "60ms" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StockTileIcon size={32} />
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Stock</h3>
            <p className={`text-xs ${statusTone}`}>{statusText}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
      </div>
      {active.length === 0 ? (
        <div className="bg-teal-50 rounded-xl p-3 border border-teal-100/50">
          <p className="text-sm text-teal-600">Track your pens and vials so you never run out.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {active.slice(0, 3).map((i) => {
            const isLow = i.remaining_quantity != null && i.remaining_quantity <= 2;
            return (
              <span
                key={i.id}
                className={`text-xs rounded-full px-2.5 py-1 border font-medium ${
                  isLow
                    ? "bg-amber-50 text-amber-600 border-amber-100/60"
                    : "bg-teal-50 text-teal-600 border-teal-100/60"
                }`}
              >
                {i.product_name} · {i.remaining_quantity ?? "—"} {i.quantity_unit || "doses"}
              </span>
            );
          })}
          {active.length > 3 && <span className="text-xs text-gray-400 px-1 py-1">+{active.length - 3} more</span>}
        </div>
      )}
    </Link>
  );
}