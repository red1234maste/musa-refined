import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import axios from 'axios';
import FarmerDirectoryTable from '../components/farmer-directory/FarmerDirectoryTable';

export default function FarmerDirectoryPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/farmers');
      setFarmers(res.data.farmers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-neutral-300 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
            <Users className="w-7 h-7 text-primary" />
            <span>Farmer Reputation Directory</span>
          </h1>
          <p className="text-xs text-neutral-600 font-medium">
            Dynamic Trust Scores • Dynamic Multipliers • Historical Confirmations
          </p>
        </div>

        <button
          onClick={fetchFarmers}
          disabled={loading}
          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      <FarmerDirectoryTable farmers={farmers} />
    </div>
  );
}
