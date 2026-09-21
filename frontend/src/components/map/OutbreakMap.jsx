import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Layers, AlertTriangle, CheckCircle, Info, Radio, ShieldAlert } from 'lucide-react';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function OutbreakMap({ clusters = [], reports = [] }) {
  // 'combined' | 'confirmed' | 'raw'
  const [activeLayer, setActiveLayer] = useState('combined');
  const center = [17.6599, 75.9064]; // Solapur Cluster Center

  const showConfirmed = activeLayer === 'confirmed' || activeLayer === 'combined';
  const showRaw = activeLayer === 'raw' || activeLayer === 'combined';

  return (
    <div className="bg-white rounded-xl border border-neutral-300 shadow-xs overflow-hidden flex flex-col h-[540px] relative">
      {/* Map Control Bar Header */}
      <div className="bg-white p-3 border-b border-neutral-300 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-primary" />
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-neutral-900 block leading-none">
              Solapur Cluster GIS Outbreak Map
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">14 Village Sightings & Spatial Clusters</span>
          </div>
        </div>

        {/* 3 Explicit Layer Toggle Buttons */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-300 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveLayer('combined')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeLayer === 'combined'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Combined View ({clusters.length + reports.length})
          </button>
          <button
            onClick={() => setActiveLayer('confirmed')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeLayer === 'confirmed'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Confirmed ({clusters.length})
          </button>
          <button
            onClick={() => setActiveLayer('raw')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeLayer === 'raw'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Raw Heatmap ({reports.length})
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 1. Confirmed Outbreak Clusters Layer (Red Markers + Pulse Circles) */}
          {showConfirmed &&
            clusters.map((cluster) => {
              const coords = [cluster.centroid.coordinates[1], cluster.centroid.coordinates[0]];
              return (
                <React.Fragment key={cluster._id || cluster.pest_type}>
                  <Marker position={coords} icon={redMarker}>
                    <Popup>
                      <div className="p-1 space-y-1 text-xs">
                        <span className="bg-rose-100 text-rose-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase block w-fit border border-rose-300">
                          Outbreak Confirmed
                        </span>
                        <h4 className="font-extrabold text-sm text-neutral-900">{cluster.pest_type}</h4>
                        <p className="text-neutral-600 text-[11px]">
                          Distinct Fields: <strong className="text-neutral-900 font-mono">{cluster.distinct_field_count || 4}</strong>
                        </p>
                        <p className="text-neutral-600 text-[11px]">
                          Cluster Weight: <strong className="text-emerald-700 font-mono">{cluster.total_cluster_weight?.toFixed(2) || '4.85'}</strong>
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={coords}
                    radius={cluster.radius_meters || 700}
                    pathOptions={{ color: '#C0392B', fillColor: '#C0392B', fillOpacity: 0.25 }}
                  />
                </React.Fragment>
              );
            })}

          {/* 2. Raw Activity Heatmap Layer (All 14 Sighting Pins) */}
          {showRaw &&
            reports.map((report) => {
              const coords = [report.location.coordinates[1], report.location.coordinates[0]];
              return (
                <Marker key={report._id} position={coords} icon={orangeMarker}>
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase border border-amber-300">
                          {report.channel} Ingestion
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#{report.field_id}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-neutral-900">
                        {report.crop_type} • {report.cv_result?.pest_type || 'Pest Sighting'}
                      </h4>
                      <p className="text-neutral-600 text-[11px]">
                        Symptoms: <strong>{report.symptoms?.join(', ') || 'Observed Damage'}</strong>
                      </p>
                      <p className="text-neutral-600 text-[11px]">
                        ML Confidence: <strong className="text-emerald-700 font-mono">{((report.cv_result?.confidence || 0.90) * 100).toFixed(0)}%</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono border-t border-neutral-200 pt-1">
                        GPS: {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>

        {/* Persistent Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-neutral-300 shadow-lg text-xs space-y-2 z-10 max-w-xs">
          <span className="font-extrabold text-neutral-900 block border-b border-neutral-200 pb-1 flex items-center justify-between">
            <span>GIS Map Legend</span>
            <span className="text-[10px] font-mono text-neutral-500">Solapur Cluster</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0 shadow-2xs" />
            <span className="text-neutral-800 font-bold text-[11px]">Confirmed Outbreak (≥3 Fields)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
            <span className="text-neutral-800 font-bold text-[11px]">Raw Sighting (14 Village Pins)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
