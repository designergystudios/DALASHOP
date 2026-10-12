import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MapPin, Grid, Compass, Store, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { LowDataModeToggle } from '../common/LowDataModeToggle';
import { CurrencySwitcher } from '../common/CurrencySwitcher';

interface MarketplaceHeaderProps {
  onOpenPortalSwitcher: () => void;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ onOpenPortalSwitcher }) => {
  const location = useLocation();
  const { cart, setIsCartOpen, selectedDistrictId, districts, platformLogoUrl } = useAppStore();

  const currentDistrict = districts.find((d) => d.id === selectedDistrictId);
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/90 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & City Tag */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            {platformLogoUrl ? (
              <img
                src={platformLogoUrl}
                alt="Dala Platform Logo"
                className="w-9 h-9 rounded-xl object-cover border border-amber-300 shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-md shadow-amber-900/10">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center font-heading font-extrabold text-amber-400 text-lg group-hover:scale-105 transition-transform">
                  D
                </div>
              </div>
            )}
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-stone-900 flex items-center gap-1.5">
                DALA <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">VIRTUAL CITY</span>
              </span>
              <p className="text-[10px] text-stone-500 hidden sm:block -mt-1 font-medium">
                East Africa Street Marketplace
              </p>
            </div>
          </Link>

          {/* Active District Pill */}
          {currentDistrict && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold">{currentDistrict.name}</span>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              location.pathname === '/'
                ? 'bg-amber-500/15 text-amber-900 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              <span>City Map & Street</span>
            </span>
          </Link>
          <Link
            to="/explore"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              location.pathname === '/explore'
                ? 'bg-amber-500/15 text-amber-900 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>All Kiosks</span>
            </span>
          </Link>
        </nav>

        {/* Right Tools: Currency, Low-Data, PWA, Cart, Role Switcher */}
        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <LowDataModeToggle compact />
          <PWAInstallButton variant="compact" />

          {/* Quick Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Cart"
            className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-stone-950 bg-amber-400 rounded-full border-2 border-white shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Portal Switcher Trigger */}
          <button
            onClick={onOpenPortalSwitcher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition active:scale-95"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portals</span>
          </button>
        </div>
      </div>
    </header>
  );
};
