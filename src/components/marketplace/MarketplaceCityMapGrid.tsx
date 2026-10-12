import React, { useState } from 'react';
import {
  ShoppingBag,
  Hotel,
  Sparkles,
  Briefcase,
  HeartPulse,
  Users,
  Compass,
  Search,
  Flame,
  Sun,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { HeroImageCarousel } from './HeroImageCarousel';
import { ShowcaseAdverts } from './ShowcaseAdverts';
import { WeeklyOffersCarousel } from './WeeklyOffersCarousel';
import { VirtualStorefrontCard } from './VirtualStorefrontCard';
import { PeekInsideShopModal } from './PeekInsideShopModal';
import { Stall, ListingCategory } from '../../types';

export const MarketplaceCityMapGrid: React.FC = () => {
  const {
    districts,
    stalls,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const [activePeekStall, setActivePeekStall] = useState<Stall | null>(null);

  // District icons mapping
  const districtIcons: Record<string, React.ElementType> = {
    'retail-avenue': ShoppingBag,
    'hospitality-hills': Hotel,
    'entertainment-square': Sparkles,
    'freelancer-hub': Briefcase,
    'wellness-ward': HeartPulse,
  };

  const categories: { id: ListingCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Stalls', icon: '🏙️' },
    { id: 'fashion', label: 'Retail & Fashion', icon: '🧵' },
    { id: 'stays', label: 'Villas & Stays', icon: '🏡' },
    { id: 'events', label: 'Festivals & Comedy', icon: '🎟️' },
    { id: 'tech', label: 'Freelancers & 3D', icon: '💻' },
    { id: 'food', label: 'Coffee & Spices', icon: '☕' },
  ];

  const currentDistrict = districts.find((d) => d.id === selectedDistrictId);

  // Filter stalls based on selected district and search query
  const filteredStalls = stalls.filter((stall) => {
    const matchesDistrict =
      selectedDistrictId === 'all' || stall.districtId === selectedDistrictId;
    const matchesCategory =
      selectedCategory === 'all' || stall.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* 1. Eye-Catchy Hero Background Image Carousel */}
      <HeroImageCarousel
        onExploreDistrict={(distId) => {
          setSelectedDistrictId(distId);
          // smooth scroll to storefronts section
          const el = document.getElementById('storefronts-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Offers of the Week / Flash Deals Carousel */}
      <WeeklyOffersCarousel onPeekInsideStall={(stall) => setActivePeekStall(stall)} />

      {/* 3. Showcase Adverts (In-City Digital Billboards & Sponsored Spotlights) */}
      <ShowcaseAdverts onPeekInsideStall={(stall) => setActivePeekStall(stall)} />

      {/* 4. Interactive City Map / District View Selector */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 font-heading flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>City Map Districts</span>
            </h2>
            <p className="text-xs text-stone-500">
              Filter storefronts across Dala’s 5 active commercial sectors
            </p>
          </div>

          <button
            onClick={() => setSelectedDistrictId('all')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition ${
              selectedDistrictId === 'all'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
            }`}
          >
            Show All Districts ({districts.length})
          </button>
        </div>

        {/* 5 Distinctive District Avenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {districts.map((d) => {
            const isSelected = selectedDistrictId === d.id;
            const Icon = districtIcons[d.id] || ShoppingBag;

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(isSelected ? 'all' : d.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50/50 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: `${d.accentColor}15`,
                        color: d.accentColor,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      {d.country}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 font-heading">{d.name}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {d.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-600" />
                    <span>{d.activeCitizens.toLocaleString()}</span>
                  </span>
                  <span className="font-bold text-stone-800">{d.totalStalls} stalls</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Category Segmented Filter Bar */}
      <section id="storefronts-section" className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-2xl border border-stone-200 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Viewing <strong className="text-stone-900 font-bold">{filteredStalls.length}</strong> storefronts{' '}
            {currentDistrict ? `along ${currentDistrict.name}` : 'across all districts'}
          </div>
        </div>

        {/* 6. Virtual Storefronts Street Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStalls.map((stall) => (
            <VirtualStorefrontCard
              key={stall.id}
              stall={stall}
              onPeekInside={(s) => setActivePeekStall(s)}
            />
          ))}
        </div>
      </section>

      {/* Peek Inside Shop Modal */}
      <PeekInsideShopModal
        stall={activePeekStall}
        onClose={() => setActivePeekStall(null)}
        onOpenListing={() => {}}
      />
    </div>
  );
};
