import React from 'react';
import { Sliders, HelpCircle, ShieldCheck } from 'lucide-react';

export default function LiveWeightVisualizer({ weights }) {
  const defaultWeights = {
    w_photo: weights?.w_photo ?? 0.90,
    w_distinctness: weights?.w_distinctness ?? 1.00,
    w_diversity: weights?.w_diversity ?? 1.30,
    w_recency: weights?.w_recency ?? 1.00,
    w_trust: weights?.w_trust ?? 1.20,
    total_weight: weights?.total_weight ?? 1.404
  };

  const factors = [
    { label: 'w_photo (ML & Duplicate penalty)', value: defaultWeights.w_photo, color: 'bg-emerald-600', note: 'Confidence * Duplicate penalty' },
    { label: 'w_distinctness (Field collapse)', value: defaultWeights.w_distinctness, color: 'bg-sky-600', note: 'Collapses same-field duplicates' },
    { label: 'w_diversity (Multi-field bonus)', value: defaultWeights.w_diversity, color: 'bg-purple-600', note: 'Bonus for distinct farmers/fields' },
    { label: 'w_recency (Time decay)', value: defaultWeights.w_recency, color: 'bg-amber-600', note: 'Exponential decay over 24h' },
    { label: 'w_trust (Farmer reputation)', value: defaultWeights.w_trust, color: 'bg-indigo-600', note: 'Historical agronomist confirmations' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="font-extrabold text-base text-neutral-900">Live Weight Visualizer</h3>
        </div>
        <span className="text-xs bg-primary-50 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-bold">
          Total Weight: {defaultWeights.total_weight.toFixed(3)}
        </span>
      </div>

      <p className="text-xs text-neutral-600">
        Transparency formula: <code className="font-mono bg-neutral-100 text-primary px-1.5 py-0.5 rounded">total_weight = w_photo × w_distinctness × w_diversity × w_recency × w_trust</code>
      </p>

      {/* Horizontal Weight Breakdown Stacked Bar */}
      <div className="space-y-3 pt-2">
        {factors.map((f, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${f.color}`} />
                {f.label}
              </span>
              <span className="font-mono text-neutral-900">{f.value.toFixed(2)}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full ${f.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, (f.value / 2.0) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-600 block">{f.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
