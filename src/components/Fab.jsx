import React from "react";
import { Plus } from "lucide-react";

export default function Fab({ onClick, label, icon: Icon = Plus }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-fab-safe right-5 lg:right-8 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold z-40 hover:bg-indigo-700 transition-colors text-sm px-5 py-3"
    >
      <Icon size={18} /> {label}
    </button>
  );
}