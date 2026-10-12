import React, { useState } from 'react';
import { Megaphone, Star, ArrowRight, Sparkles, MapPin, Tag, ShieldCheck, Eye } from 'lucide-react';
import { SHOWCASE_ADVERTS } from '../../store/mockData';
import { useAppStore } from '../../store/useAppStore';
import { Stall } from '../../types';

interface ShowcaseAdvertsProps {
  onPeekInsideStall: (stall: Stall) => void;
}

export const ShowcaseAdverts: React.FC<ShowcaseAdvertsProps> = ({ onPeekInsideStall }) => {
  const { stalls, showcaseAdverts } = useAppStore();
  const adverts = showcaseAdverts && showcaseAdverts.length > 0 ? showcaseAdverts : SHOWCASE_ADVERTS;

  const handleOpenAdvert = (stallId: string) => {
    const stall = stalls.find((s) => s.id === stallId);
    if (stall) {
      onPeekInsideStall(stall);
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-300">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 font-heading">
              City Billboard & Sponsored Showcase
            </h2>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              In-City Ads
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Featured flagship units and sponsored district spotlights across Dala
          </p>
        </div>

        <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
          Verified East African Merchants
        </span>
      </div>

      {/* Adverts Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {adverts.map((ad) => {
          const matchedStall = stalls.find((s) => s.id === ad.stallId);

          return (
            <article
              key={ad.id}
              onClick={() => handleOpenAdvert(ad.stallId)}
              className="group cursor-pointer rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 overflow-hidden flex flex-col justify-between relative"
            >
              <div>
                {/* Visual Billboard Media */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                  <img
                    src={ad.image}
                    alt={ad.campaignTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

                  {/* Sponsor Ribbon */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 shadow-md border border-white/20 backdrop-blur-sm">
                      {ad.badge}
                    </span>
                  </div>

                  {/* Discount / Offer Tag */}
                  {ad.discountOffer && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-md">
                      <Tag className="w-3 h-3" />
                      <span>{ad.discountOffer}</span>
                    </div>
                  )}

                  {/* Merchant Plot Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {ad.districtName}
                    </span>
                    <h3 className="text-base font-bold font-heading text-white line-clamp-1 drop-shadow">
                      {ad.stallName}
                    </h3>
                  </div>
                </div>

                {/* Billboard Copy */}
                <div className="p-5 space-y-2">
                  <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {ad.campaignTitle}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {ad.tagline}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-stone-800">{ad.rating}</span>
                  <span className="text-stone-400 font-normal">Rating</span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 group-hover:bg-amber-500 text-amber-900 group-hover:text-stone-950 text-xs font-bold transition-all shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Peek Inside</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
