import React from 'react';
import { MapPin, Star, Eye, ShoppingBag, ShieldCheck, ArrowRight, Store } from 'lucide-react';
import { Stall, ListingItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface VirtualStorefrontCardProps {
  stall: Stall;
  onPeekInside: (stall: Stall) => void;
  onSelectListing?: (item: ListingItem) => void;
}

export const VirtualStorefrontCard: React.FC<VirtualStorefrontCardProps> = ({
  stall,
  onPeekInside,
}) => {
  const { listings, formatPrice, districts } = useAppStore();
  const district = districts.find((d) => d.id === stall.districtId);
  const stallProducts = listings.filter((l) => l.stallId === stall.id);

  // Category vibrant color palette matching design constitution
  const categoryAccents: Record<string, { bg: string; text: string; border: string }> = {
    fashion: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    stays: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    events: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    tech: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    food: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    crafts: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const badgeStyle = categoryAccents[stall.category] || {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  };

  return (
    <article className="group rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* Storefront Striped Awning & Roof Accent */}
        <div className="relative">
          {/* Canopy Awning Stripes */}
          <div
            className="h-3.5 w-full shadow-inner"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${stall.themeColor}, ${stall.themeColor} 14px, #ffffff 14px, #ffffff 28px)`,
            }}
          />

          {/* Storefront Visual Banner */}
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-stone-100">
            <img
              src={stall.bannerUrl}
              alt={stall.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

            {/* Plot Tag & Live Status */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/95 text-stone-900 shadow-sm border border-stone-200">
                Plot {stall.plotNumber}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Open
              </span>
            </div>

            {/* Star Rating */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-stone-900 text-xs font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{stall.rating}</span>
            </div>

            {/* Avatar & Proprietor pill */}
            <div className="absolute -bottom-4 left-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0">
                <img
                  src={stall.avatarUrl}
                  alt={stall.ownerName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Storefront Details */}
        <div className="pt-6 p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-0.5">
                <span className="font-semibold text-stone-700">{stall.ownerName}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  {district?.name || 'Virtual City'}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 font-heading leading-tight group-hover:text-amber-700 transition-colors">
                {stall.name}
              </h3>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {stall.category}
            </span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {stall.bio}
          </p>

          {/* Mini Inventory Shelf (Preview products on display in this kiosk) */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Featured On Display ({stallProducts.length} items)
            </span>

            <div className="grid grid-cols-2 gap-2">
              {stallProducts.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-stone-50/80 border border-stone-100"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-stone-200">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-stone-800 truncate">{item.title}</p>
                    <p className="text-[10px] font-mono text-amber-700 font-bold">
                      {formatPrice(item.priceKes)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Storefront Base & Peek Inside Button */}
      <div className="p-4 sm:p-5 pt-0 mt-2 flex items-center justify-between border-t border-stone-100 pt-3">
        <div className="text-[11px] text-stone-500">
          <strong className="text-stone-800 font-bold">{stall.footfallToday}</strong> citizens browsing
        </div>

        <button
          onClick={() => onPeekInside(stall)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-900/10 hover:shadow-lg transition-all active:scale-95"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Peek Inside Shop</span>
        </button>
      </div>
    </article>
  );
};
