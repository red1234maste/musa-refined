import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SeverityChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { time: '08:00', weight: 0.4, distinctFields: 1 },
    { time: '10:00', weight: 0.8, distinctFields: 2 },
    { time: '12:00', weight: 2.1, distinctFields: 3 }, // Alert fired threshold!
    { time: '14:00', weight: 2.3, distinctFields: 3 }, // Post-alert dampening active
    { time: '16:00', weight: 1.9, distinctFields: 3 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-neutral-900">Cluster Weight Severity Trend</h3>
          <p className="text-xs text-neutral-600">Real-time accumulation & post-alert dampening window</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Threshold: 3 Distinct Fields
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F6F43" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1F6F43" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#d1d5db' }} />
            <Area type="monotone" dataKey="weight" stroke="#1F6F43" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
