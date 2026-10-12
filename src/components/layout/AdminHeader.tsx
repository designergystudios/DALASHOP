import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, CreditCard, UserCheck, Layers, Megaphone } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CurrencySwitcher } from '../common/CurrencySwitcher';
import { DatabaseStatusBadge } from '../../features/admin/DatabaseStatusBadge';
import { DatabaseRealtimeConsole } from '../../features/admin/DatabaseRealtimeConsole';

interface AdminHeaderProps {
  onOpenPortalSwitcher: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenPortalSwitcher }) => {
  const location = useLocation();
  const { moderationQueue, adRequests, platformLogoUrl } = useAppStore();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const pendingModCount = moderationQueue.filter((m) => m.status === 'pending').length;
  const pendingAdsCount = adRequests.filter((a) => a.status === 'pending_review').length;

  const adminLinks = [
    { to: '/admin', label: 'Command Center', icon: LayoutDashboard, exact: true },
    { to: '/admin/marketing', label: 'Hero, Ads & Offers', icon: Megaphone },
    { to: '/admin/rent', label: 'Stall Leases & Rent', icon: CreditCard },
    { to: '/admin/moderation', label: 'Merchant KYC', icon: UserCheck, badge: pendingModCount },
    { to: '/admin/ad-queue', label: 'Ad Service Queue', icon: Layers, badge: pendingAdsCount },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-stone-200/90 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* SaaS City Admin Brand */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5">
              {platformLogoUrl ? (
                <img
                  src={platformLogoUrl}
                  alt="Dala Platform Logo"
                  className="w-9 h-9 rounded-xl object-cover border border-amber-300 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-stone-900 tracking-tight">
                    Dala City Governance
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-stone-100 text-stone-800 font-bold border border-stone-200">
                    PLATFORM ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  SaaS Infrastructure & East Africa Regional Ops
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Admin Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-900 border border-amber-300/80 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-amber-500 text-stone-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools: Database Status Badge + Currency Switcher + Portal Switcher */}
          <div className="flex items-center gap-2">
            {/* Live Database Connection Indicator */}
            <DatabaseStatusBadge onOpenConsole={() => setIsConsoleOpen(true)} />

            <CurrencySwitcher />

            <button
              onClick={onOpenPortalSwitcher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition"
            >
              <span>Switch Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Database Inspector Modal Drawer */}
      {isConsoleOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="max-w-5xl w-full">
            <DatabaseRealtimeConsole isModal={true} onClose={() => setIsConsoleOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
