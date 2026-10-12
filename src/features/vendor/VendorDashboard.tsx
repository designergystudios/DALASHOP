import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { VendorDashboardHeader } from '../../components/vendor/VendorDashboardHeader';
import { useAppStore } from '../../store/useAppStore';
import { ArrowUpRight, Megaphone, Package, CheckCircle2 } from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stalls, activeVendorStallId, formatPrice, listings, adRequests } = useAppStore();
  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];

  const vendorListings = listings.filter((l) => l.stallId === currentStall.id);
  const vendorAds = adRequests.filter((a) => a.vendorId === currentStall.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      {/* Streamlined Vendor Dashboard Header in Vibrant Light Mode */}
      <VendorDashboardHeader
        onQuickUploadProduct={() => navigate('/vendor/inventory')}
        onRequestProAd={() => navigate('/vendor/ads')}
        onCustomizeStorefront={() => navigate('/vendor/customize')}
      />

      {/* Main Content: Catalog Table & Active Billboard Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Catalog Overview */}
        <div className="lg:col-span-2 rounded-3xl border border-stone-200/90 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-heading">
                Storefront Inventory & Reservations
              </h3>
              <p className="text-xs text-stone-500">Live products and bookings on street display</p>
            </div>
            <Link
              to="/vendor/inventory"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Manage Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {vendorListings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-stone-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-stone-500 capitalize">
                      {item.category} · {item.type}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900">{formatPrice(item.priceKes)}</div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billboard Ad Status */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 font-heading">In-City Billboards</h3>
            <Link
              to="/vendor/ads"
              className="p-1 px-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 border border-amber-200"
            >
              + Order Ad
            </Link>
          </div>
          <p className="text-xs text-stone-500">
            Promote your kiosk on City Square Billboards or category spotlight banners.
          </p>

          <div className="space-y-3">
            {vendorAds.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-xs">
                No active billboard campaigns. Click above to order one.
              </div>
            ) : (
              vendorAds.map((ad) => (
                <div key={ad.id} className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{ad.campaignTitle}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ad.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ad.status === 'pending_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {ad.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex justify-between">
                    <span>{ad.placement}</span>
                    <span className="text-stone-900 font-bold">{formatPrice(ad.budgetKes)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
