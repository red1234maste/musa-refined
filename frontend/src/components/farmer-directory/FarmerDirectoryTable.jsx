import React from 'react';
import { UserCheck, ShieldCheck, MapPin, Phone } from 'lucide-react';

export default function FarmerDirectoryTable({ farmers = [] }) {
  if (!farmers || farmers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-neutral-300 text-center text-xs text-neutral-600">
        No farmers registered yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-300 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-900 border-collapse">
          <thead className="bg-neutral-100 border-b border-neutral-300 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
            <tr>
              <th className="p-3.5">Farmer Name</th>
              <th className="p-3.5">Phone Number</th>
              <th className="p-3.5">Village & Region</th>
              <th className="p-3.5">Trust Score</th>
              <th className="p-3.5">Total Reports</th>
              <th className="p-3.5">Confirmed Reports</th>
              <th className="p-3.5">Preferred Language</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {farmers.map((farmer) => (
              <tr key={farmer._id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="p-3.5 font-bold text-neutral-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>{farmer.name}</span>
                </td>
                <td className="p-3.5 font-mono text-neutral-700">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    {farmer.phone}
                  </span>
                </td>
                <td className="p-3.5 text-neutral-700">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    {farmer.village || 'Solapur Region'}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                      farmer.trust_score >= 1.2
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : farmer.trust_score >= 0.8
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {farmer.trust_score.toFixed(2)}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-neutral-900">{farmer.total_reports_submitted}</td>
                <td className="p-3.5 text-emerald-700 font-bold">{farmer.confirmed_reports_count}</td>
                <td className="p-3.5 uppercase text-neutral-600 font-bold">{farmer.preferred_language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
