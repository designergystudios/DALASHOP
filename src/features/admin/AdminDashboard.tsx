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
  Filter,
  DollarSign,
  Users,
  Activity,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DatabaseRealtimeConsole } from './DatabaseRealtimeConsole';
import { AdminMarketingManager } from './AdminMarketingManager';
import { databaseService } from '../../services/supabaseClient';
import { AdminVendorOnboarding } from './AdminVendorOnboarding';

export const AdminDashboard: React.FC = () => {
  const { stalls, leases, adRequests, formatPrice, updateLeaseStatus } = useAppStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'grace_period' | 'overdue'>('all');

  // Compute required metrics
  const totalRentCollectedKes = leases
    .filter((l) => l.status === 'paid')
    .reduce((sum, l) => sum + l.monthlyRentKes, 0);

  const activeShopsCount = stalls.length;
  const pendingAdsCount = adRequests.filter((a) => a.status === 'pending_review').length;

  const filteredLeases = leases.filter((l) => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  const handleTriggerAction = (message: string) => {
    setActionSuccessMessage(message);
    setActiveDropdown(null);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 pb-16">
      {/* Executive SaaS Governance Header */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-stone-50/80 to-amber-50/30 border border-stone-200/90 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              SaaS Control Center · Live Production
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading tracking-tight">
            Dala Platform Command & Revenue Operations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Real-time digital land lease collections, merchant KYC moderation, M-Pesa automated billing, and city ad queue oversight across Kisumu districts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="#marketing-cms"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Megaphone className="w-4 h-4" />
            <span>Marketing & Offers CMS</span>
          </a>
          <Link
            to="/admin/rent"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 shadow-xs transition"
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>All Leases</span>
          </Link>
          <Link
            to="/admin/moderation"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 shadow-xs transition"
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>KYC Queue</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-md animate-in fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* High-Level Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Rent Collected */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Rent Collected</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 font-heading">
            {formatPrice(totalRentCollectedKes)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% MoM via M-Pesa STK</span>
          </div>
        </div>

        {/* Metric 2: Active Shops */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Storefronts</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-2xs">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 font-heading">
            {activeShopsCount} Shops
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Occupying plots across 5 city avenues
          </p>
        </div>

        {/* Metric 3: Pending Ad Requests */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pending Ad Briefs</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-800 font-heading">
            {pendingAdsCount} Billboards
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Requires 3D design queue approval
          </p>
        </div>

        {/* Metric 4: Platform System Health */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Daraja API Uptime</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800 font-heading">
            99.98%
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Safaricom gateway latency 180ms
          </p>
        </div>
      </div>

      {/* Prominent Live Realtime Database Console Section */}
      <DatabaseRealtimeConsole />

      {/* Vendor Onboarding & Storefront Provisioning */}
      <AdminVendorOnboarding />

      {/* Visual Asset CMS, Hero Carousel Upload, Billboard Showcase & Offers Manager */}
      <div id="marketing-cms">
        <AdminMarketingManager />
      </div>

      {/* Data Table with Action Dropdowns & Filters */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 font-heading">
              Virtual Storefront Leases & Land Subscriptions
            </h2>
            <p className="text-xs text-stone-500">
              Manage merchant tenancies, billing schedules, and automated M-Pesa STK collections
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-stone-500 ml-2" />
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                All ({leases.length})
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'paid' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilterStatus('grace_period')}
                className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'grace_period' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Grace
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/90 border-b border-stone-200/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Storefront & Proprietor</th>
                <th className="py-4 px-6">Tier Plan</th>
                <th className="py-4 px-6">Monthly Rent</th>
                <th className="py-4 px-6">Billing Channel</th>
                <th className="py-4 px-6">Next Due Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLeases.map((lease) => (
                <tr key={lease.stallId} className="hover:bg-amber-50/30 transition">
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-stone-900 text-xs">{lease.stallName}</p>
                    <p className="text-[11px] text-stone-500">Proprietor: {lease.ownerName}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-800 text-[11px]">
                      {lease.tier}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-stone-900 font-mono">
                    {formatPrice(lease.monthlyRentKes)}
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-stone-600 font-medium">
                    {lease.paymentMethod}
                  </td>
                  <td className="py-4 px-6 text-stone-600 font-medium">{lease.nextBillingDate}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        lease.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                          : lease.status === 'grace_period'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs'
                          : 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                      }`}
                    >
                      {lease.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action Dropdown */}
                  <td className="py-4 px-6 text-right relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === lease.stallId ? null : lease.stallId)
                      }
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition border border-stone-200 shadow-2xs"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === lease.stallId && (
                      <div className="absolute right-6 mt-1 w-56 rounded-2xl bg-white border border-stone-200 shadow-2xl z-30 py-2 text-left text-xs animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => {
                            updateLeaseStatus(lease.stallId, 'paid');
                            databaseService.simulateRentSettlement(lease.stallName, lease.monthlyRentKes);
                            databaseService.simulateRealtimeTransaction(lease.ownerName, lease.monthlyRentKes, 'mpesa_stk_rent');
                            handleTriggerAction(`Dispatched Safaricom Daraja STK Push to ${lease.ownerName} & settled lease in Postgres`);
                          }}
                          className="w-full px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition font-semibold"
                        >
                          <Smartphone className="w-4 h-4 text-amber-600" />
                          <span>Trigger Daraja M-Pesa STK</span>
                        </button>
                        <button
                          onClick={() => {
                            handleTriggerAction(`Inspecting virtual stall ${lease.stallName}`);
                          }}
                          className="w-full px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition font-semibold"
                        >
                          <Eye className="w-4 h-4 text-stone-500" />
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
                          className="w-full px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition font-semibold"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
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
