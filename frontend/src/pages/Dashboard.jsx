import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ChevronRight, Sliders, RefreshCw, Layers } from 'lucide-react';
import axios from 'axios';
import StatCards from '../components/dashboard/StatCards';
import LiveWeightVisualizer from '../components/dashboard/LiveWeightVisualizer';
import SeverityChart from '../components/dashboard/SeverityChart';
import OutbreakMap from '../components/map/OutbreakMap';

export default function Dashboard() {
  const [clusters, setClusters] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clusterRes, reportRes] = await Promise.all([
        axios.get('/api/clusters'),
        axios.get('/api/reports')
      ]);

      setClusters(clusterRes.data.clusters || []);
      setReports(reportRes.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    activeClusters: clusters.filter((c) => c.status === 'alert_confirmed' || c.status === 'active_unconfirmed').length,
    pendingReviews: reports.filter((r) => r.status === 'verified_valid' || r.status === 'flagged_duplicate').length,
    alertsFired: clusters.filter((c) => c.status === 'alert_confirmed').length,
    totalReports: reports.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-300 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            FieldWatch Outbreak Dashboard
          </h1>
          <p className="text-xs text-neutral-600 font-medium">
            Hyperlocal Pest & Disease Outbreak Intelligence • Node Backend + Python ML Microservice
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top Row: 4 Stat Cards */}
      <StatCards stats={stats} />

      {/* Main Split View: Map on Left (60%), Priority Cluster List on Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map Column (60% width) */}
        <div className="lg:col-span-7 space-y-6">
          <OutbreakMap clusters={clusters} reports={reports} />
          <SeverityChart />
        </div>

        {/* Right Priority-Sorted Cluster List Column (40% width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-neutral-900">Priority Cluster Queue</h3>
              </div>
              <span className="text-xs font-bold text-neutral-600">
                {clusters.length} Clusters
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {clusters.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500">
                  No active clusters found.
                </div>
              ) : (
                clusters.map((cluster) => {
                  const isAlert = cluster.status === 'alert_confirmed';
                  return (
                    <div
                      key={cluster._id}
                      className={`p-4 rounded-xl border transition-all ${
                        isAlert
                          ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50'
                          : 'border-neutral-300 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                              isAlert ? 'bg-rose-700 text-white' : 'bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            {cluster.status.replace('_', ' ')}
                          </span>
                          <h4 className="font-extrabold text-sm text-neutral-900">{cluster.pest_type}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-neutral-500 block">Total Weight</span>
                          <span className="font-mono text-sm font-extrabold text-primary">
                            {cluster.total_cluster_weight}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 pt-2 border-t border-neutral-200/60">
                        <span>Distinct Fields: <strong className="text-neutral-900">{cluster.distinct_field_count}</strong></span>
                        <Link
                          to={`/clusters/${cluster._id}`}
                          className="text-primary font-bold hover:underline flex items-center"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <LiveWeightVisualizer />
        </div>
      </div>
    </div>
  );
}
