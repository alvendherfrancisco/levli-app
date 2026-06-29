import React from "react";
import { Syringe, MapPin } from "lucide-react";

export default function ShotCard({ medication, dose, drugClass, date, time, site, pain }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <Syringe size={18} className="text-green-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{medication}</span>
              <span className="text-blue-600 font-semibold">{dose} mg</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
              <span>📅</span>
              <span>{date} · {time}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin size={12} />
                <span>{site}</span>
              </div>
              {pain > 0 && (
                <span className={`text-xs font-medium ${pain >= 5 ? "text-red-500" : "text-yellow-600"}`}>
                  😣 Pain: {pain}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium flex-shrink-0">
          {drugClass}
        </span>
      </div>
    </div>
  );
}