import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReviewTable from '../components/review-queue/ReviewTable';

export default function ReviewQueue() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/review-queue');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-neutral-300 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <span>{t('review.title')}</span>
          </h1>
          <p className="text-xs text-neutral-600 font-medium">
            {t('review.subtitle')}
          </p>
        </div>

        <button
          onClick={fetchQueue}
          disabled={loading}
          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      <ReviewTable reports={reports} onReviewComplete={fetchQueue} />
    </div>
  );
}
