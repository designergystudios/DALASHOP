import React, { useState } from 'react';
import { X, Star, MapPin, ShoppingBag, ShieldCheck, Calendar, Clock, Check } from 'lucide-react';
import { ListingItem, Stall } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { LazyImage } from '../../components/common/LazyImage';

interface ListingDetailModalProps {
  item: ListingItem | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ item, onClose }) => {
  const { addToCart, formatPrice, stalls } = useAppStore();
  const [selectedBookingDate, setSelectedBookingDate] = useState('Tomorrow, 10:00 AM');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!item) return null;

  const stall = stalls.find((s) => s.id === item.stallId);

  const handleAddToCart = () => {
    addToCart(item, item.type === 'stay' || item.type === 'event' ? selectedBookingDate : undefined);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        <div className="relative aspect-[16/9] w-full bg-slate-950">
          <LazyImage
            src={item.thumbnail}
            alt={item.title}
            aspectRatio="aspect-[16/9]"
            priority
            categoryBadge={item.category}
          />
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="text-orange-400 font-medium">{item.stallName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {item.location}
              </span>
            </div>
            <h3 className="text-lg font-bold font-heading text-white">{item.title}</h3>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xl font-extrabold text-white">
                {formatPrice(item.priceKes)}
              </div>
              {item.originalPriceKes && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(item.originalPriceKes)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{item.rating}</span>
              <span className="text-slate-400">({item.reviewCount} reviews)</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

          {/* Stays or Event Booking Date Selector */}
          {(item.type === 'stay' || item.type === 'event') && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Booking Window:</span>
              </label>
              <input
                type="text"
                value={selectedBookingDate}
                onChange={(e) => setSelectedBookingDate(e.target.value)}
                placeholder="e.g. Next Saturday, 2 Nights"
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              {item.dates && <p className="text-[10px] text-cyan-400">Notice: {item.dates}</p>}
            </div>
          )}

          {/* Stall verification info */}
          {stall && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800">
                  <img src={stall.avatarUrl} alt={stall.ownerName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-white">{stall.ownerName}</p>
                  <p className="text-[10px] text-slate-400">Verified East Africa Artisan</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> M-Pesa Merchant
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-950/40'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to City Basket!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {item.type === 'stay' || item.type === 'event'
                      ? 'Reserve & Add to Basket'
                      : 'Add to City Basket'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
