import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, BookOpen, Smile, FileText, AlertTriangle, Zap, Star, Clock, Heart } from "lucide-react";
import JournalEntryModal from "@/components/modals/JournalEntryModal";
import { useAppState } from "@/lib/AppState";
import { toast } from "sonner";

const CATEGORY_CONFIG = {
  "Mood":         { icon: <Smile size={20} />,         lightBg: "bg-teal-100",  darkBg: "rgba(20,184,166,0.13)",   color: "#2DD4BF" },
  "General Note": { icon: <FileText size={20} />,      lightBg: "bg-indigo-100",   darkBg: "rgba(99,102,241,0.13)",  color: "#818CF8" },
  "Side Effect":  { icon: <AlertTriangle size={20} />, lightBg: "bg-red-100",    darkBg: "rgba(239,68,68,0.13)",   color: "#F87171" },
  "Energy":       { icon: <Zap size={20} />,           lightBg: "bg-indigo-100", darkBg: "rgba(99,102,241,0.13)",  color: "#818CF8" },
  "Milestone":    { icon: <Star size={20} />,          lightBg: "bg-orange-100", darkBg: "rgba(249,115,22,0.13)",   color: "#FB923C" },
  "Food":         { icon: <FileText size={20} />,      lightBg: "bg-orange-100", darkBg: "rgba(249,115,22,0.13)",  color: "#FB923C" },
  "Exercise":     { icon: <Zap size={20} />,           lightBg: "bg-teal-100",   darkBg: "rgba(20,184,166,0.13)",  color: "#2DD4BF" },
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

  const openEdit = (entry) => {setEditingEntry(entry);setShowModal(true);};
  const openNew = () => {setEditingEntry(null);setShowModal(true);};

  const filtered = filterCat === "All" ? journalEntries : journalEntries.filter((e) => e.category === filterCat);
  // Map DB field name to display name
  const normalizeEntry = (e) => ({ ...e, moodColor: e.mood_color || e.moodColor || "bg-gray-100 text-gray-600" });

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 w-full flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
        <div className="flex items-center gap-3">
          <button onClick={openNew}><Plus size={22} className="text-gray-600 dark:text-gray-400" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600 dark:text-gray-400" /></Link>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="max-w-3xl mx-auto px-4 mb-3 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) =>
        <button key={cat} onClick={() => setFilterCat(cat)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
        filterCat === cat ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-[#9A9DAE] border-gray-200 dark:border-gray-700"}`
        }>
            {cat}
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        {filtered.length === 0 ?
        <div className="px-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-teal-100 dark:bg-teal-500/15">
                <BookOpen size={36} className="text-teal-500 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Journal Entries</h3>
              <p className="text-sm text-gray-400 mb-4">Record your thoughts, symptoms, and medication experiences.</p>
              <button onClick={openNew} className="px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
                <Plus size={18} /> Add Journal Entry
              </button>
            </div>
          </div> :

        <div className="px-4 space-y-3 pb-28">
            {filtered.map((entry) => {
            const e = normalizeEntry(entry);
            return (
              <button key={e.id} onClick={() => openEdit(e)} className="w-full text-left bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden box-border">
                  <div className="flex items-start gap-3 w-full min-w-0">
                    {(() => {
                      const cfg = CATEGORY_CONFIG[e.category];
                      return (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: cfg ? cfg.darkBg : "rgba(150,150,150,0.13)" }}>
                          {cfg ? React.cloneElement(cfg.icon, { style: { color: cfg.color } }) : <FileText size={20} className="text-gray-500" />}
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">{e.text}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{e.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Clock size={11} className="flex-shrink-0" /><span>{e.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 bg-white/10 dark:bg-white/[0.08] text-gray-600 dark:text-[#C0C3D4] border border-gray-200 dark:border-white/[0.1]">
                          <Heart size={10} /> {e.mood}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">• {e.category}</span>
                      </div>
                    </div>
                  </div>
                </button>);

          })}
          </div>
        }
      </div>

      <JournalEntryModal
        open={showModal}
        onClose={() => {setShowModal(false);setEditingEntry(null);}}
        onSave={handleSave}
        onDelete={editingEntry ? () => handleDelete(editingEntry.id) : null}
        initialEntry={editingEntry} />
      
    </div>);

}