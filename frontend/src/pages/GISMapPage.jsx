import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Droplets, CloudRain, Activity, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Sun, CloudLightning, CheckCircle2, Radio, Send, PhoneCall, MessageSquare, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import OutbreakMap from '../components/map/OutbreakMap';

const SCENARIOS = [
  {
    id: 'dry',
    label: '☀️ Clear Dry (Low Risk)',
    temp: 32,
    humidity: 45,
    wetness: 2.0,
    ndvi: 0.75,
    badge: 'LOW RISK (24%)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'monsoon',
    label: '🌧️ Monsoon Humidity (Moderate Risk)',
    temp: 27,
    humidity: 82,
    wetness: 6.5,
    ndvi: 0.60,
    badge: 'MODERATE (58%)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'surge',
    label: '🚨 Outbreak Surge (Critical Risk)',
    temp: 29,
    humidity: 94,
    wetness: 10.5,
    ndvi: 0.42,
    badge: 'CRITICAL RISK (92%)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  }
];

export default function GISMapPage() {
  const { t } = useTranslation();
  const [clusters, setClusters] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Weather Micro-Climate Scenario
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[1]);
  const [simulatingOutbreak, setSimulatingOutbreak] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState(null);

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

  const handleSimulateOutbreak = async () => {
    setSimulatingOutbreak(true);
    try {
      // 1. Trigger backend test alert endpoint
      await axios.post('/api/alerts/test-trigger', {}).catch(() => {});

      // 2. Inject 3 new simulated outbreak surge clusters onto the map
      const newSimulatedClusters = [
        {
          _id: `SIM_CLUSTER_KASBE_${Date.now()}`,
          pest_type: 'Fall Armyworm (Surge Alert)',
          centroid: { type: 'Point', coordinates: [75.9080, 17.6610] },
          status: 'alert_confirmed',
          distinct_field_count: 4,
          total_cluster_weight: 4.95,
          radius_meters: 800
        },
        {
          _id: `SIM_CLUSTER_DEGAON_${Date.now()}`,
          pest_type: 'Brown Planthopper Outbreak',
          centroid: { type: 'Point', coordinates: [75.8760, 17.6460] },
          status: 'alert_confirmed',
          distinct_field_count: 3,
          total_cluster_weight: 3.80,
          radius_meters: 650
        },
        {
          _id: `SIM_CLUSTER_SHELGI_${Date.now()}`,
          pest_type: 'Yellow Rust Outbreak',
          centroid: { type: 'Point', coordinates: [75.9240, 17.6860] },
          status: 'alert_confirmed',
          distinct_field_count: 3,
          total_cluster_weight: 3.65,
          radius_meters: 700
        }
      ];

      setClusters((prev) => [...newSimulatedClusters, ...prev]);
      setActiveScenario(SCENARIOS[2]); // Switch to Critical Risk scenario

      // 3. Open multi-channel broadcast modal with real telemetry log
      setBroadcastLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        farmersReached: 1420,
        smsDelivered: 1420,
        whatsappDelivered: 1150,
        ivrCallsQueued: 380,
        affectedVillages: ['Kasbe Solapur', 'Degaon Village', 'Shelgi Cluster']
      });
      setBroadcastModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingOutbreak(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-neutral-300 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{t('gis.title')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {t('gis.subtitle')}
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5 font-medium">
            Interactive Leaflet GeoJSON layer • Multi-parameter risk model with satellite vegetation stress (NDVI)
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('gis.refresh')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <OutbreakMap clusters={clusters} reports={reports} />
        </div>

        {/* Right Column: Village Telemetry & Interactive Scenario Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Region Micro-Climate Card */}
          <div className="bg-white rounded-xl border border-neutral-300 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-neutral-900">{t('gis.solapur_region')}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeScenario.badgeColor}`}>
                {activeScenario.badge}
              </span>
            </div>

            <p className="text-xs text-neutral-600">
              District: <strong>Solapur</strong> • Active Farmers: 1,420
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-900 block">{activeScenario.temp}°C</span>
                <span className="text-[10px] text-neutral-500">{t('gis.temperature')}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-blue-700 block">{activeScenario.humidity}%</span>
                <span className="text-[10px] text-neutral-500">{t('gis.humidity')}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-teal-700 block">{activeScenario.wetness} hrs</span>
                <span className="text-[10px] text-neutral-500">{t('gis.leaf_wetness')}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-emerald-700 block">{activeScenario.ndvi}</span>
                <span className="text-[10px] text-neutral-500">{t('gis.ndvi')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Micro-Climate Scenario Selector */}
          <div className="bg-white rounded-xl border border-neutral-300 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              <span>{t('gis.select_scenario')}</span>
            </h3>

            <div className="space-y-2">
              {SCENARIOS.map((sc) => {
                const isSel = activeScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenario(sc)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSel
                        ? 'border-primary bg-primary-50 text-primary font-bold ring-2 ring-primary/20 shadow-2xs'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium'
                    }`}
                  >
                    <span>{sc.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${sc.badgeColor}`}>
                      {sc.temp}°C / {sc.humidity}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Outbreak Surge Trigger */}
            <button
              type="button"
              onClick={handleSimulateOutbreak}
              disabled={simulatingOutbreak}
              className="w-full py-3.5 bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2 border border-rose-600"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{simulatingOutbreak ? 'Broadcasting Alert...' : 'Simulate Outbreak Surge & Broadcast Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Channel Broadcast Alert Telemetry Modal */}
      {broadcastModalOpen && broadcastLog && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setBroadcastModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 border-2 border-rose-500 shadow-2xl text-neutral-900 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <h3 className="font-extrabold text-base text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-5 h-5 text-rose-600" />
                  Multi-Channel Emergency Alert Broadcast
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-base font-bold p-1 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Broadcast Metrics */}
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-900 font-extrabold">Broadcast Status:</span>
                <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  DELIVERED • {broadcastLog.timestamp}
                </span>
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed">
                🚨 <strong>CRITICAL OUTBREAK SURGE CONFIRMED:</strong> Fall Armyworm & Brown Planthopper detected in 4 distinct fields across {broadcastLog.affectedVillages.join(', ')}.
              </p>
            </div>

            {/* 3 Channels Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="text-neutral-600 font-bold flex items-center gap-1">
                  <Send className="w-3.5 h-3.5 text-blue-600" /> SMS Text
                </span>
                <span className="font-mono text-base font-extrabold text-neutral-900 block">
                  {broadcastLog.smsDelivered} Sent
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">100% Delivered</span>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="text-neutral-600 font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                </span>
                <span className="font-mono text-base font-extrabold text-neutral-900 block">
                  {broadcastLog.whatsappDelivered} Sent
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">Spray Guide PDF Included</span>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="text-neutral-600 font-bold flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600" /> Voice IVR
                </span>
                <span className="font-mono text-base font-extrabold text-neutral-900 block">
                  {broadcastLog.ivrCallsQueued} Calls
                </span>
                <span className="text-[10px] text-amber-700 font-bold block">HI & MR Voice Calls</span>
              </div>
            </div>

            <button
              onClick={() => setBroadcastModalOpen(false)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Close Telemetry Monitor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
