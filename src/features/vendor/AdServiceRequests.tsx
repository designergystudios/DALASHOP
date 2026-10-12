import React, { useState } from 'react';
import { Megaphone, Plus, Clock, CheckCircle2, DollarSign, Sparkles, Send, ShieldCheck, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AdRequest } from '../../types';

export const AdServiceRequests: React.FC = () => {
  const { stalls, activeVendorStallId, adRequests, submitAdRequest, formatPrice } = useAppStore();
  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];

  const vendorAds = adRequests.filter((a) => a.vendorId === currentStall.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [placement, setPlacement] = useState<AdRequest['placement']>('City Square Billboard');
  const [durationDays, setDurationDays] = useState(7);
  const [creativeNotes, setCreativeNotes] = useState('');

  // Placement rates per day
  const dailyRate: Record<AdRequest['placement'], number> = {
    'City Square Billboard': 1500,
    'Featured Showcase Billboard': 1200,
    'District Spotlight': 800,
    'Offer of the Week Feature': 650,
    'Category Sponsor': 500,
  };

  const estimatedBudget = dailyRate[placement] * durationDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAdRequest({
      vendorId: currentStall.id,
      stallName: currentStall.name,
      campaignTitle,
      placement,
      durationDays,
      budgetKes: estimatedBudget,
      creativeNotes,
    });
    setCampaignTitle('');
    setCreativeNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            City Billboard & In-City Ad Service
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Boost footfall with prominent virtual skyline billboards and category sponsor banners
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Billboard Campaign</span>
        </button>
      </div>

      {/* Pricing / Placement Explainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">City Square Billboard</span>
            <span className="text-[10px] text-emerald-400 font-mono">1,500 KES/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Main virtual city center rotation. Guaranteed view by every citizen entering Dala.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-sky-900/40 bg-sky-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300">Featured Showcase Billboard</span>
            <span className="text-[10px] text-sky-400 font-mono">1,200 KES/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pin your storefront on the interactive billboard strip with live peek inside and artisan bio.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300">Offer of the Week Feature</span>
            <span className="text-[10px] text-rose-400 font-mono">650 KES/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Headline promotion on the homepage flash-deals carousel with countdown timer & discount badge.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">District Spotlight</span>
            <span className="text-[10px] text-emerald-400 font-mono">800 KES/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pinned banner inside your specific district (e.g. Retail Avenue or Hospitality Hills).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Category Sponsor</span>
            <span className="text-[10px] text-emerald-400 font-mono">500 KES/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Top position across category filters (Fashion, Crafts, Stays, Events, Food).
          </p>
        </div>
      </div>

      {/* Ad Campaigns List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-heading">Your Billboard Campaigns</h3>
          <span className="text-xs text-slate-400">{vendorAds.length} campaign(s) tracked</span>
        </div>

        <div className="divide-y divide-slate-800">
          {vendorAds.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No billboard campaigns launched yet. Click above to order your first in-city ad.
            </div>
          ) : (
            vendorAds.map((ad) => (
              <div key={ad.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{ad.campaignTitle}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ad.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ad.status === 'pending_review'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ad.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Placement: <strong className="text-slate-200">{ad.placement}</strong> · Duration:{' '}
                    <strong className="text-slate-200">{ad.durationDays} days</strong> · Notes:{' '}
                    <span className="italic">{ad.creativeNotes}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">{formatPrice(ad.budgetKes)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">M-Pesa STK Invoiced</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Ad Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-heading">
                Order City Billboard Space
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Campaign Headline</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  required
                  placeholder="e.g. Mashujaa Weekend Special Kikoy Drop"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Billboard Slot</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as AdRequest['placement'])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="City Square Billboard">City Square Billboard (1,500 KES/day)</option>
                  <option value="Featured Showcase Billboard">Featured Showcase Billboard (1,200 KES/day)</option>
                  <option value="Offer of the Week Feature">Offer of the Week Feature (650 KES/day)</option>
                  <option value="District Spotlight">District Spotlight (800 KES/day)</option>
                  <option value="Category Sponsor">Category Sponsor (500 KES/day)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Creative Brief & Billboard Visuals</label>
                <textarea
                  value={creativeNotes}
                  onChange={(e) => setCreativeNotes(e.target.value)}
                  rows={2}
                  required
                  placeholder="Tell our 3D design team how you want the neon billboard styled..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Campaign Budget:</span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatPrice(estimatedBudget)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-950/40"
              >
                Submit Ad to SaaS City Queue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
