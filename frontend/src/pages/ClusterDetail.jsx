import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShieldCheck, MapPin, User, FileText } from 'lucide-react';
import axios from 'axios';
import LiveWeightVisualizer from '../components/dashboard/LiveWeightVisualizer';

export default function ClusterDetail() {
  const { id } = useParams();
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCluster() {
      try {
        const res = await axios.get(`/api/clusters/${id}`);
        setCluster(res.data.cluster);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCluster();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-xs text-neutral-600">Loading cluster detail...</div>;
  }

  if (!cluster) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <p className="text-neutral-600">Cluster not found.</p>
        <Link to="/" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Link to="/" className="inline-flex items-center text-xs font-bold text-neutral-600 hover:text-neutral-900 space-x-1">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Cluster Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-rose-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase inline-block mb-2">
            {cluster.status.replace('_', ' ')}
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900">{cluster.pest_type} Cluster</h1>
          <p className="text-xs text-neutral-600 font-mono mt-1">
            Centroid: [{cluster.centroid.coordinates[1].toFixed(4)}°N, {cluster.centroid.coordinates[0].toFixed(4)}°E]
          </p>
        </div>

        <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-6">
          <div>
            <span className="text-xs text-neutral-500 block">Distinct Fields</span>
            <span className="text-2xl font-extrabold text-neutral-900">{cluster.distinct_field_count}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-500 block">Total Cluster Weight</span>
            <span className="text-2xl font-extrabold text-primary font-mono">{cluster.total_cluster_weight}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Contributing Reports */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-300 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-neutral-900">Contributing Reports</h3>
            <div className="space-y-3">
              {cluster.report_ids && cluster.report_ids.map((r) => (
                <div key={r._id} className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-mono font-bold text-neutral-900 block">{r.field_id}</span>
                    <span className="text-neutral-600">Channel: <strong className="uppercase">{r.channel}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-primary block">{r.weight?.total_weight?.toFixed(3)}</span>
                    <span className="text-[10px] text-neutral-500">Weight Factor</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weight Visualizer Panel */}
        <div className="md:col-span-5 space-y-4">
          <LiveWeightVisualizer />
        </div>
      </div>
    </div>
  );
}
