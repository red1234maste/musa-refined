import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, FileText } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Active Outbreak Clusters',
      value: stats?.activeClusters ?? 1,
      change: '+1 from last cycle',
      icon: AlertTriangle,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200'
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews ?? 2,
      change: 'High priority queue',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      title: 'Alerts Fired Today',
      value: stats?.alertsFired ?? 1,
      change: 'Multi-channel broadcast',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Total Reports Ingested',
      value: stats?.totalReports ?? 4,
      change: 'App, PWA & IVR channels',
      icon: FileText,
      color: 'bg-sky-500/10 text-sky-600 border-sky-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-neutral-300 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-neutral-900 tracking-tight block">
                {card.value}
              </span>
              <span className="text-[11px] text-neutral-600 font-medium mt-1 block">
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
