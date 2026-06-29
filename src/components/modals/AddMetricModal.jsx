import React, { useState, useRef } from "react";
import { X, Camera, Image, Trash2, Save } from "lucide-react";

// Exercise modal - centered dialog style
function ExerciseModal({ open, onClose, value, onSave, onDelete }) {
  const [val, setVal] = useState(value && value !== "0" ? value : "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Exercise</h2>
        <label className="text-sm text-gray-400 mb-2 block">Duration</label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="0"
            className="flex-1 outline-none text-lg font-medium"
            autoFocus
          />
          <span className="text-gray-400 text-sm ml-2">minutes</span>
        </div>
        <div className="flex items-center justify-end gap-6">
          <button onClick={() => { onDelete(); onClose(); }} className="text-red-500 font-semibold text-base">Delete</button>
          <button onClick={() => { onSave(val); onClose(); }} className="text-blue-600 font-semibold text-base">Save</button>
        </div>
      </div>
    </div>
  );
}

// Progress photo modal
function ProgressModal({ open, onClose, value, onSave, onDelete }) {
  const hasExisting = value && value !== "–";
  const [imgUrl, setImgUrl] = useState(hasExisting ? value : null);
  const fileRef = useRef();

  if (!open) return null;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUrl(URL.createObjectURL(file));
  };

  const isEdit = hasExisting;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Progress Picture" : "Add Progress Picture"}</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
        </div>
        <div className="px-5 pb-4">
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center" style={{ minHeight: 220 }}>
            {imgUrl ? (
              <img src={imgUrl} alt="Progress" className="w-full object-cover max-h-64" />
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-gray-300">
                <Camera size={48} />
                <p className="text-sm text-gray-400">No image selected.</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => fileRef.current?.click()}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Camera size={18} /> Camera
            </button>
            <button onClick={() => fileRef.current?.click()}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Image size={18} /> Gallery
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>
        {isEdit ? (
          <div className="flex gap-3 px-5 pb-8">
            <button onClick={() => { onDelete(); onClose(); }}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Trash2 size={18} /> Delete
            </button>
            <button onClick={() => { onSave(imgUrl || "✓ pic"); onClose(); }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Save size={18} /> Update
            </button>
          </div>
        ) : (
          <div className="px-5 pb-8">
            <button onClick={() => { if (imgUrl) { onSave(imgUrl); onClose(); } }}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 ${imgUrl ? "bg-blue-600 text-white" : "bg-blue-600 text-white opacity-60"}`}>
              <Save size={18} /> Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Generic fallback modal for Weight etc.
function GenericMetricModal({ open, onClose, label, unit, value, onSave }) {
  const [val, setVal] = useState(value && value !== "–" ? value : "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Update {label}</h2>
        <label className="text-sm text-gray-400 mb-2 block">{label}</label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="0"
            className="flex-1 outline-none text-lg font-medium"
            autoFocus
          />
          <span className="text-gray-400 text-sm ml-2">{unit}</span>
        </div>
        <div className="flex items-center justify-end gap-6">
          <button onClick={onClose} className="text-red-500 font-semibold text-base">Cancel</button>
          <button onClick={() => { onSave(val); onClose(); }} className="text-blue-600 font-semibold text-base">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function AddMetricModal({ open, onClose, label, unit, value, onSave, onDelete }) {
  if (label === "Exercise") {
    return <ExerciseModal open={open} onClose={onClose} value={value} onSave={onSave} onDelete={onDelete || (() => onSave("0"))} />;
  }
  if (label === "Progress") {
    return <ProgressModal open={open} onClose={onClose} value={value} onSave={onSave} onDelete={onDelete || (() => onSave("–"))} />;
  }
  return <GenericMetricModal open={open} onClose={onClose} label={label} unit={unit} value={value} onSave={onSave} />;
}