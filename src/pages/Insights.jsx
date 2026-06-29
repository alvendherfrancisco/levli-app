import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, TrendingDown, Syringe, HelpCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weightData = [
  { date: "Feb", weight: 210 },
  { date: "Mar", weight: 207 },
  { date: "Apr", weight: 200 },
  { date: "May", weight: 195 },
  { date: "Jun", weight: 185 },
  { date: "Jul", weight: 183 },
  { date: "Aug", weight: 180 },
];

const medData = [
  { day: "5/6", level: 0.5 }, { day: "", level: 2.5 }, { day: "5/10", level: 1.8 },
  { day: "", level: 3.8 }, { day: "5/14", level: 3.2 }, { day: "", level: 2.0 },
  { day: "5/18", level: 3.5 }, { day: "", level: 3.8 }, { day: "5/22", level: 2.2 },
  { day: "", level: 3.9 }, { day: "5/26", level: 3.6 }, { day: "", level: 3.0 },
  { day: "5/31", level: 3.2 }, { day: "", level: 2.8 }, { day: "6/4", level: 2.5 },
];

export default function Insights() {
  const [weightRange, setWeightRange] = useState("180 Days");
  const [medRange, setMedRange] = useState("30 Days");
  const [showShotsToggle, setShowShotsToggle] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <Link to="/settings"><Settings size={22} className="text-gray-600" /></Link>
      </div>

      {/* Weight Change Panel */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={18} className="text-blue-600" />
          <h3 className="font-bold text-gray-900 text-lg">Weight Change</h3>
        </div>
        <div className="border-b-2 border-blue-500 w-12 mb-3" />

        {/* Range tabs */}
        <div className="flex items-center gap-2 mb-3">
          {["30 Days", "180 Days", "1 Year"].map((r) => (
            <button
              key={r}
              onClick={() => setWeightRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                weightRange === r ? "bg-gray-100 text-gray-900 border border-gray-200" : "text-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => setShowShotsToggle(!showShotsToggle)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border ${
              showShotsToggle ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-400"
            }`}
          >
            <Syringe size={12} /> Shots
          </button>
        </div>

        {/* Date range navigation */}
        <div className="flex items-center gap-2 mb-3">
          <button className="p-1 rounded bg-gray-100"><ChevronLeft size={16} className="text-gray-500" /></button>
          <span className="flex-1 text-center text-xs text-gray-500 italic">Jan 20, 2025 - Jul 19, 2025</span>
          <button className="p-1 rounded bg-gray-100"><ChevronRight size={16} className="text-gray-500" /></button>
          <button className="px-2 py-1 rounded text-xs text-blue-600 font-medium flex items-center gap-1 border border-blue-200">
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-50 rounded-xl p-2.5 text-center">
            <TrendingDown size={14} className="text-green-500 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500">Weight Loss</p>
            <p className="text-sm font-bold text-green-600">-38.0 lbs</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5 text-center">
            <span className="text-blue-500 text-sm">⚡</span>
            <p className="text-[10px] text-gray-500">Rate/Week</p>
            <p className="text-sm font-bold text-blue-600">-3.1 lbs</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-2.5 text-center">
            <span className="text-orange-500 text-sm">📊</span>
            <p className="text-[10px] text-gray-500">Current BMI</p>
            <p className="text-sm font-bold text-orange-600">25.4</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#ccc" />
              <YAxis domain={[175, 215]} tick={{ fontSize: 11 }} stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#3B6FE0" strokeWidth={2} dot={{ fill: "#3B6FE0", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Medication Levels Panel */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <Syringe size={18} className="text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Medication Levels</h3>
              <p className="text-xs text-blue-500">Estimated medication levels in your system over time.</p>
            </div>
          </div>
          <HelpCircle size={18} className="text-blue-400" />
        </div>
        <div className="border-b-2 border-blue-500 w-12 mb-3" />

        {/* Range tabs */}
        <div className="flex items-center gap-2 mb-4">
          {["7 Days", "30 Days", "90 Days"].map((r) => (
            <button
              key={r}
              onClick={() => setMedRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                medRange === r ? "bg-gray-100 text-gray-900 border border-gray-200" : "text-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Med levels chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={medData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#ccc" />
              <YAxis domain={[0, 4.5]} tick={{ fontSize: 10 }} stroke="#ccc" />
              <Tooltip />
              <Area type="monotone" dataKey="level" stroke="#3B6FE0" fill="#3B6FE0" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Time vs Concentration (mg)</p>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <div className="w-4 h-0.5 bg-blue-600 rounded" />
          <span className="text-xs text-gray-500">Semaglutide</span>
        </div>
      </div>
    </div>
  );
}