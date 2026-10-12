import React, { useRef } from 'react';
import { Flame, Clock, ChevronLeft, ChevronRight, ShoppingBag, Plus, Tag, ArrowRight } from 'lucide-react';
import { WEEKLY_OFFERS } from '../../store/mockData';
import { useAppStore } from '../../store/useAppStore';
import { ListingItem, Stall } from '../../types';

interface WeeklyOffersCarouselProps {
  onPeekInsideStall?: (stall: Stall) => void;
}

export const WeeklyOffersCarousel: React.FC<WeeklyOffersCarouselProps> = ({ onPeekInsideStall }) => {
  const { formatPrice, addToCart, listings, stalls, weeklyOffers } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const offers = weeklyOffers && weeklyOffers.length > 0 ? weeklyOffers : WEEKLY_OFFERS;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (listingId: string) => {
    const item = listings.find((l) => l.id === listingId);
    if (item) {
      addToCart(item);
    }
  };

  return (
    <section className="space-y-4">
      {/* Header with Countdown Badge & Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-200">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 font-heading">
              Offers of the Week & Flash Deals
            </h2>
            <span className="text-[10px] font-bold text-orange-800 bg-orange-100 border border-orange-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-600" />
              <span>Limited Time</span>
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Direct artisan markdowns with instant M-Pesa checkouts and reservation passes
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-stone-950 shadow-sm transition active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-stone-950 shadow-sm transition active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-none snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {offers.map((deal) => {
          const percentClaimed = Math.round((deal.claimedCount / deal.totalAvailable) * 100);

          return (
            <div
              key={deal.id}
              className="flex-shrink-0 w-[290px] sm:w-[320px] snap-start rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all duration-300 p-4 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner & Discount Pill */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 mb-3">
                  <img
                    src={deal.thumbnail}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md">
                    <span>-{deal.discountPercent}% OFF</span>
                  </div>

                  {/* Time Remaining */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-stone-900 shadow-sm backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{deal.endsInHours}h Left</span>
                  </div>

                  {/* Stall Name & District */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] text-amber-300 font-bold block">
                      {deal.districtName}
                    </span>
                    <span className="text-xs font-bold truncate block drop-shadow">
                      {deal.stallName}
                    </span>
                  </div>
                </div>

                {/* Deal Info */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {deal.badge}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                    {deal.title}
                  </h3>

                  {/* Pricing Comparison */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-black text-stone-900 font-mono">
                      {formatPrice(deal.salePriceKes)}
                    </span>
                    <span className="text-xs text-stone-400 line-through font-mono">
                      {formatPrice(deal.originalPriceKes)}
                    </span>
                  </div>

                  {/* Claimed Inventory Progress Bar */}
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                      <span>Claimed: {deal.claimedCount}/{deal.totalAvailable}</span>
                      <span className="font-bold text-amber-700">{percentClaimed}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => handleAddToCart(deal.listingId)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Claim Deal</span>
                </button>

                {onPeekInsideStall && (
                  <button
                    onClick={() => {
                      const stall = stalls.find((s) => s.id === deal.stallId);
                      if (stall) onPeekInsideStall(stall);
                    }}
                    className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 text-stone-600 hover:text-stone-900 text-xs font-semibold transition"
                    title="Peek inside shop"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
