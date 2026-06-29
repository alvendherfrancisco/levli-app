import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, BookOpen, Smile, FileText, AlertTriangle, Zap } from "lucide-react";

const sampleEntries = [
  {
    icon: <Smile size={20} className="text-green-500" />,
    iconBg: "bg-green-100",
    text: "Just completed my 4th week on Ozempic and I'm down 8 lbs! The appetite suppression is amazing...",
    date: "Jun 5, 2025",
    time: "7:00 AM",
    mood: "Feeling Excellent",
    moodColor: "bg-green-100 text-green-700",
    category: "Mood",
  },
  {
    icon: <FileText size={20} className="text-teal-500" />,
    iconBg: "bg-teal-100",
    text: "Can't believe it's been a month since I started my GLP-1 journey! Down 12 pounds...",
    date: "Jun 3, 2025",
    time: "6:00 PM",
    mood: "Feeling Good",
    moodColor: "bg-green-100 text-green-600",
    category: "General Note",
  },
  {
    icon: <AlertTriangle size={20} className="text-red-500" />,
    iconBg: "bg-red-100",
    text: "Had some rough nausea today after my Wegovy shot. Discovered that eating small...",
    date: "Jun 1, 2025",
    time: "5:18 PM",
    mood: "Feeling Neutral",
    moodColor: "bg-yellow-100 text-yellow-700",
    category: "Side Effect",
  },
  {
    icon: <Zap size={20} className="text-purple-500" />,
    iconBg: "bg-purple-100",
    text: "Doctor appointment tomorrow! Excited to share my progress. Weight is down 15...",
    date: "May 27, 2025",
    time: "1:44 PM",
    mood: "Feeling Excellent",
    moodColor: "bg-green-100 text-green-700",
    category: "Energy",
  },
  {
    icon: <FileText size={20} className="text-teal-500" />,
    iconBg: "bg-teal-100",
    text: "Had a challenging day with cravings. Went to a birthday party and really wanted...",
    date: "May 20, 2025",
    time: "3:54 PM",
    mood: "Feeling Good",
    moodColor: "bg-green-100 text-green-600",
    category: "General Note",
  },
];

export default function Journal() {
  const [showEntries, setShowEntries] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
        <div className="flex items-center gap-3">
          <button><Plus size={22} className="text-gray-600" /></button>
          <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
        </div>
      </div>

      {showEntries ? (
        /* Populated state */
        <div className="px-4 space-y-3">
          {sampleEntries.map((entry, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${entry.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {entry.icon}
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
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={36} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Journal Entries</h3>
            <p className="text-sm text-gray-400 mb-4">Record your thoughts, symptoms, and medication experiences. Tap the '+' button to create your first entry.</p>
            <button className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
              <Plus size={18} /> Add Journal Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}