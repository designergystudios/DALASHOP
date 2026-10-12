import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, RefreshCw, Smartphone, DollarSign, Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { LeaseSubscription } from '../../types';

import { databaseService } from '../../services/supabaseClient';

export const RentSubscriptionManager: React.FC = () => {
  const { leases, updateLeaseStatus, formatPrice } = useAppStore();
  const [stkPushTriggered, setStkPushTriggered] = useState<string | null>(null);

  const handleTriggerMpesaStk = (stallId: string) => {
    setStkPushTriggered(stallId);
    setTimeout(() => {
      updateLeaseStatus(stallId, 'paid');
      const targetLease = leases.find((l) => l.stallId === stallId);
      if (targetLease) {
        databaseService.simulateRentSettlement(targetLease.stallName, targetLease.monthlyRentKes);
        databaseService.simulateRealtimeTransaction(targetLease.ownerName, targetLease.monthlyRentKes, 'rent_lease');
      }
      setStkPushTriggered(null);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Virtual Land Leases & SaaS Subscriptions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated East Africa rent collections via Safaricom Daraja API & Airtel Money
          </p>
        </div>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">Micro-Stall Plan</span>
          <div className="text-lg font-bold text-white font-heading mt-1">2,500 KES / mo</div>
          <p className="text-[11px] text-slate-400 mt-1">1 Kiosk slot, basic catalog, mobile money checkout</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-xs font-semibold text-indigo-400">Boutique Kiosk Plan</span>
          <div className="text-lg font-bold text-white font-heading mt-1">6,500 KES / mo</div>
          <p className="text-[11px] text-slate-400 mt-1">Prime corner plot, eco-stay booking engine, analytics</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-xs font-semibold text-emerald-400">Flagship Pavilion Plan</span>
          <div className="text-lg font-bold text-white font-heading mt-1">15,000 KES / mo</div>
          <p className="text-[11px] text-slate-400 mt-1">3D interactive custom space, top billboard priority</p>
        </div>
      </div>

      {/* Leases Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Stall / Merchant</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Monthly Rate</th>
                <th className="py-3 px-4">Billing Channel</th>
                <th className="py-3 px-4">Next Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Rent Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leases.map((lease) => (
                <tr key={lease.stallId} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{lease.stallName}</p>
                    <p className="text-[10px] text-slate-400">{lease.ownerName}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{lease.tier}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    {formatPrice(lease.monthlyRentKes)}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {lease.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{lease.nextBillingDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lease.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : lease.status === 'grace_period'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {lease.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {lease.status !== 'paid' ? (
                        <button
                          onClick={() => handleTriggerMpesaStk(lease.stallId)}
                          disabled={stkPushTriggered === lease.stallId}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition active:scale-95 disabled:opacity-50"
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>
                            {stkPushTriggered === lease.stallId ? 'Triggering STK...' : 'Send STK Push'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateLeaseStatus(lease.stallId, 'grace_period')}
                          className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                        >
                          Simulate Expiry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
