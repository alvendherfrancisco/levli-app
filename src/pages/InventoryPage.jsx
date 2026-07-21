import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Package, AlertTriangle, Trash2, ChevronRight, Thermometer } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import InventoryModal from "@/components/modals/InventoryModal";
import { todayKey, calendarDaysBetween } from "@/lib/dateUtils";
import { toast } from "sonner";
import { PackageIcon } from "@/components/onboarding/LevliIcons";
import { MascotEmptyState } from "@/components/levli/LevliUI";
import { EmptyInventoryIllustration } from "@/components/levli/LevliIllustrations";

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

  const handleDelete = async (id) => {
    if (!confirm("Remove this inventory item?")) return;
    await deleteInventory(id);
    toast.success("Inventory item removed");
  };

  const openStorageLog = (item) => {
    setStorageModalFor(item);
    setExcursion(false);
    setStorageNote("");
  };

  const saveStorageLog = async () => {
    if (!storageModalFor) return;
    await addStorageLog({
      inventory_id: storageModalFor.id || undefined,
      product_name: storageModalFor.product_name,
      logged_date: today,
      temperature_excursion: excursion,
      notes: storageNote,
    });
    toast.success("Storage log saved");
    setStorageModalFor(null);
  };

  const itemsWithStatus = useMemo(() => {
    return inventory.map((i) => {
      const warningDays = i.expiry_warning_days ?? 14;
      let daysToExpiry = null;
      let isExpired = false;
      let isExpiringSoon = false;
      if (i.expiry_date) {
        daysToExpiry = calendarDaysBetween(today, i.expiry_date);
        isExpired = daysToExpiry < 0;
        isExpiringSoon = daysToExpiry >= 0 && daysToExpiry <= warningDays;
      }
      const isLow = i.remaining_quantity != null && i.starting_quantity != null && i.remaining_quantity <= 2;
      return { ...i, daysToExpiry, isExpired, isExpiringSoon, isLow };
    });
  }, [inventory, today]);

  const productStorageLogs = (productId) =>
    storageLogs.filter((s) => s.inventory_id === productId || s.product_name === (inventory.find((i) => i.id === productId)?.product_name));

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Plus size={18} className="text-indigo-500" /></div></button>
          <Link to="/settings"><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Settings size={18} className="text-gray-500" /></div></Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        <p className="text-xs text-gray-400 mb-4">
          Track product quantities, lot numbers, and expiry dates. Logging a shot for a tracked product decrements the remaining quantity.
        </p>

        {itemsWithStatus.length === 0 ? (
          <MascotEmptyState title="No inventory tracked yet" subtitle="Track your product quantities, lot numbers, and expiry dates." illustration={<EmptyInventoryIllustration />}>
            <button onClick={openNew} className="px-6 py-3.5 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
              <Plus size={18} /> Add product
            </button>
          </MascotEmptyState>
        ) : (
          <div className="space-y-3">
            {itemsWithStatus.map((i) => (
              <div key={i.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openEdit(i)} className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="flex-shrink-0">
                        <PackageIcon size={40} />
                      </div>
                      <span className="font-bold text-gray-800 break-words">{i.product_name}</span>
                      {i.status !== "active" && <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap flex-shrink-0">{i.status}</span>}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 ml-11">
                      {i.remaining_quantity != null && i.starting_quantity != null && (
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-teal-400" />
                          {i.remaining_quantity} / {i.starting_quantity} {i.quantity_unit || "doses"} remaining
                        </div>
                      )}
                      {i.lot_number && <div className="text-xs">Lot: {i.lot_number}</div>}
                      {i.expiry_date && (
                        <div className={`text-xs flex items-center gap-1 ${i.isExpired ? "text-orange-500" : i.isExpiringSoon ? "text-amber-500" : "text-gray-400"}`}>
                          {i.isExpired ? <><AlertTriangle size={12} /> Expired</> : i.isExpiringSoon ? <><AlertTriangle size={12} /> Expires in {i.daysToExpiry}d</> : `Expires ${i.expiry_date}`}
                        </div>
                      )}
                      {i.storage_location && <div className="text-xs">Stored: {i.storage_location}</div>}
                    </div>
                  </button>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button onClick={() => openEdit(i)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><ChevronRight size={18} className="text-gray-400" /></button>
                    <button onClick={() => openStorageLog(i)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><Thermometer size={16} className="text-amber-400" /></button>
                    <button onClick={() => handleDelete(i.id)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all"><Trash2 size={14} className="text-gray-400" /></button>
                  </div>
                </div>
                {productStorageLogs(i.id).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 mb-1">Storage logs</p>
                    {productStorageLogs(i.id).slice(0, 3).map((s) => (
                      <div key={s.id} className="text-xs text-gray-500 flex items-center gap-1">
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
        className="fixed bottom-24 right-5 lg:right-8 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 active:scale-95 transition-all text-sm px-5 py-3">
        <Plus size={18} /> Add Product
      </button>

      <InventoryModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} editing={editing} />

      {/* Storage log modal */}
      {storageModalFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setStorageModalFor(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Storage Log — {storageModalFor.product_name}</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={excursion} onChange={(e) => setExcursion(e.target.checked)} className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-gray-600 flex items-center gap-1"><Thermometer size={16} className="text-amber-500" /> Temperature excursion observed</span>
            </label>
            <textarea value={storageNote} onChange={(e) => setStorageNote(e.target.value)} rows={3} placeholder="Notes (optional)"
              className="w-full border-2 border-gray-200 bg-white text-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors mb-4" />
            <button onClick={saveStorageLog} className="w-full py-3.5 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Save Log</button>
          </div>
        </div>
      )}
    </div>
  );
}