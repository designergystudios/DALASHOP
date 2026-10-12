import React from 'react';
import { Layers, Check, X, Megaphone, Calendar, DollarSign, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { databaseService } from '../../services/supabaseClient';

export const AdQueueManager: React.FC = () => {
  const { adRequests, processAdApproval, formatPrice } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            City Billboard Ad Service Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review and dispatch digital billboard and district spotlight campaigns submitted by merchants
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {adRequests.map((ad) => (
          <div
            key={ad.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{ad.campaignTitle}</h3>
                  <p className="text-[11px] text-slate-400">
                    Vendor: <strong className="text-slate-300">{ad.stallName}</strong> · Placement:{' '}
                    <span className="text-indigo-400 font-semibold">{ad.placement}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400">
                  {formatPrice(ad.budgetKes)} ({ad.durationDays} days)
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    ad.status === 'active' || ad.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : ad.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {ad.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                Creative Notes & Billboard Specifications:
              </span>
              <p className="leading-relaxed">{ad.creativeNotes}</p>
            </div>

            {ad.status === 'pending_review' && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    processAdApproval(ad.id, 'rejected');
                    databaseService.broadcastDatabaseEvent({
                      id: `evt-ad-${Date.now()}`,
                      table: 'ad_design_requests',
                      eventType: 'UPDATE',
                      timestamp: new Date().toLocaleTimeString(),
                      recordSummary: `Ad Campaign: "${ad.campaignTitle}" marked REJECTED`,
                      latencyMs: 18,
                      payload: { ad_id: ad.id, status: 'rejected' },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => {
                    processAdApproval(ad.id, 'approved');
                    databaseService.broadcastDatabaseEvent({
                      id: `evt-ad-${Date.now()}`,
                      table: 'ad_design_requests',
                      eventType: 'UPDATE',
                      timestamp: new Date().toLocaleTimeString(),
                      recordSummary: `Ad Campaign Activated: "${ad.campaignTitle}" for ${ad.stallName}`,
                      latencyMs: 22,
                      payload: { ad_id: ad.id, status: 'approved', placement: ad.placement },
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950/40 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Activate in Virtual City</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
