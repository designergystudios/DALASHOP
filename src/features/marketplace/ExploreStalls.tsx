import React, { useState } from 'react';
import { Search, MapPin, Store, Star, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VirtualStorefrontCard } from '../../components/marketplace/VirtualStorefrontCard';
import { PeekInsideShopModal } from '../../components/marketplace/PeekInsideShopModal';
import { Stall } from '../../types';

export const ExploreStalls: React.FC = () => {
  const { stalls, districts } = useAppStore();
  const [districtFilter, setDistrictFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePeekStall, setActivePeekStall] = useState<Stall | null>(null);

  const filteredStalls = stalls.filter((s) => {
    const matchesDistrict = districtFilter === 'all' || s.districtId === districtFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading">
            Virtual City Kiosks & Pavilions
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified artisan and independent merchant plots operating across East Africa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search kiosks or artisans..."
              className="pl-9 pr-4 py-2 text-xs rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* District Pill Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setDistrictFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            districtFilter === 'all'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          All Districts ({districts.length})
        </button>
        {districts.map((d) => (
          <button
            key={d.id}
            onClick={() => setDistrictFilter(d.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              districtFilter === d.id
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Storefronts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStalls.map((stall) => (
          <VirtualStorefrontCard
            key={stall.id}
            stall={stall}
            onPeekInside={(s) => setActivePeekStall(s)}
          />
        ))}
      </div>

      {/* Peek Inside Modal */}
      <PeekInsideShopModal
        stall={activePeekStall}
        onClose={() => setActivePeekStall(null)}
        onOpenListing={() => {}}
      />
    </div>
  );
};
