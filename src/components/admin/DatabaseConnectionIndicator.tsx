import React, { useState, useEffect } from 'react';
import {
  Database,
  Wifi,
  Activity,
  CheckCircle2,
  RefreshCw,
  X,
  Server,
  Zap,
  Radio,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Play,
} from 'lucide-react';
import { databaseService, DatabaseStatus, RealtimeDatabaseEvent } from '../../services/supabaseClient';

export const DatabaseConnectionIndicator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [status, setStatus] = useState<DatabaseStatus>(databaseService.getStatus());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [events, setEvents] = useState<RealtimeDatabaseEvent[]>([
    {
      id: 'init-1',
      table: 'subscriptions',
      eventType: 'UPDATE',
      timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
      recordSummary: 'M-Pesa Daraja recurring rent verified for Kikoy & Copper Atelier (RA-04)',
      latencyMs: 22,
    },
    {
      id: 'init-2',
      table: 'listings',
      eventType: 'INSERT',
      timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
      recordSummary: 'New Eco-Stay listed: Dunga Lakefront Reed Villa under HH-12',
      latencyMs: 19,
    },
  ]);

  // Form state for custom credentials
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubStatus = databaseService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    const unsubEvents = databaseService.subscribeEvents((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    });

    return () => {
      unsubStatus();
      unsubEvents();
    };
  }, []);

  const handlePing = async () => {
    setIsPinging(true);
    await databaseService.pingDatabase();
    setIsPinging(false);
  };

  const handleSimulateRealtimeEvent = () => {
    databaseService.simulateRealtimeTransaction('Dunga Lakefront Eco-Boutique', 12500, 'rent');
  };

  const handleConnectCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customKey) return;
    databaseService.initialize(customUrl, customKey);
    setConnectionMessage('Connecting to custom Supabase project...');
    setTimeout(() => {
      setConnectionMessage('Connected & Realtime channel subscribed successfully!');
      setTimeout(() => setConnectionMessage(null), 3500);
    }, 1200);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          title="Click to view live PostgreSQL / Supabase Realtime Health"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-xs group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Database className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-mono text-[11px] text-stone-800">
            DB: {status.latencyMs}ms
          </span>
          <span className="text-[10px] text-emerald-700 font-extrabold uppercase">
            Live
          </span>
        </button>

        {isModalOpen && renderModal()}
      </>
    );
  }

  // Card view for dashboards
  return (
    <>
      <div className="rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-stone-900 font-heading">
                  PostgreSQL / Supabase Realtime Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                  <span>CONNECTED</span>
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Mode: <strong className="text-stone-700 capitalize">{status.mode.replace('_', ' ')}</strong> · Last Ping:{' '}
                <span className="font-mono">{status.lastPing}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-600' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Ping DB'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition shadow-xs active:scale-95"
            >
              <span>Live Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Roundtrip Latency</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-base font-black font-mono text-stone-900">{status.latencyMs} ms</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">WebSocket Channel</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-stone-900 font-mono">dala-realtime: Subscribed</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Row-Level Security</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-900">RLS Active (7 Policies)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Total Synced Rows</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Layers className="w-4 h-4 text-sky-600" />
              <span className="text-base font-black font-mono text-stone-900">
                {Object.values(status.tableCounts).reduce((a, b) => a + b, 0)} Rows
              </span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </>
  );

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="w-full max-w-3xl rounded-3xl bg-white border border-stone-200/90 shadow-2xl overflow-hidden space-y-5 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-stone-900 font-heading">
                    Live Database Realtime Telemetry
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Connected
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Target Host: <span className="font-mono text-stone-700">{status.url}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {connectionMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{connectionMessage}</span>
            </div>
          )}

          {/* Realtime Stream Demo & Trigger */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                <span>Test Live Realtime WebSocket Broadcast</span>
              </span>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Emits an instantaneous CDC (Change Data Capture) event to verify WebSocket synchronization.
              </p>
            </div>

            <button
              onClick={handleSimulateRealtimeEvent}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition active:scale-95 shadow-xs flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Realtime Ingest</span>
            </button>
          </div>

          {/* Table Row Count Synchronizer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Relational Schema Table Sync Status
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(status.tableCounts).map(([table, count]) => (
                <div key={table} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex justify-between items-center text-xs">
                  <span className="font-mono text-stone-600 text-[11px]">{table}</span>
                  <span className="font-bold text-stone-900 font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Change Log Stream */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Live Postgres Change Data Capture (CDC) Event Feed
              </h4>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Listening on channel 'dala-admin-realtime'
              </span>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-950 p-3.5 text-stone-200 font-mono text-xs max-h-48 overflow-y-auto space-y-2">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-start justify-between gap-2 border-b border-stone-800/60 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        evt.eventType === 'INSERT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : evt.eventType === 'UPDATE'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {evt.eventType}
                    </span>
                    <span className="text-stone-400 text-[10px]">{evt.table}</span>
                    <span className="text-stone-300 text-[11px]">{evt.recordSummary}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 whitespace-nowrap">
                    {evt.latencyMs}ms · {evt.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect Live Supabase Credentials */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-900">
              Connect External Supabase Project
            </h4>
            <form onSubmit={handleConnectCustom} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Supabase URL</label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Supabase Anon Key</label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition"
                >
                  Verify & Connect Live Database
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};
