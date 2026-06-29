import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";

export default function ReportPage() {
  const navigate = useNavigate();
  const { shots } = useAppState();

  const totalDose = shots.reduce((s, sh) => s + (parseFloat(sh.dose) || 0), 0);
  const avgDose = shots.length ? (totalDose / shots.length).toFixed(1) : "0.0";
  const painShots = shots.filter((s) => s.pain > 0);
  const avgPain = painShots.length ? (painShots.reduce((a, s) => a + s.pain, 0) / painShots.length).toFixed(1) : "0.0";

  return (
    <div className="bg-gray-50 min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-600">
          <ChevronLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Report</h1>
        <button className="flex items-center gap-1 text-blue-600">
          <Share2 size={20} />
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Report header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900">GLP-1 Shot History Report</h2>
          </div>
          <p className="text-xs text-gray-400 ml-4">Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">Summary</h3>
          <div className="space-y-2">
            {[
              ["Total Shots", shots.length],
              ["Total Dose", `${totalDose.toFixed(1)} mg`],
              ["Average Dose", `${avgDose} mg`],
              ["Average Pain Level", `${avgPain}/10`],
              ["Shots with Pain", `${painShots.length} (${shots.length ? Math.round(painShots.length/shots.length*100) : 0}%)`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shot table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">Detailed Shot History</h3>
          {shots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No shots recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th className="text-left p-2 text-gray-500 font-medium">Date</th>
                    <th className="text-left p-2 text-gray-500 font-medium">Med</th>
                    <th className="text-left p-2 text-gray-500 font-medium">Dose</th>
                    <th className="text-left p-2 text-gray-500 font-medium">Site</th>
                    <th className="text-left p-2 text-gray-500 font-medium">Pain</th>
                  </tr>
                </thead>
                <tbody>
                  {shots.map((s, i) => (
                    <tr key={s.id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="p-2 text-gray-700">{s.date}</td>
                      <td className="p-2 text-gray-700">{s.medication}</td>
                      <td className="p-2 text-gray-700">{s.dose}mg</td>
                      <td className="p-2 text-gray-700 max-w-[100px] truncate">{s.site}</td>
                      <td className={`p-2 font-medium ${s.pain === 0 ? "text-green-600" : s.pain <= 3 ? "text-yellow-600" : "text-red-600"}`}>
                        {s.pain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}