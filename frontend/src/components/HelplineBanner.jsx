import React from 'react';
import { PhoneCall, ShieldAlert, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HelplineBanner({ onOpenIvr }) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-emerald-900 text-white text-xs py-2 px-4 flex flex-col sm:flex-row items-center justify-between border-b border-emerald-800 gap-2 font-medium">
      <div className="flex items-center space-x-2">
        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          TOLL-FREE 24x7
        </span>
        <span>{t('nav.helpline_text')}: <strong className="font-mono text-amber-300">1800-180-1551</strong></span>
      </div>

      <div className="flex items-center space-x-3">
        <span className="hidden md:inline text-emerald-200 text-[11px]">
          Multi-Channel Support • English • हिन्दी • मराठी
        </span>
        <button
          onClick={onOpenIvr}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 shrink-0 whitespace-nowrap"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch IVR Call Simulator</span>
        </button>
      </div>
    </div>
  );
}
