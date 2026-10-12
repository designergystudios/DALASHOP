import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAppStore } from '../../store/useAppStore';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { offlineQueuedOrders, clearOfflineQueue } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncNow = () => {
    if (!isOnline || offlineQueuedOrders.length === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      clearOfflineQueue();
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  if (isOnline && offlineQueuedOrders.length === 0 && !syncSuccess) {
    return null;
  }

  return (
    <aside aria-label="Network status" className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:max-w-md z-40">
      {!isOnline && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-950/90 border border-amber-800/80 text-amber-200 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Offline Mode Active</p>
              <p className="text-[11px] text-amber-300/90">
                Browsing cached stalls & catalog. Changes will sync on reconnection.
              </p>
            </div>
          </div>
          {offlineQueuedOrders.length > 0 && (
            <span className="text-[11px] font-mono bg-amber-900/80 px-2 py-0.5 rounded text-amber-200 flex-shrink-0">
              {offlineQueuedOrders.length} queued
            </span>
          )}
        </div>
      )}

      {isOnline && offlineQueuedOrders.length > 0 && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-800/80 text-emerald-200 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Back Online!</p>
              <p className="text-[11px] text-emerald-300/90">
                You have {offlineQueuedOrders.length} offline checkout request(s) ready to sync.
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      )}

      {syncSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-emerald-700/80 text-emerald-300 shadow-xl backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">All pending virtual stall transactions synced successfully!</span>
        </div>
      )}
    </aside>
  );
};
