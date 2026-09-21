import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Phone, Lock, ArrowRight, UserCheck, Users, Sprout, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleStandardLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('agronomist', 'Agronomist Officer');
      setSuccessMsg('Logged in successfully!');
      setLoading(false);
      setTimeout(() => navigate('/'), 600);
    }, 500);
  };

  const handleQuickDemoRole = (role, name, redirectPath) => {
    login(role, name);
    navigate(redirectPath);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8 text-emerald-200" />
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-900">FieldWatch Portal Access</h1>
        <p className="text-xs text-neutral-600 font-medium">
          Hyperlocal Pest & Outbreak Intelligence • Role-Based JWT Auth
        </p>
      </div>

      {/* 1-Click Instant Role Switcher (Inspired by Nagriksetu / SIH-project-main) */}
      <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
        <span className="text-xs font-extrabold text-amber-900 block flex items-center gap-1">
          <span>⚡ Instant 1-Click Role Quick Access:</span>
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleQuickDemoRole('farmer', 'Ramesh Patil (Farmer)', '/farmer-submit')}
            className="p-3 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 shadow-2xs text-left flex items-center justify-between transition-colors"
          >
            <span>🌾 Farmer</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('agronomist', 'Dr. Anita Sharma (Agronomist)', '/review-queue')}
            className="p-3 bg-white hover:bg-sky-50 text-sky-900 rounded-xl border border-sky-300 shadow-2xs text-left flex items-center justify-between transition-colors"
          >
            <span>👩‍🌾 Agronomist</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('officer', 'Rajesh Shinde (District Officer)', '/map')}
            className="p-3 bg-white hover:bg-blue-50 text-blue-900 rounded-xl border border-blue-300 shadow-2xs text-left flex items-center justify-between transition-colors"
          >
            <span>👔 Agri Officer</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('admin', 'System Administrator', '/')}
            className="p-3 bg-white hover:bg-purple-50 text-purple-900 rounded-xl border border-purple-300 shadow-2xs text-left flex items-center justify-between transition-colors"
          >
            <span>⚙️ Admin</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Standard Credentials Form */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-6 shadow-xs space-y-4">
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Mobile Phone Number:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Default demo password: password123</span>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
