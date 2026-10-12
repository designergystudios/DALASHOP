import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Building,
  Layers,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Megaphone,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DatabaseRealtimeConsole } from './DatabaseRealtimeConsole';
import { AdminMarketingManager } from './AdminMarketingManager';
import { databaseService } from '../../services/supabaseClient';

export const AdminDashboard: React.FC = () => {
  const { stalls, leases, adRequests, formatPrice, updateLeaseStatus } = useAppStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Compute required metrics
  const totalRentCollectedKes = leases
    .filter((l) => l.status === 'paid')
    .reduce((sum, l) => sum + l.monthlyRentKes, 0);

  const activeShopsCount = stalls.length;
  const pendingAdsCount = adRequests.filter((a) => a.status === 'pending_review').length;

  const handleTriggerAction = (message: string) => {
    setActionSuccessMessage(message);
    setActiveDropdown(null);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      {/* SaaS Governance Header */}
      <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              City Authority Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 font-heading mt-1">
            Dala Platform Oversight & SaaS ARR
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time digital land lease collections, merchant KYC moderation, and city ad queue oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#marketing-cms"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Hero, Logo & Offers</span>
          </a>
          <Link
            to="/admin/rent"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition"
          >
            <CreditCard className="w-3.5 h-3.5 text-stone-500" />
            <span>All Leases</span>
          </Link>
          <Link
            to="/admin/moderation"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>KYC Queue</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Required High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Rent Collected */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Rent Collected</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-heading">
            {formatPrice(totalRentCollectedKes)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium pt-0.5">
            +14.2% month-over-month via M-Pesa STK
          </p>
        </div>

        {/* Metric 2: Active Shops */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Active Shops</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-heading">
            {activeShopsCount} Storefronts
          </div>
          <p className="text-[11px] text-stone-500 font-medium pt-0.5">
            Occupying plots across 5 city avenues
          </p>
        </div>

        {/* Metric 3: Pending Ad Requests */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Pending Ad Requests</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 font-heading">
            {pendingAdsCount} Billboard Briefs
          </div>
          <p className="text-[11px] text-stone-500 font-medium pt-0.5">
            Requires 3D design queue approval
          </p>
        </div>

        {/* Metric 4: Platform System Health */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Payment Gateway Uptime</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">
            99.98%
          </div>
          <p className="text-[11px] text-stone-500 font-medium pt-0.5">
            Safaricom Daraja API latency 180ms
          </p>
        </div>
      </div>

      {/* Prominent Live Realtime Database Console Section */}
      <DatabaseRealtimeConsole />

      {/* Visual Asset CMS, Hero Carousel Upload, Billboard Showcase & Offers Manager */}
      <div id="marketing-cms">
        <AdminMarketingManager />
      </div>

      {/* Data Table with Action Dropdowns */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-heading">
              Virtual Storefront Leases & Land Subscriptions
            </h2>
            <p className="text-xs text-stone-500">
              Manage merchant tenancies, billing schedules, and automated M-Pesa STK collections
            </p>
          </div>
          <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
            {leases.length} Tenants Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Storefront & Proprietor</th>
                <th className="py-3.5 px-5">Tier Plan</th>
                <th className="py-3.5 px-5">Monthly Rent</th>
                <th className="py-3.5 px-5">Billing Channel</th>
                <th className="py-3.5 px-5">Next Due Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leases.map((lease) => (
                <tr key={lease.stallId} className="hover:bg-amber-50/20 transition">
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-stone-900 text-xs">{lease.stallName}</p>
                    <p className="text-[10px] text-stone-500">Proprietor: {lease.ownerName}</p>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-stone-800">{lease.tier}</td>
                  <td className="py-3.5 px-5 font-bold text-stone-900 font-mono">
                    {formatPrice(lease.monthlyRentKes)}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-stone-600">
                    {lease.paymentMethod}
                  </td>
                  <td className="py-3.5 px-5 text-stone-500">{lease.nextBillingDate}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lease.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : lease.status === 'grace_period'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {lease.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action Dropdown */}
                  <td className="py-3.5 px-5 text-right relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === lease.stallId ? null : lease.stallId)
                      }
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === lease.stallId && (
                      <div className="absolute right-5 mt-1 w-52 rounded-2xl bg-white border border-stone-200 shadow-xl z-30 py-1.5 text-left text-xs animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => {
                            updateLeaseStatus(lease.stallId, 'paid');
                            databaseService.simulateRentSettlement(lease.stallName, lease.monthlyRentKes);
                            databaseService.simulateRealtimeTransaction(lease.ownerName, lease.monthlyRentKes, 'mpesa_stk_rent');
                            handleTriggerAction(`Dispatched Safaricom Daraja STK Push to ${lease.ownerName} & settled lease in Postgres`);
                          }}
                          className="w-full px-3.5 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Trigger Daraja M-Pesa</span>
                        </button>
                        <button
                          onClick={() => {
                            handleTriggerAction(`Inspecting virtual stall ${lease.stallName}`);
                          }}
                          className="w-full px-3.5 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>View Virtual Kiosk</span>
                        </button>
                        <button
                          onClick={() => {
                            updateLeaseStatus(lease.stallId, 'grace_period');
                            databaseService.broadcastDatabaseEvent({
                              id: `evt-grace-${Date.now()}`,
                              table: 'subscriptions',
                              eventType: 'UPDATE',
                              timestamp: new Date().toLocaleTimeString(),
                              recordSummary: `Grace period granted: ${lease.stallName} granted 7 days extension`,
                              latencyMs: 19,
                              payload: {
                                stall: lease.stallName,
                                status: 'grace_period',
                                days_extended: 7,
                              },
                            });
                            handleTriggerAction(`Grace period granted for ${lease.stallName} (Recorded in DB)`);
                          }}
                          className="w-full px-3.5 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Grant 7-Day Grace</span>
                        </button>
                      </div>
                    )}
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
