import React, { useState } from 'react';
import { UserCheck, Check, X, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { databaseService } from '../../services/supabaseClient';

export const UserModeration: React.FC = () => {
  const { moderationQueue, processModeration } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredItems = moderationQueue.filter(
    (item) => filter === 'all' || item.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Merchant Moderation & KYC Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify East African artisan credentials, tax compliance, and resolve flagged listings
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    item.targetType === 'kyc_verification'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : item.targetType === 'vendor_application'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {item.targetType === 'listing_report' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.targetTitle}</h3>
                  <p className="text-[11px] text-slate-400">
                    Applicant: <strong className="text-slate-300">{item.applicant}</strong> ·{' '}
                    <span>{item.district}</span> · <span>{item.submittedAt}</span>
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase self-start sm:self-center ${
                  item.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : item.status === 'rejected'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              {item.details}
            </p>

            {item.status === 'pending' && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    processModeration(item.id, 'rejected');
                    databaseService.simulateKYCApproval(item.applicant || item.targetTitle, 'rejected');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => {
                    processModeration(item.id, 'approved');
                    databaseService.simulateKYCApproval(item.applicant || item.targetTitle, 'approved');
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Issue Stall Plot</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
