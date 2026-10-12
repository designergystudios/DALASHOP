import React, { useState } from 'react';
import {
  Store,
  Eye,
  Plus,
  Package,
  Calendar,
  Sparkles,
  TrendingUp,
  Users,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Palette,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Stall } from '../../types';

interface VendorDashboardHeaderProps {
  onQuickUploadProduct?: (type: 'product' | 'stay' | 'event') => void;
  onRequestProAd?: () => void;
  onCustomizeStorefront?: () => void;
}

export const VendorDashboardHeader: React.FC<VendorDashboardHeaderProps> = ({
  onQuickUploadProduct,
  onRequestProAd,
  onCustomizeStorefront,
}) => {
  const { stalls, activeVendorStallId, formatPrice, listings, districts } = useAppStore();
  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];
  const district = districts.find((d) => d.id === currentStall.districtId);
  const stallListings = listings.filter((l) => l.stallId === currentStall.id);

  const [isOpenLive, setIsOpenLive] = useState(true);

  return (
    <div className="space-y-6">
      {/* 1. Top Section: Live Storefront Mini-Preview & Merchant Stats */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-5 sm:p-7 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400/10 via-orange-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Merchant Identity & Status */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md bg-stone-100 flex-shrink-0">
                  <img
                    src={currentStall.avatarUrl}
                    alt={currentStall.ownerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading">
                    {currentStall.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Plot {currentStall.plotNumber}
                  </span>
                </div>

                <p className="text-xs text-stone-500 mt-1">
                  Proprietor: <strong className="text-stone-800">{currentStall.ownerName}</strong> ·{' '}
                  <span className="text-amber-800 font-semibold">{district?.name || 'Retail Avenue'}</span> ·{' '}
                  <span className="text-stone-600">{currentStall.tier}</span>
                </p>

                {/* Live Status Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsOpenLive(!isOpenLive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                      isOpenLive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOpenLive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                      }`}
                    />
                    <span>{isOpenLive ? 'Storefront Open on Street' : 'Storefront Closed'}</span>
                  </button>

                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-600">
                    Safaricom M-Pesa Merchant Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[11px] text-stone-500 block">30-Day Revenue</span>
                <span className="text-base font-bold text-stone-900 font-heading mt-0.5 block">
                  {formatPrice(currentStall.salesMonthKes)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[11px] text-stone-500 block">Today’s Footfall</span>
                <span className="text-base font-bold text-amber-700 font-heading mt-0.5 block">
                  {currentStall.footfallToday} visits
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[11px] text-stone-500 block">Active Listings</span>
                <span className="text-base font-bold text-stone-900 font-heading mt-0.5 block">
                  {stallListings.length} items
                </span>
              </div>
            </div>
          </div>

          {/* Miniature Live Storefront 3D Kiosk Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200/90 bg-stone-50/60 p-3 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Live Virtual Kiosk Preview</span>
                </span>
                {onCustomizeStorefront && (
                  <button
                    onClick={onCustomizeStorefront}
                    className="text-amber-700 font-bold hover:underline text-[11px]"
                  >
                    Customize Style
                  </button>
                )}
              </div>

              {/* Mini Kiosk Display */}
              <div className="rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm">
                <div
                  className="h-2.5 w-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${currentStall.themeColor}, ${currentStall.themeColor} 10px, #ffffff 10px, #ffffff 20px)`,
                  }}
                />
                <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone-100">
                  <img
                    src={currentStall.bannerUrl}
                    alt={currentStall.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white text-[11px] font-bold">
                    {currentStall.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Easy Inventory Upload Action Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 font-heading uppercase tracking-wider text-xs">
            Quick Catalog & Booking Uploads
          </h2>
          <span className="text-xs text-stone-500">Add directly to your street kiosk shelf</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            onClick={() => onQuickUploadProduct?.('product')}
            className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition text-left flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                + Physical Product
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Upload jackets, beadwork, sculptures or coffee bags
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickUploadProduct?.('stay')}
            className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition text-left flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                + Eco-Stay / Room
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Set nightly rate, Lake Victoria reed villa & weekend passes
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickUploadProduct?.('event')}
            className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition text-left flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                + Event / Ticket Pass
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Live acoustic session, guided tour or artisan workshop
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. One-Click "Request Pro Ad Design" CTA Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-stone-950 shadow-md">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/20 backdrop-blur-sm text-stone-950 text-xs font-extrabold">
              <Megaphone className="w-3.5 h-3.5" />
              <span>City Skyline Billboard Campaigns</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-950 font-heading">
              Boost your footfall with 3D Billboard Ads
            </h2>
            <p className="text-xs text-stone-900/90 leading-relaxed font-medium">
              Our in-house East African design guild creates custom 3D neon billboards, district spotlights, and category sponsor banners tailored to your stall.
            </p>
          </div>

          <button
            onClick={onRequestProAd}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs shadow-xl transition active:scale-95 group"
          >
            <span>Request Pro Ad Design</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
