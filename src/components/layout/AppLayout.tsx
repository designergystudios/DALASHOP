import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MarketplaceHeader } from './MarketplaceHeader';
import { VendorHeader } from './VendorHeader';
import { AdminHeader } from './AdminHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { PortalSwitcherModal } from '../common/PortalSwitcherModal';
import { CartDrawer } from '../../features/marketplace/CartDrawer';
import { OfflineIndicator } from '../common/OfflineIndicator';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // Compute active portal from URL pathname
  let currentPortal: 'marketplace' | 'vendor' | 'admin' = 'marketplace';
  if (location.pathname.startsWith('/admin')) {
    currentPortal = 'admin';
  } else if (location.pathname.startsWith('/vendor')) {
    currentPortal = 'vendor';
  }

  // Theme styling configuration per portal in clean, vibrant Light Mode
  const portalThemeClasses = {
    marketplace: 'bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-stone-950',
    vendor: 'bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-stone-950',
    admin: 'bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-stone-950',
  }[currentPortal];

  // Subtle warm sunrise ambient background gradient
  const ambientGlowClasses = {
    marketplace:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-stone-50 to-stone-50',
    vendor:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/25 via-stone-50 to-stone-50',
    admin:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/15 via-stone-50 to-stone-50',
  }[currentPortal];

  return (
    <div className={`min-h-screen flex flex-col font-sans ${portalThemeClasses} ${ambientGlowClasses}`}>
      {/* Dynamic Portal Header */}
      {currentPortal === 'marketplace' && (
        <MarketplaceHeader onOpenPortalSwitcher={() => setIsPortalModalOpen(true)} />
      )}
      {currentPortal === 'vendor' && (
        <VendorHeader onOpenPortalSwitcher={() => setIsPortalModalOpen(true)} />
      )}
      {currentPortal === 'admin' && (
        <AdminHeader onOpenPortalSwitcher={() => setIsPortalModalOpen(true)} />
      )}

      {/* Main Content View with mobile bottom nav clearance */}
      <main className="flex-1 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        portal={currentPortal}
        onOpenPortalSwitcher={() => setIsPortalModalOpen(true)}
      />

      {/* Global Utilities & Modals */}
      <PortalSwitcherModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
      />
      <CartDrawer />
      <OfflineIndicator />
    </div>
  );
};
