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
  "Mood": "bg-green-100", "General Note": "bg-teal-100", "Side Effect": "bg-red-100",
  "Energy": "bg-purple-100", "Milestone": "bg-yellow-100", "Food": "bg-orange-100", "Exercise": "bg-blue-100",
};
const ALL_CATEGORIES = ["All", "Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const handleSave = (entry) => {
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, entry);
    } else {
      addJournalEntry(entry);
    }
    setEditingEntry(null);
  };

  const handleDelete = (id) => {
    deleteJournalEntry(id);
    setEditingEntry(null);
    setShowModal(false);
  };

  const openEdit = (entry) => { setEditingEntry(entry); setShowModal(true); };
  const openNew = () => { setEditingEntry(null); setShowModal(true); };

  const filtered = filterCat === "All" ? journalEntries : journalEntries.filter(e => e.category === filterCat);
  // Map DB field name to display name
  const normalizeEntry = (e) => ({ ...e, moodColor: e.mood_color || e.moodColor || "bg-gray-100 text-gray-600" });

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-background w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><Plus size={22} className="text-gray-600 dark:text-gray-400" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="max-w-3xl mx-auto px-4 mb-3 flex gap-2 overflow-x-auto pb-1">
        {ALL_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 border transition-colors ${
              filterCat === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-card text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-white/[0.08]"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {filtered.length === 0 ? (
          <div className="px-4">
            <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/[0.07] text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={36} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Journal Entries</h3>
              <p className="text-sm text-gray-400 mb-4">Record your thoughts, symptoms, and medication experiences.</p>
              <button onClick={openNew} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
                <Plus size={18} /> Add Journal Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 space-y-3 pb-28">
            {filtered.map((entry) => {
              const e = normalizeEntry(entry);
              return (
                <button key={e.id} onClick={() => openEdit(e)} className="w-full text-left bg-white dark:bg-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/[0.07] overflow-hidden box-border">
                  <div className="flex items-start gap-3 w-full min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${CATEGORY_BG[e.category] || "bg-gray-100"} flex items-center justify-center flex-shrink-0`}>
                      {CATEGORY_ICONS[e.category] || <FileText size={20} className="text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">{e.text}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{e.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <span>🕐</span><span>{e.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${e.moodColor}`}>
                          😊 {e.mood}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">• {e.category}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <JournalEntryModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingEntry(null); }}
        onSave={handleSave}
        onDelete={editingEntry ? () => handleDelete(editingEntry.id) : null}
        initialEntry={editingEntry}
      />
    </div>
  );
}