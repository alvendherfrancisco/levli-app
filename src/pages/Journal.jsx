import React, { useState } from "react";
import { Plus, Clock, Heart } from "lucide-react";
import { BookOpen } from "lucide-react";
import TopBar from "@/components/TopBar";
import JournalEntryModal from "@/components/modals/JournalEntryModal";
import { useAppState } from "@/lib/AppState";
import { toast } from "sonner";
import { DropletIcon, MoodIcon, HeartIcon, SparkleIcon, FlameIcon, DumbbellIcon } from "@/components/onboarding/LevliIcons";

const CATEGORY_CONFIG = {
  "Mood":         { Icon: MoodIcon, grad: "from-amber-400 to-orange-500" },
  "General Note": { Icon: DropletIcon, grad: "from-indigo-400 to-teal-500" },
  "Side Effect":  { Icon: SparkleIcon, grad: "from-amber-400 to-orange-500" },
  "Energy":       { Icon: FlameIcon, grad: "from-indigo-400 to-blue-500" },
  "Milestone":    { Icon: SparkleIcon, grad: "from-orange-400 to-pink-500" },
  "Food":         { Icon: HeartIcon, grad: "from-pink-400 to-orange-400" },
  "Exercise":     { Icon: DumbbellIcon, grad: "from-teal-400 to-indigo-500" },
};
const ALL_CATEGORIES = ["All", "Mood", "General Note", "Side Effect", "Energy", "Milestone", "Food", "Exercise"];

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const handleSave = async (entry) => {
    if (editingEntry) { await updateJournalEntry(editingEntry.id, entry); toast.success("Journal entry updated!"); }
    else { await addJournalEntry(entry); toast.success("Journal entry added!"); }
    setEditingEntry(null);
  };
  const handleDelete = async (id) => {
    try { await deleteJournalEntry(id); toast.success("Entry deleted!"); setEditingEntry(null); setShowModal(false); }
    catch { toast.error("Failed to delete"); }
  };
  const openEdit = (entry) => { setEditingEntry(entry); setShowModal(true); };
  const openNew = () => { setEditingEntry(null); setShowModal(true); };
  const filtered = filterCat === "All" ? journalEntries : journalEntries.filter((e) => e.category === filterCat);
  const normalizeEntry = (e) => ({ ...e, moodColor: e.mood_color || e.moodColor || "bg-gray-100 text-gray-600" });

  return (
    <div className="min-h-screen w-full">
      <TopBar title="Journal" />

      {/* Category filter chips */}
      <div className="max-w-3xl mx-auto px-4 mb-3 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterCat === cat ? "bg-indigo-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/[0.04]"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {filtered.length === 0 ? (
          <div className="px-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100/80 dark:border-white/[0.04] text-center">
              <div className="w-20 h-20 mx-auto mb-4 opacity-60">
                <DropletIcon size={80} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Journal Entries</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Record your thoughts, symptoms, and medication experiences.</p>
              <button onClick={openNew} className="px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold flex items-center gap-2 mx-auto text-sm">
                <Plus size={18} /> Add Journal Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 space-y-3 pb-28">
            {filtered.map((entry) => {
              const e = normalizeEntry(entry);
              const cfg = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG["General Note"];
              return (
                <button key={e.id} onClick={() => openEdit(e)} className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-white/[0.04] overflow-hidden box-border transition-all hover:shadow-md">
                  <div className="flex items-start gap-3 w-full min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <cfg.Icon size={36} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 dark:text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">{e.text}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{e.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock size={11} className="flex-shrink-0" /><span>{e.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 bg-gray-50 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300">
                          <Heart size={10} /> {e.mood}
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

      <JournalEntryModal open={showModal} onClose={() => { setShowModal(false); setEditingEntry(null); }} onSave={handleSave} onDelete={editingEntry ? () => handleDelete(editingEntry.id) : null} initialEntry={editingEntry} />
    </div>
  );
}