import React from 'react';
import { X, Star, MapPin, Store, Phone, ShieldCheck, ShoppingBag, Plus, ArrowRight, Eye } from 'lucide-react';
import { Stall, ListingItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface PeekInsideShopModalProps {
  stall: Stall | null;
  onClose: () => void;
  onOpenListing: (listing: ListingItem) => void;
}

export const PeekInsideShopModal: React.FC<PeekInsideShopModalProps> = ({
  stall,
  onClose,
  onOpenListing,
}) => {
  const { listings, formatPrice, addToCart, districts } = useAppStore();

  if (!stall) return null;

  const district = districts.find((d) => d.id === stall.districtId);
  const stallListings = listings.filter((l) => l.stallId === stall.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-stone-200/80 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-md backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Storefront Awning / Banner Header */}
        <div className="relative aspect-[21/9] w-full bg-stone-100 overflow-hidden">
          <img
            src={stall.bannerUrl}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Awning Scallop trim simulation */}
          <div
            className="absolute top-0 inset-x-0 h-3"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${stall.themeColor}, ${stall.themeColor} 15px, #ffffff 15px, #ffffff 30px)`,
            }}
          />

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-lg flex-shrink-0">
                <img src={stall.avatarUrl} alt={stall.ownerName} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-heading">{stall.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                    Plot {stall.plotNumber}
                  </span>
                </div>
                <p className="text-xs text-stone-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{district?.name || 'Virtual City'}</span>
                  <span>·</span>
                  <span>{stall.tier}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{stall.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Storefront Interior Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Artisan Story */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Storefront Story & Craft</span>
              </span>
              <span className="text-stone-500">Proprietor: <strong className="text-stone-800">{stall.ownerName}</strong></span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{stall.bio}</p>
          </div>

          {/* Live Catalog Shelves */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-heading">
                Storefront Inventory & Passes ({stallListings.length})
              </h3>
              <span className="text-xs text-stone-500">M-Pesa STK Instant Checkout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {stallListings.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-3 p-3 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      <span className="text-xs font-bold text-amber-700 font-mono">
                        {formatPrice(item.priceKes)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] transition active:scale-95 shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Verification Footer */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-stone-700 font-medium">Verified Merchant License</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono">{stall.contactMpesa}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
