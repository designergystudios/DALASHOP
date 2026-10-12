import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Grid,
  Compass,
  ShoppingBag,
  Store,
  Palette,
  Package,
  Megaphone,
  LayoutDashboard,
  CreditCard,
  UserCheck,
  Layers,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface MobileBottomNavProps {
  portal: 'marketplace' | 'vendor' | 'admin';
  onOpenPortalSwitcher: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ portal, onOpenPortalSwitcher }) => {
  const location = useLocation();
  const { cart, setIsCartOpen, moderationQueue, adRequests } = useAppStore();

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const pendingModCount = moderationQueue.filter((m) => m.status === 'pending').length;
  const pendingAdsCount = adRequests.filter((a) => a.status === 'pending_review').length;

  if (portal === 'marketplace') {
    return (
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 px-2 py-1.5 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-4 items-center gap-1">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span>City Street</span>
          </Link>

          <Link
            to="/explore"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/explore' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Kiosks</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold text-stone-500 hover:text-stone-900 relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5 text-amber-600" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] flex items-center justify-center px-0.5 text-[9px] font-bold text-stone-950 bg-amber-400 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>Basket</span>
          </button>

          <button
            onClick={onOpenPortalSwitcher}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold text-amber-800"
          >
            <Store className="w-5 h-5 mb-0.5 text-amber-600" />
            <span>Portals</span>
          </button>
        </div>
      </nav>
    );
  }

  if (portal === 'vendor') {
    return (
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 px-2 py-1.5 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-4 items-center gap-1">
          <Link
            to="/vendor"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/vendor' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span>Studio</span>
          </Link>

          <Link
            to="/vendor/customize"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/vendor/customize' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Palette className="w-5 h-5 mb-0.5" />
            <span>Custom</span>
          </Link>

          <Link
            to="/vendor/inventory"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/vendor/inventory' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span>Catalog</span>
          </Link>

          <Link
            to="/vendor/ads"
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              location.pathname === '/vendor/ads' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Megaphone className="w-5 h-5 mb-0.5" />
            <span>Ads</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Admin Portal
  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 px-2 py-1.5 safe-area-bottom shadow-lg">
      <div className="grid grid-cols-4 items-center gap-1">
        <Link
          to="/admin"
          className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
            location.pathname === '/admin' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Metrics</span>
        </Link>

        <Link
          to="/admin/rent"
          className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
            location.pathname === '/admin/rent' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span>Leases</span>
        </Link>

        <Link
          to="/admin/moderation"
          className={`relative flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
            location.pathname === '/admin/moderation' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span>KYC</span>
          {pendingModCount > 0 && (
            <span className="absolute top-0.5 right-4 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold bg-amber-500 text-stone-950 rounded-full">
              {pendingModCount}
            </span>
          )}
        </Link>

        <Link
          to="/admin/ad-queue"
          className={`relative flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
            location.pathname === '/admin/ad-queue' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Ad Queue</span>
          {pendingAdsCount > 0 && (
            <span className="absolute top-0.5 right-4 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold bg-amber-500 text-stone-950 rounded-full">
              {pendingAdsCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};
