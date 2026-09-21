import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Eye, User } from 'lucide-react';
import axios from 'axios';

export default function ReviewTable({ reports = [], onReviewComplete }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const handleDecision = async (reportId, decision) => {
    setLoadingId(reportId);
    try {
      await axios.post(`/api/review-queue/${reportId}`, { decision });
      if (onReviewComplete) onReviewComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-neutral-300 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-bold text-neutral-900 text-base">Review Queue Clear</h4>
        <p className="text-xs text-neutral-600">All submitted reports have been reviewed or verified by AI classification.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-300 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-900 border-collapse">
          <thead className="bg-neutral-100 border-b border-neutral-300 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
            <tr>
              <th className="p-3.5">Thumbnail</th>
              <th className="p-3.5">Farmer ID & Trust</th>
              <th className="p-3.5">Field & Crop</th>
              <th className="p-3.5">ML Pest Detection</th>
              <th className="p-3.5">Total Weight</th>
              <th className="p-3.5">Submitted</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {reports.map((r) => {
              const farmerName = r.farmer_id?.name || 'Farmer';
              const trustScore = r.farmer_id?.trust_score ?? 1.0;
              const photo = r.photo_path || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop';

              return (
                <tr key={r._id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-neutral-300 cursor-pointer">
                      <img
                        src={photo}
                        alt="Crop report"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{farmerName}</span>
                    </div>
                    <span className="inline-block mt-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-200">
                      Trust: {trustScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono text-neutral-900 font-bold block">{r.field_id}</span>
                    <span className="text-neutral-600 text-[11px]">{r.crop_type}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-neutral-900 block">{r.cv_result?.pest_type}</span>
                    <span className="text-neutral-600 text-[11px]">
                      Confidence: {((r.cv_result?.confidence || 0.85) * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-primary text-sm">
                    {r.weight?.total_weight?.toFixed(3) || '1.000'}
                  </td>
                  <td className="p-3.5 text-neutral-600">
                    {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      disabled={loadingId === r._id}
                      onClick={() => handleDecision(r._id, 'confirm')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-xs inline-flex items-center space-x-1 shadow-2xs active:scale-95 transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                    <button
                      disabled={loadingId === r._id}
                      onClick={() => handleDecision(r._id, 'reject')}
                      className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-1.5 rounded text-xs inline-flex items-center space-x-1 shadow-2xs active:scale-95 transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-xl w-full bg-slate-900 p-2 rounded-xl border border-slate-700">
            <img src={selectedPhoto} alt="Full crop evidence" className="w-full h-auto rounded-lg" />
            <p className="text-center text-xs text-slate-400 mt-2">Click anywhere to close preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
