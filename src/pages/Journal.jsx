import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, BookOpen, Smile, FileText, AlertTriangle, Zap, Star } from "lucide-react";
import JournalEntryModal from "@/components/modals/JournalEntryModal";
import { useAppState } from "@/lib/AppState";

const CATEGORY_ICONS = {
  "Mood": <Smile size={20} className="text-green-500" />,
  "General Note": <FileText size={20} className="text-teal-500" />,
  "Side Effect": <AlertTriangle size={20} className="text-red-500" />,
  "Energy": <Zap size={20} className="text-purple-500" />,
  "Milestone": <Star size={20} className="text-yellow-500" />,
  "Food": <FileText size={20} className="text-orange-500" />,
  "Exercise": <Zap size={20} className="text-blue-500" />,
};
const CATEGORY_BG = {
  "Mood": "bg-green-100",
  "General Note": "bg-teal-100",
  "Side Effect": "bg-red-100",
  "Energy": "bg-purple-100",
  "Milestone": "bg-yellow-100",
  "Food": "bg-orange-100",
  "Exercise": "bg-blue-100",
};

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleSave = (entry) => {
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, entry);
    } else {
      addJournalEntry(entry);
    }
    setEditingEntry(null);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const openNew = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-30 bg-gray-50 flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><Plus size={22} className="text-gray-600" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
        </div>
      </div>

      {journalEntries.length === 0 ? (
        <div className="px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={36} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Journal Entries</h3>
            <p className="text-sm text-gray-400 mb-4">Record your thoughts, symptoms, and medication experiences.</p>
            <button onClick={openNew} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
              <Plus size={18} /> Add Journal Entry
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {journalEntries.map((entry) => (
            <button key={entry.id} onClick={() => openEdit(entry)} className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${CATEGORY_BG[entry.category] || "bg-gray-100"} flex items-center justify-center flex-shrink-0`}>
                  {CATEGORY_ICONS[entry.category] || <FileText size={20} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-700 line-clamp-2 pr-2">{entry.text}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <span>🕐</span> <span>{entry.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.moodColor}`}>
                      😊 {entry.mood}
                    </span>
                    <span className="text-xs text-gray-400">• {entry.category}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <JournalEntryModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingEntry(null); }}
        onSave={handleSave}
        initialEntry={editingEntry}
      />
    </div>
  );
}