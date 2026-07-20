import React, { useState, useEffect } from "react";
import { Plus, Package, Trash2, AlertTriangle, X, Save } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { MEDICATIONS } from "@/lib/medicationData";
import { DOSE_UNITS } from "@/lib/units";
import { toast } from "sonner";

function InventoryModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    product_name: "", lot_number: "", expiry_date: "",
    starting_quantity: "", quantity_unit: "doses",
    storage_location: "", opened_date: "",
  });

  useEffect(() => {
    if (open) setForm({ product_name: "", lot_number: "", expiry_date: "", starting_quantity: "", quantity_unit: "doses", storage_location: "", opened_date: "" });
  }, [open]);

  if (!open) return null;
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.product_name) { toast.error("Product name required"); return; }
    const qty = parseFloat(form.starting_quantity);
    if (!qty || qty <= 0) { toast.error("Enter a valid starting quantity"); return; }
    onSave({ ...form, starting_quantity: qty });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[480px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0]">Add Inventory Item</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Product Name</label>
            <input list="med-list" type="text" value={form.product_name} onChange={(e) => set("product_name", e.target.value)} placeholder="e.g. Ozempic®"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            <datalist id="med-list">{MEDICATIONS.map((m) => <option key={m} value={m} />)}</datalist>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Starting Quantity</label>
              <input type="number" value={form.starting_quantity} min="1" step="1"
                onChange={(e) => set("starting_quantity", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Unit</label>
              <select value={form.quantity_unit} onChange={(e) => set("quantity_unit", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none">
                {["doses", "pens", "vials", "mL", "tablets", "patches"].map((u) => <option key={u} value={u} className="dark:bg-[#1e2130]">{u}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Lot Number</label>
              <input type="text" value={form.lot_number} onChange={(e) => set("lot_number", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)}
                className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Storage Location</label>
            <input type="text" value={form.storage_location} onChange={(e) => set("storage_location", e.target.value)} placeholder="e.g. Refrigerator"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-base outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Opened Date</label>
            <input type="date" value={form.opened_date} onChange={(e) => set("opened_date", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] dark:[color-scheme:dark] rounded-xl px-4 py-3 text-base outline-none" />
          </div>
        </div>
        <div className="px-5 pb-8 pt-2">
          <button onClick={handleSave}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [excursionItem, setExcursionItem] = useState(null);
  const [excursionNotes, setExcursionNotes] = useState("");
  const today = new Date(); today.setHours(0,0,0,0);

  const handleSave = async (data) => {
    try {
      await addInventoryItem(data);
      toast.success("Inventory item added");
      setShowModal(false);
    } catch { toast.error("Failed to add item"); }
  };

  const daysUntilExpiry = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    const exp = new Date(y, m - 1, d);
    return Math.round((exp - today) / 86400000);
  };

  const logExcursion = async () => {
    if (!excursionItem) return;
    await updateInventoryItem(excursionItem.id, {
      temperature_excursion: true,
      excursion_notes: excursionNotes || excursionItem.excursion_notes || "",
    });
    toast.success("Temperature excursion logged");
    setExcursionItem(null);
    setExcursionNotes("");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <button onClick={() => setShowModal(true)}><Plus size={24} className="text-gray-600 dark:text-gray-400" /></button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        {inventory.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800 mt-4">
            <Package size={36} className="mx-auto mb-3 text-gray-300 dark:text-white/20" />
            <p className="text-sm text-gray-400 dark:text-[#9A9DAE]">No inventory items yet. Track your medication stock, lot numbers, and expiry dates here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inventory.map((item) => {
              const daysLeft = daysUntilExpiry(item.expiry_date);
              const expiringSoon = daysLeft != null && daysLeft <= 30 && daysLeft >= 0;
              const expired = daysLeft != null && daysLeft < 0;
              const lowStock = item.remaining_quantity <= 2;
              return (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-[#E8E9F0] truncate">{item.product_name}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-400">
                        <span>{item.remaining_quantity}/{item.starting_quantity} {item.quantity_unit} left</span>
                        {item.lot_number && <span>Lot: {item.lot_number}</span>}
                        {item.storage_location && <span>📍 {item.storage_location}</span>}
                      </div>
                      {item.expiry_date && (
                        <div className="mt-1">
                          {expired ? (
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1"><AlertTriangle size={12} /> Expired {item.expiry_date}</span>
                          ) : expiringSoon ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠ Expires in {daysLeft}d ({item.expiry_date})</span>
                          ) : (
                            <span className="text-xs text-gray-400">Expires {item.expiry_date}</span>
                          )}
                        </div>
                      )}
                      {lowStock && item.remaining_quantity > 0 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium block mt-1">Low stock — consider reordering</span>
                      )}
                      {item.temperature_excursion && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} /> Temperature excursion logged{item.excursion_notes ? `: ${item.excursion_notes}` : ""}
                        </span>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setExcursionItem(item); setExcursionNotes(item.excursion_notes || ""); }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          Log temp excursion
                        </button>
                        <button onClick={async () => {
                          await updateInventoryItem(item.id, { remaining_quantity: item.remaining_quantity + 1 });
                          toast.success("Quantity adjusted");
                        }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-[#9A9DAE]">
                          +1 unit
                        </button>
                        <button onClick={async () => {
                          if (!confirm("Delete this inventory item?")) return;
                          await deleteInventoryItem(item.id);
                          toast.success("Item deleted");
                        }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-5 lg:right-8 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-teal-700 transition-colors text-sm px-5 py-3">
        <Plus size={18} /> Add Item
      </button>

      <InventoryModal open={showModal} onClose={() => setShowModal(false)} onSave={handleSave} />

      {excursionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setExcursionItem(null)} />
          <div className="relative bg-white dark:bg-[#0f1117] rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#E8E9F0] mb-3">Log Temperature Excursion</h2>
            <p className="text-sm text-gray-400 mb-3">Record that {excursionItem.product_name} may have been exposed to a temperature outside its storage range.</p>
            <textarea value={excursionNotes} onChange={(e) => setExcursionNotes(e.target.value)} placeholder="e.g. Left out of fridge for 4 hours"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#E8E9F0] rounded-xl px-4 py-3 text-sm resize-none h-20 outline-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setExcursionItem(null)} className="flex-1 py-3 bg-gray-100 dark:bg-white/[0.07] rounded-xl font-semibold text-gray-500">Cancel</button>
              <button onClick={logExcursion} className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-semibold">Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}