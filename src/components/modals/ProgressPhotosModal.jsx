import React, { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ProgressPhotosModal({ open, onClose, photos, onAddPhoto }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await onAddPhoto(file_url);
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f1117] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:mx-4 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Progress Photos</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Plus size={40} className="text-gray-300 dark:text-white/20" />
              <p className="text-gray-500 dark:text-[#9A9DAE] text-center">No progress photos yet. Add your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {photos.map((p) => {
                const fd = (() => {
                  const [y, m, d] = p.isoDate.split("-").map(Number);
                  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  return { month: `${months[m-1]} ${d}`, year: String(y) };
                })();
                return (
                  <div key={p.isoDate} className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/[0.08]">
                    <img src={p.url} alt={`Progress ${p.isoDate}`} className="w-full object-cover aspect-square" />
                    <div className="text-center py-2 bg-gray-50 dark:bg-white/[0.05]">
                      <p className="text-xs font-semibold text-gray-700 dark:text-[#E8E9F0]">{fd.month}</p>
                      <p className="text-[10px] text-gray-400 dark:text-[#9A9DAE]">{fd.year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <label className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-60">
            <Plus size={18} /> Add Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}