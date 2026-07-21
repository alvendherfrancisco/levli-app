import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Clock, Heart, FileText, AlertTriangle, Zap, Star } from "lucide-react";
import JournalEntryModal from "@/components/modals/JournalEntryModal";
import TopIcons from "@/components/TopIcons";
import { useAppState } from "@/lib/AppState";
import { toast } from "sonner";

const CATEGORY_CONFIG = {
  Mood:          { icon: <Heart size={20} className="text-teal-500" />, tint: "bg-teal-100" },
  "General Note": { icon: <FileText size={20} className="text-indigo-500" />, tint: "bg-indigo-100" },
  "Side Effect":  { icon: <AlertTriangle size={20} className="text-orange-500" />, tint: "bg-orange-100" },
  Energy:       { icon: <Zap size={20} className="text-amber-500" />, tint: "bg-amber-100" },
  Milestone:    { icon: <Star size={20} className="text-orange-500" />, tint: "bg-orange-100" },
  Food:         { icon: <FileText size={20} className="text-orange-500" />, tint: "bg-orange-100" },
  Exercise:     { icon: <Zap size={20} className="text-teal-500" />, tint: "bg-teal-100" },
};
const ALL_CATEGORIES = ["All", "Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const handleSave = async (entry) => {
    if (editingEntry) {
      await updateJournalEntry(editingEntry.id, entry);
      toast.success("Journal entry updated successfully!");
    } else {
      await addJournalEntry(entry);
      toast.success("Journal entry added successfully!");
    }
    setEditingEntry(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(id);
      toast.success("Journal entry deleted successfully!");
      setEditingEntry(null);
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to delete journal entry");
    }
  };

  const openEdit = (entry) => { setEditingEntry(entry); setShowModal(true); };
  const openNew = () => { setEditingEntry(null); setShowModal(true); };

  const filtered = filterCat === "All" ? journalEntries : journalEntries.filter((e) => e.category === filterCat);

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-[#FAFAFA] w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Journal</h1>
        <div className="flex items-center gap-2">
          <button onClick={openNew}><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><Plus size={18} className="text-gray-500" /></div></button>
          <TopIcons />
        </div>
      </div>

      {/* Category filter chips */}
      <div className="max-w-3xl mx-auto px-4 mb-3 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all active:scale-95 ${
              filterCat === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {filtered.length === 0 ? (
          <div className="px-4">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-teal-100">
                <BookOpen size={28} className="text-teal-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No journal entries yet</h3>
              <p className="text-sm text-gray-400 mb-5">Record your thoughts, symptoms, and medication experiences.</p>
              <button
                onClick={openNew}
                className="px-6 py-3.5 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus size={18} /> Add Journal Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 space-y-3 pb-28">
            {filtered.map((entry) => {
              const cfg = CATEGORY_CONFIG[entry.category];
              return (
                <button
                  key={entry.id}
                  onClick={() => openEdit(entry)}
                  className="w-full text-left bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden box-border active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start gap-3 w-full min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg ? cfg.tint : "bg-gray-100"}`}>
                      {cfg ? cfg.icon : <FileText size={20} className="text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">{entry.text}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Clock size={11} className="flex-shrink-0" /><span>{entry.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {entry.mood && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 bg-teal-50 text-teal-600">
                            <Heart size={10} /> {entry.mood}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 whitespace-nowrap">• {entry.category}</span>
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