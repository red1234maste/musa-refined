import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Sliders,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Activity,
  Zap,
  Radio,
  Search,
  Activity as WaveIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onOpenIvr }) {
  const { t } = useTranslation();
  const { login } = useAuth();

  return (
    <div className="w-full space-y-10 pb-16 overflow-x-hidden">
      {/* 1. Hero Header Section — Restored Dark Navy Background matching User Uploaded Image 1 */}
      <section className="relative w-full bg-[#0B132B] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          {/* Problem Statement Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{t('hero.problem_badge')}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & 3 CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {t('hero.title_1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  {t('hero.title_2')}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                {t('hero.description')}
              </p>

              {/* 4 Action Buttons including Track My Reports */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/farmer-submit"
                  className="bg-[#1F6F43] hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <UserCheck className="w-4 h-4 text-emerald-200" />
                  <span>{t('hero.submit_cta')}</span>
                </Link>

                <Link
                  to="/tracker"
                  className="bg-[#2E6F9E] hover:bg-sky-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <Search className="w-4 h-4 text-sky-200" />
                  <span>{t('nav.tracker')}</span>
                </Link>

                <Link
                  to="/map"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>{t('hero.map_cta')}</span>
                </Link>

                <Link
                  to="/panic-lab"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <Sliders className="w-4 h-4 text-slate-950" />
                  <span>{t('hero.panic_cta')}</span>
                </Link>
              </div>
            </div>

            {/* Right Command Center Card — Restored Telemetry Panel matching Image 1 */}
            <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-2xl border border-slate-700/60 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <WaveIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-extrabold text-xs text-amber-300 uppercase tracking-wider">
                    {t('hero.engine_status')}
                  </span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {t('hero.status_active')}
                </span>
              </div>

              {/* 4 Grid Metric Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] font-medium">{t('hero.radius_label')}</span>
                  <span className="font-mono text-base font-extrabold text-white block">500m – 1km</span>
                  <span className="text-[10px] text-slate-500 block">Haversine Spatial GeoJSON</span>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] font-medium">{t('hero.alert_rule_label')}</span>
                  <span className="font-mono text-base font-extrabold text-emerald-400 block">≥ 3 Fields</span>
                  <span className="text-[10px] text-emerald-500/70 block">Hyperlocal Outbreak Rule</span>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] font-medium">{t('hero.copycat_label')}</span>
                  <span className="font-mono text-base font-extrabold text-amber-400 block">1 / N Decay</span>
                  <span className="text-[10px] text-amber-500/70 block">Same-Field Panic Dampening</span>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] font-medium">{t('hero.channels_label')}</span>
                  <span className="font-mono text-sm font-extrabold text-sky-400 block">App/PWA/IVR</span>
                  <span className="text-[10px] text-sky-500/70 block">Zero-Barrier Reach</span>
                </div>
              </div>

              {/* Green IVR Button */}
              <button
                onClick={onOpenIvr}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 border border-emerald-400/30"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>{t('hero.ivr_button')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 1-Click Role Switcher Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-2xl border border-neutral-300 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant 1-Click Role Quick Switcher</span>
            </span>
            <span className="text-[11px] text-neutral-500">Simulate any persona instantly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
            <Link
              to="/farmer-submit"
              onClick={() => login('farmer', 'Ramesh Patil (Farmer)')}
              className="p-3 bg-neutral-50 hover:bg-emerald-50 text-emerald-900 rounded-xl border border-neutral-200 hover:border-emerald-300 text-left flex items-center justify-between transition-all"
            >
              <span>🌾 Farmer Reporter</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>

            <Link
              to="/review-queue"
              onClick={() => login('agronomist', 'Dr. Anita Sharma (Agronomist)')}
              className="p-3 bg-neutral-50 hover:bg-sky-50 text-sky-900 rounded-xl border border-neutral-200 hover:border-sky-300 text-left flex items-center justify-between transition-all"
            >
              <span>👩‍🌾 Agronomist Queue</span>
              <ArrowRight className="w-4 h-4 text-sky-600" />
            </Link>

            <Link
              to="/map"
              onClick={() => login('officer', 'Rajesh Shinde (District Officer)')}
              className="p-3 bg-neutral-50 hover:bg-blue-50 text-blue-900 rounded-xl border border-neutral-200 hover:border-blue-300 text-left flex items-center justify-between transition-all"
            >
              <span>👔 Agri Officer Map</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>

            <Link
              to="/ai-studio"
              className="p-3 bg-neutral-50 hover:bg-purple-50 text-purple-900 rounded-xl border border-neutral-200 hover:border-purple-300 text-left flex items-center justify-between transition-all"
            >
              <span>🔬 AI Diagnosis Studio</span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Problem vs Solution & 3 Cards — Restored matching User Uploaded Image 2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Coarse Bulletin (The Problem) */}
          <div className="bg-rose-50/80 border border-rose-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-rose-900 font-extrabold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>TRADITIONAL DISTRICT BULLETIN (THE PROBLEM)</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-900">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rose-600">•</span>
                <span><strong>Coarse Aggregation:</strong> Combines entire districts into a single average score, missing 20-acre village clusters.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rose-600">•</span>
                <span><strong>Panic Vulnerability:</strong> When an alert goes out, anxious farmers flood the hotline with duplicate reports of the same field.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rose-600">•</span>
                <span><strong>False Escalations:</strong> Treats 50 phone calls about 1 field as a "50-field emergency", creating regional panic.</span>
              </li>
            </ul>
          </div>

          {/* FieldWatch Weighted Intelligence (The Solution) */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-950 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FIELDWATCH WEIGHTED INTELLIGENCE (THE SOLUTION)</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-emerald-600">•</span>
                <span><strong>Hyperlocal GIS Clustering:</strong> Groups reports by exact GeoJSON coordinates within a 500m–1km village radius.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-emerald-600">•</span>
                <span><strong>Same-Field Weight Decay (S1/N$):</strong> 10 reports on the exact same field automatically decay so panic copycats add zero false weight.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-emerald-600">•</span>
                <span><strong>≥ 3 Distinct Fields Outbreak Rule:</strong> An alert fires only when 3 distinct fields in proximity are photo-confirmed.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Interactive Module Cards matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Panic-Dampening Lab */}
          <Link
            to="/panic-lab"
            className="bg-white hover:bg-neutral-50 border border-neutral-300 p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-amber-600 transition-colors">
              Panic-Dampening Lab
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Run interactive live simulations showing how 3 distinct field reports trigger an alert, while a flood of 10+ anxiety copycat reports is mathematically suppressed.
            </p>
          </Link>

          {/* Card 2: AI Crop Diagnosis Studio */}
          <Link
            to="/ai-studio"
            className="bg-white hover:bg-neutral-50 border border-neutral-300 p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-purple-600 transition-colors">
              AI Crop Diagnosis Studio
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Upload leaf photos for vision lesion segmentation, confidence metrics, species identification, and official chemical/organic spraying prescriptions.
            </p>
          </Link>

          {/* Card 3: GIS Outbreak & Micro-Climate Map */}
          <Link
            to="/map"
            className="bg-white hover:bg-neutral-50 border border-neutral-300 p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-sky-600 transition-colors">
              GIS Outbreak & Micro-Climate Map
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Explore village boundaries with live micro-climate telemetry (Temperature, Humidity, Leaf Wetness, Satellite NDVI score).
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
