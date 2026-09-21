import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, PhoneCall, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function AlertLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/alerts/log');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerTestAlert = async () => {
    try {
      await axios.post('/api/alerts/test-trigger', {});
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-neutral-300 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
            <span>Multi-Channel Alert Broadcast Log</span>
          </h1>
          <p className="text-xs text-neutral-600 font-medium">
            Language-aware SMS, WhatsApp & IVR call notifications dispatched to regional farmers
          </p>
        </div>

        <button
          onClick={triggerTestAlert}
          className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow-xs active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Trigger Demo Alert Broadcast</span>
        </button>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-neutral-300 text-center text-xs text-neutral-600">
            No alerts logged yet. Trigger a demo broadcast or submit 3 distinct field reports to trigger an alert!
          </div>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="bg-white p-5 rounded-xl border border-neutral-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                    ALERT FIRED
                  </span>
                  <span className="font-bold text-sm text-neutral-900">{log.trigger_reason}</span>
                </div>
                <span className="text-xs font-mono text-neutral-500">
                  {new Date(log.fired_at).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-xs text-neutral-600">
                <span>Recipients: <strong className="text-neutral-900">{log.recipient_count} Farmers</strong></span>
                <span>Channels: <strong className="text-neutral-900 uppercase">{log.channels_used?.join(', ')}</strong></span>
              </div>

              {/* Sample Message Preview */}
              {log.messages_sent && log.messages_sent.length > 0 && (
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs font-mono space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Sample Templated Message ({log.messages_sent[0].language}):</span>
                  <p className="text-neutral-800 font-sans">{log.messages_sent[0].message_text}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
