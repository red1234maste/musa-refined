import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  Map,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  PhoneCall,
  Globe,
  Users,
  User,
  Sparkles,
  Sliders,
  ChevronDown,
  LayoutGrid,
  FileText,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenIvr }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  const primaryNavItems = [
    { path: '/', label: t('nav.cover'), icon: Sprout },
    { path: '/farmer-submit', label: t('nav.farmer_submit'), icon: UserCheck },
    { path: '/tracker', label: t('nav.tracker'), icon: Search },
    { path: '/map', label: t('nav.map'), icon: Map },
    { path: '/ai-studio', label: t('nav.ai_studio'), icon: Sparkles },
    { path: '/panic-lab', label: t('nav.panic_lab'), icon: Sliders },
  ];

  const secondaryNavItems = [
    { path: '/review-queue', label: t('nav.review_queue'), icon: ShieldCheck },
    { path: '/farmer-directory', label: t('nav.farmer_directory'), icon: Users },
    { path: '/alert-log', label: t('nav.alert_log'), icon: AlertTriangle },
  ];

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
      <div className="w-full max-w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-hover transition-colors">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-neutral-900 tracking-tight block leading-none">
                FieldWatch
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">Outbreak Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1 shrink-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-1.5 lg:px-2.5 py-1 lg:py-1.5 rounded-lg text-[11px] xl:text-xs font-bold flex items-center space-x-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-50 text-primary border border-primary/20 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More Modules Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center space-x-1 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-neutral-500" />
                <span>{t('nav.more')}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 hover:text-primary flex items-center space-x-2 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar: i18n, User Badge, Phone IVR */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-neutral-500 ml-1.5 mr-1" />
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  i18n.language === 'en' ? 'bg-primary text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  i18n.language === 'hi' ? 'bg-primary text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => changeLanguage('mr')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  i18n.language === 'mr' ? 'bg-primary text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Login / Active User Badge */}
            <Link
              to="/login"
              className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : t('nav.login')}</span>
            </Link>

            {/* Phone IVR Simulator CTA Button */}
            <button
              onClick={onOpenIvr}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-transform active:scale-95 shadow-2xs shrink-0 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Phone IVR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
