import React from 'react';
import { Settings, Globe, Sliders, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-xs space-y-1">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
          <Settings className="w-7 h-7 text-primary" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs text-neutral-600">
          FieldWatch Configuration • i18n Localization • Demo Mode Weights
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-xs space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-neutral-900 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Default Interface Language</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${
                  i18n.language === lang.code
                    ? 'border-primary bg-primary-50 text-primary shadow-xs'
                    : 'border-neutral-300 text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="border-t border-neutral-200 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-neutral-900">Live Weight Visualizer Panel</h4>
              <p className="text-xs text-neutral-600">Displays real-time transparent weight breakdown on dashboard</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Active by Default
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
