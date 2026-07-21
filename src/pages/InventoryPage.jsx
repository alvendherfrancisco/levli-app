import React, { useState, useMemo } from "react";
import { Plus, AlertTriangle, Trash2, ChevronRight, Thermometer } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/lib/AppState";
import InventoryModal from "@/components/modals/InventoryModal";
import { todayKey, calendarDaysBetween } from "@/lib/dateUtils";
import { toast } from "sonner";
import { PackageIcon } from "@/components/onboarding/LevliIcons";

export default function InventoryPage() {
  const { inventory, deleteInventory, addStorageLog, storageLogs } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [storageModalFor, setStorageModalFor] = useState(null);
  const [excursion, setExcursion] = useState(false);
  const [storageNote, setStorageNote] = useState("");
  const today = todayKey();

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (i) => { setEditing(i); setModalOpen(true); };
  const handleDelete = async (id) => { if (!confirm("Remove this inventory item?")) return; await deleteInventory(id); toast.success("Removed"); };
  const openStorageLog = (item) => { setStorageModalFor(item); setExcursion(false); setStorageNote(""); };
  const saveStorageLog = async () => {
    if (!storageModalFor) return;
    await addStorageLog({ inventory_id: storageModalFor.id || undefined, product_name: storageModalFor.product_name, logged_date: today, temperature_excursion: excursion, notes: storageNote });
    toast.success("Storage log saved");
    setStorageModalFor(null);
  };

  const itemsWithStatus = useMemo(() => {
    return inventory.map((i) => {
      const warningDays = i.expiry_warning_days ?? 14;
      let daysToExpiry = null, isExpired = false, isExpiringSoon = false;
      if (i.expiry_date) { daysToExpiry = calendarDaysBetween(today, i.expiry_date); isExpired = daysToExpiry < 0; isExpiringSoon = daysToExpiry >= 0 && daysToExpiry <= warningDays; }
      const isLow = i.remaining_quantity != null && i.starting_quantity != null && i.remaining_quantity <= 2;
      return { ...i, daysToExpiry, isExpired, isExpiringSoon, isLow };
    });
  }, [inventory, today]);

  const productStorageLogs = (productId) => storageLogs.filter((s) => s.inventory_id === productId || s.product_name === (inventory.find((i) => i.id === productId)?.product_name));

  return (
    <div className="min-h-screen w-full">
      <TopBar title="Inventory" subtitle="Stock & expiry tracking" />

      <div className="max-w-3xl mx-auto px-4 pb-32">
        {itemsWithStatus.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100/80 dark:border-white/[0.04] text-center">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50"><PackageIcon size={64} /></div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">No inventory tracked yet.</p>
            <button onClick={openNew} className="px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto text-sm">
              <Plus size={18} /> Add Product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {itemsWithStatus.map((i) => (
              <div key={i.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openEdit(i)} className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-gray-800 dark:text-white break-words">{i.product_name}</span>
                      {i.status !== "active" && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-500/10 text-gray-500 whitespace-nowrap flex-shrink-0">{i.status}</span>}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      {i.remaining_quantity != null && i.starting_quantity != null && (
                        <div className="flex items-center gap-2"><PackageIcon size={16} /> {i.remaining_quantity} / {i.starting_quantity} {i.quantity_unit || "doses"} remaining</div>
                      )}
                      {i.lot_number && <div className="text-xs">Lot: {i.lot_number}</div>}
                      {i.expiry_date && (
                        <div className={`text-xs flex items-center gap-1 ${i.isExpired ? "text-red-500" : i.isExpiringSoon ? "text-amber-500" : "text-gray-400"}`}>
                          {i.isExpired ? <><AlertTriangle size={12} /> Expired</> : i.isExpiringSoon ? <><AlertTriangle size={12} /> Expires in {i.daysToExpiry}d</> : `Expires ${i.expiry_date}`}
                        </div>
                      )}
                      {i.storage_location && <div className="text-xs">Stored: {i.storage_location}</div>}
                    </div>
                  </button>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button onClick={() => openEdit(i)} className="text-gray-400 hover:text-indigo-600"><ChevronRight size={20} /></button>
                    <button onClick={() => openStorageLog(i)} className="text-gray-400 hover:text-amber-500"><Thermometer size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                {productStorageLogs(i.id).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/[0.08]">
                    <p className="text-[11px] text-gray-400 mb-1">Storage logs</p>
                    {productStorageLogs(i.id).slice(0, 3).map((s) => (
                      <div key={s.id} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        {s.temperature_excursion && <AlertTriangle size={11} className="text-amber-500" />}
                        {s.logged_date}{s.notes ? ` — ${s.notes}` : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openNew}
        className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 transition-all active:scale-95 text-sm px-5 py-3.5">
        <Plus size={18} /> Add Product
      </button>

      <InventoryModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} editing={editing} />

      {storageModalFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setStorageModalFor(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Storage Log — {storageModalFor.product_name}</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={excursion} onChange={(e) => setExcursion(e.target.checked)} className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1"><Thermometer size={16} className="text-amber-500" /> Temperature excursion observed</span>
            </label>
            <textarea value={storageNote} onChange={(e) => setStorageNote(e.target.value)} rows={3} placeholder="Notes (optional)"
              className="w-full border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 mb-4" />
            <button onClick={saveStorageLog} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold">Save Log</button>
          </div>
        </div>
      )}
    </div>
  );
}