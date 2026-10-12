import React, { useState, useEffect } from 'react';
import { Database, Activity, WifiOff, RefreshCw } from 'lucide-react';
import { databaseService, DatabaseStatus } from '../../services/supabaseClient';

interface DatabaseStatusBadgeProps {
  onOpenConsole?: () => void;
}

export const DatabaseStatusBadge: React.FC<DatabaseStatusBadgeProps> = ({ onOpenConsole }) => {
  const [status, setStatus] = useState<DatabaseStatus>(databaseService.getStatus());
  const [isPinging, setIsPinging] = useState(false);
  const [hasRecentEvent, setHasRecentEvent] = useState(false);

  useEffect(() => {
    const unsubStatus = databaseService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    const unsubEvents = databaseService.subscribeEvents(() => {
      setHasRecentEvent(true);
      const timer = setTimeout(() => setHasRecentEvent(false), 2000);
      return () => clearTimeout(timer);
    });

    return () => {
      unsubStatus();
      unsubEvents();
    };
  }, []);

  const handleManualPing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinging(true);
    await databaseService.pingDatabase();
    setTimeout(() => setIsPinging(false), 400);
  };

  const isConnected = status.isConnected && status.connectionState === 'connected';
  const isReconnecting = status.connectionState === 'reconnecting';

  return (
    <div
      onClick={onOpenConsole}
      role="button"
      tabIndex={0}
      title="Click to view Live Realtime Database Console & Event Stream"
      className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition cursor-pointer select-none active:scale-95 ${
        isConnected
          ? hasRecentEvent
            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-900 shadow-sm ring-2 ring-emerald-400/30'
            : 'bg-emerald-50/90 hover:bg-emerald-100/80 border-emerald-200 text-emerald-800'
          : isReconnecting
          ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 animate-pulse'
          : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
      }`}
    >
      {/* Pulse Status Indicator */}
      <div className="relative flex items-center justify-center">
        {isConnected ? (
          <>
            <span
              className={`absolute inline-flex h-2.5 w-2.5 rounded-full ${
                hasRecentEvent ? 'bg-emerald-400 animate-ping opacity-90' : 'bg-emerald-500 animate-pulse opacity-60'
              }`}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </>
        ) : isReconnecting ? (
          <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-rose-600" />
        )}
      </div>

      {/* DB Engine Name & Latency */}
      <div className="flex items-center gap-1.5">
        <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-700' : 'text-stone-500'}`} />
        <span className="font-bold tracking-tight">
          {isConnected ? 'Postgres Live' : isReconnecting ? 'Reconnecting' : 'DB Offline'}
        </span>
        {isConnected && (
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-200/60 px-1 rounded">
            {status.latencyMs}ms
          </span>
        )}
      </div>

      {/* Live Realtime Beacon */}
      {isConnected && status.activeRealtimeChannel && (
        <span
          className={`hidden sm:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold ${
            hasRecentEvent
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          }`}
        >
          <Activity className="w-2.5 h-2.5" />
          <span>Realtime</span>
        </span>
      )}

      {/* Ping Trigger Button */}
      <button
        type="button"
        onClick={handleManualPing}
        title="Ping Database"
        className="ml-0.5 p-1 rounded-md hover:bg-emerald-200/70 text-emerald-700 transition"
      >
        <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
