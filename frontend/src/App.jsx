import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldCheck, Heart, MapPin, UserCheck, Lock, Sliders, Sparkles } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HelplineBanner from './components/HelplineBanner';
import IVRSimulatorModal from './components/IVRSimulatorModal';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GISMapPage from './pages/GISMapPage';
import AIDiagnosisStudio from './pages/AIDiagnosisStudio';
import PanicLabPage from './pages/PanicLabPage';
import ClusterDetail from './pages/ClusterDetail';
import ReviewQueue from './pages/ReviewQueue';
import FarmerSubmit from './pages/FarmerSubmit';
import FarmerDirectoryPage from './pages/FarmerDirectoryPage';
import AlertLogPage from './pages/AlertLogPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ReportTrackerPage from './pages/ReportTrackerPage';

function App() {
  const [ivrModalOpen, setIvrModalOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-neutral-100 text-neutral-900 font-sans selection:bg-primary selection:text-white">
        {/* Top Helpline Banner */}
        <HelplineBanner onOpenIvr={() => setIvrModalOpen(true)} />

        {/* Main Navbar */}
        <Navbar onOpenIvr={() => setIvrModalOpen(true)} />

        {/* Main Content View */}
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<LandingPage onOpenIvr={() => setIvrModalOpen(true)} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<GISMapPage />} />
            <Route path="/ai-studio" element={<AIDiagnosisStudio />} />
            <Route path="/panic-lab" element={<PanicLabPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/clusters/:id" element={<ClusterDetail />} />
            <Route path="/review-queue" element={<ReviewQueue />} />
            <Route path="/farmer-submit" element={<FarmerSubmit />} />
            <Route path="/tracker" element={<ReportTrackerPage />} />
            <Route path="/farmer-directory" element={<FarmerDirectoryPage />} />
            <Route path="/alert-log" element={<AlertLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Interactive Phone IVR Simulator Modal */}
        <IVRSimulatorModal
          isOpen={ivrModalOpen}
          onClose={() => setIvrModalOpen(false)}
        />

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Sprout className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">FieldWatch</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solving "The Pest That Beat the Forecast". Hyperlocal crowdsourced pest & disease outbreak mapping that dampens anxiety-driven copycat report floods.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">Farmer Ingestion Layer</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setIvrModalOpen(true)} className="hover:text-amber-400 text-left">
                    • Phone IVR Keypad Menu (EN / HI / MR)
                  </button>
                </li>
                <li>
                  <Link to="/farmer-submit" className="hover:text-amber-400">
                    • Mobile PWA Offline Submission Queue
                  </Link>
                </li>
                <li>
                  <Link to="/alert-log" className="hover:text-amber-400">
                    • Multi-Channel Broadcast Engine
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">Intelligence Engine</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link to="/map" className="hover:text-emerald-400">
                    • Leaflet GIS Outbreak & Activity Heatmap
                  </Link>
                </li>
                <li>
                  <Link to="/ai-studio" className="hover:text-emerald-400">
                    • OpenCV Lesion Segmentation & Prescriptions
                  </Link>
                </li>
                <li>
                  <Link to="/panic-lab" className="hover:text-emerald-400">
                    • Panic-Dampening Simulator & Weighting Lab
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-xs bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>National Farmer Helpline</span>
              </h4>
              <p className="font-extrabold text-lg text-white font-mono">1800-180-1551</p>
              <p className="text-[11px] text-slate-400">
                Toll-Free • 24x7 Support in English, Hindi (हिन्दी), and Marathi (मराठी).
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 FieldWatch — Winning Hackathon Prototype. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Built for Indian Agricultural Defense</span>
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
