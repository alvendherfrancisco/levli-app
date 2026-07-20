import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { parseShotDate } from "@/lib/dateUtils";
import { PK_CALCULATION_VERSION } from "@/lib/pkCalculations";

const REPORT_CALCULATION_VERSION = "report-v1";

export default function ReportPage() {
  const navigate = useNavigate();
  const { shots } = useAppState();
  const [exporting, setExporting] = useState(false);

  const painShots = shots.filter((s) => s.pain > 0);
  const avgPain = shots.length ? (shots.reduce((a, s) => a + s.pain, 0) / shots.length).toFixed(1) : "0.0";
  const avgPainWhenReported = painShots.length ? (painShots.reduce((a, s) => a + s.pain, 0) / painShots.length).toFixed(1) : "0.0";

  const medCounts = {};
  const medTotals = {};
  shots.forEach((s) => {
    medCounts[s.medication] = (medCounts[s.medication] || 0) + 1;
    medTotals[s.medication] = (medTotals[s.medication] || 0) + (parseFloat(s.dose) || 0);
  });

  const siteCounts = {};
  shots.forEach((s) => { siteCounts[s.site] = (siteCounts[s.site] || 0) + 1; });
  const topSites = Object.entries(siteCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const sortedShots = [...shots].sort((a, b) => parseShotDate(a.date) - parseShotDate(b.date));
  const firstDate = sortedShots[0]?.date || "—";
  const lastDate = sortedShots[sortedShots.length - 1]?.date || "—";

  const handleExportPDF = async () => {
    setExporting(true);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(18); doc.setFont("helvetica", "bold");
    doc.text("Shot History Summary", 14, y); y += 8;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 14, y); y += 5;
    doc.text(`Date Range: ${firstDate} – ${lastDate}`, 14, y); y += 10;
    doc.setTextColor(0);

    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text("Summary", 14, y); y += 2;
    doc.setDrawColor(20, 184, 166); doc.setLineWidth(0.5); doc.line(14, y, 60, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const summaryRows = [
      ["Total Shots", shots.length],
      ["Average Pain (all shots)", `${avgPain}/10`],
      ["Average Pain (when reported)", `${avgPainWhenReported}/10`],
      ["Shots with Pain", `${painShots.length} (${shots.length ? Math.round(painShots.length / shots.length * 100) : 0}%)`],
      ["Period Covered", firstDate !== "—" && lastDate !== "—" ? `${firstDate} – ${lastDate}` : "—"],
    ];
    summaryRows.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal"); doc.setTextColor(120); doc.text(label, 14, y);
      doc.setFont("helvetica", "bold"); doc.setTextColor(0); doc.text(String(value), 100, y);
      y += 6;
    });
    y += 4;

    if (Object.keys(medCounts).length) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text("Medications Used", 14, y); y += 2;
      doc.line(14, y, 70, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      Object.entries(medCounts).forEach(([med, cnt]) => {
        doc.setTextColor(120); doc.text(med, 14, y);
        doc.setTextColor(0); doc.text(`${cnt} (${Math.round(cnt/shots.length*100)}%) • ${medTotals[med].toFixed(1)} mg total`, 100, y);
        y += 6;
      });
      y += 4;
    }

    if (topSites.length) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text("Most Used Injection Sites", 14, y); y += 2;
      doc.line(14, y, 80, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      topSites.forEach(([site, cnt]) => {
        doc.setTextColor(120); doc.text(site, 14, y);
        doc.setTextColor(0); doc.text(`${cnt} (${Math.round(cnt/shots.length*100)}%)`, 130, y);
        y += 6;
      });
      y += 4;
    }

    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text("Detailed Shot History", 14, y); y += 2;
    doc.line(14, y, 80, y); y += 6;
    doc.setFillColor(240, 240, 240); doc.rect(14, y - 3, pageW - 28, 7, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    ["Date", "Time", "Medication", "Dose", "Site", "Pain"].forEach((h, i) => {
      doc.text(h, [14, 44, 68, 118, 133, 183][i], y + 2);
    });
    y += 8;
    doc.setFont("helvetica", "normal");
    sortedShots.forEach((s, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      if (i % 2 === 1) { doc.setFillColor(250,250,250); doc.rect(14, y-3, pageW-28, 7, "F"); }
      doc.setTextColor(60);
      doc.text(s.date || "", 14, y);
      doc.text(s.time || "", 44, y);
      doc.text((s.medication || "").substring(0, 18), 68, y);
      doc.text(`${s.dose} mg`, 118, y);
      doc.text((s.site || "").substring(0, 18), 133, y);
      const p = s.pain || 0;
      doc.setTextColor(p === 0 ? 34 : p <= 3 ? 161 : 220, p === 0 ? 197 : p <= 3 ? 98 : 38, p === 0 ? 94 : p <= 3 ? 21 : 38);
      doc.text(String(p), 183, y);
      doc.setTextColor(60);
      y += 7;
    });

    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(150);
    doc.text("This summary is a record of entries you logged. It is not a medical document and is not a substitute for advice from your prescriber.", 14, y + 4, { maxWidth: pageW - 28 });
    y += 8;
    doc.text(`Calculation version: ${REPORT_CALCULATION_VERSION} | ${PK_CALCULATION_VERSION}`, 14, y + 4, { maxWidth: pageW - 28 });
    doc.save(`levli-report-${new Date().toISOString().slice(0,10)}.pdf`);
    setExporting(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full">
      {/* Full-width header */}
      <div className="w-full flex items-center justify-between px-5 pt-6 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-teal-600">
          <ChevronLeft size={22} /><span className="font-medium">Back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Report</h1>
        <button onClick={handleExportPDF} disabled={exporting || shots.length === 0}
          className="flex items-center gap-1 text-teal-600 disabled:opacity-40">
          {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={20} />}
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 bg-teal-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shot History Summary</h2>
          </div>
          <p className="text-xs text-gray-400 ml-4">Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          {firstDate !== "—" && <p className="text-xs text-gray-400 ml-4">Range: {firstDate} – {lastDate}</p>}
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">Summary</h3>
          <div className="space-y-2">
            {[
              ["Total Shots", shots.length],
              ["Average Pain (all shots)", `${avgPain}/10`],
              ["Average Pain (when reported)", `${avgPainWhenReported}/10`],
              ["Shots with Pain", `${painShots.length} (${shots.length ? Math.round(painShots.length / shots.length * 100) : 0}%)`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medications */}
        {Object.keys(medCounts).length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">Medications Used</h3>
            <div className="space-y-2">
              {Object.entries(medCounts).map(([med, cnt]) => (
                <div key={med} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{med}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{cnt} ({Math.round(cnt/shots.length*100)}%) • {medTotals[med].toFixed(1)} mg total</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sites */}
        {topSites.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">Top Injection Sites</h3>
            <div className="space-y-2">
              {topSites.map(([site, cnt]) => (
                <div key={site} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{site}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{cnt} ({Math.round(cnt/shots.length*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">Detailed Shot History</h3>
          {shots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No shots recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                    <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Med</th>
                    <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Dose</th>
                    <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Site</th>
                    <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Pain</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedShots.map((s, i) => (
                    <tr key={s.id} className={i % 2 === 1 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{s.date}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{s.medication}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{s.dose}mg</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300 max-w-[90px] truncate">{s.site}</td>
                      <td className={`p-2 font-medium ${s.pain === 0 ? "text-green-600" : s.pain <= 3 ? "text-yellow-600" : "text-red-600"}`}>{s.pain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1 mb-1">This summary is a record of entries you logged. It is not a medical document and is not a substitute for advice from your prescriber.</p>
        <p className="text-[10px] text-gray-300 dark:text-gray-600 px-1 mb-3">Calculation version: {REPORT_CALCULATION_VERSION} | {PK_CALCULATION_VERSION}</p>

        {shots.length > 0 && (
          <button onClick={handleExportPDF} disabled={exporting}
            className="mt-4 w-full py-3.5 bg-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {exporting ? "Generating PDF…" : "Export as PDF"}
          </button>
        )}
      </div>
    </div>
  );
}