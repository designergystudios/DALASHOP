import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Palette, Package, Megaphone, ArrowUpRight, BarChart2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CurrencySwitcher } from '../common/CurrencySwitcher';
import { LowDataModeToggle } from '../common/LowDataModeToggle';

interface VendorHeaderProps {
  onOpenPortalSwitcher: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onOpenPortalSwitcher }) => {
  const location = useLocation();
  const { stalls, activeVendorStallId } = useAppStore();
  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];

  const navLinks = [
    { to: '/vendor', label: 'Studio Overview', icon: BarChart2, exact: true },
    { to: '/vendor/customize', label: 'Storefront Style', icon: Palette },
    { to: '/vendor/inventory', label: 'Catalog & Stays', icon: Package },
    { to: '/vendor/ads', label: 'Billboard Ads', icon: Megaphone },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/90 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Stall Brand / Vendor Info */}
        <div className="flex items-center gap-3">
          <Link to="/vendor" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-stone-900 tracking-tight">
                  {currentStall.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
                  {currentStall.plotNumber}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Vendor Studio · <span className="text-amber-800 font-bold">{currentStall.tier}</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Vendor Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-900 border border-amber-300/80 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Portals */}
        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <LowDataModeToggle compact />

          <Link
            to="/"
            title="Preview Public Stall on Marketplace"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition"
          >
            <span>Live Street Kiosk</span>
            <ArrowUpRight className="w-3 h-3 text-stone-400" />
          </Link>

          <button
            onClick={onOpenPortalSwitcher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition"
          >
            <span>Switch Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
