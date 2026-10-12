import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, ShoppingBag, ShieldCheck, Check, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PortalRole } from '../../types';

interface PortalSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalSwitcherModal: React.FC<PortalSwitcherModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, setActiveRole } = useAppStore();

  if (!isOpen) return null;

  const currentPath = location.pathname;
  let detectedPortal: PortalRole = 'citizen';
  if (currentPath.startsWith('/admin')) {
    detectedPortal = 'admin';
  } else if (currentPath.startsWith('/vendor')) {
    detectedPortal = 'vendor';
  }

  const handleSelectPortal = (role: PortalRole, targetRoute: string) => {
    setActiveRole(role);
    navigate(targetRoute);
    onClose();
  };

  const portals = [
    {
      id: 'citizen' as PortalRole,
      title: 'Marketplace Interface',
      badge: 'Public Citizen View',
      route: '/',
      icon: ShoppingBag,
      accent: 'border-amber-500/80 bg-amber-500/10 text-amber-700',
      description: 'Explore East African virtual city avenues, browse craft kiosks, book eco-stays, and instant checkout with M-Pesa.',
      features: ['Virtual City Street Grid', 'Search & Category Filters', 'Mobile Money & Street Basket', 'Offline PWA Browsing'],
    },
    {
      id: 'vendor' as PortalRole,
      title: 'Vendor Portal',
      badge: 'Merchant Operations',
      route: '/vendor',
      icon: Store,
      accent: 'border-emerald-500/80 bg-emerald-500/10 text-emerald-700',
      description: 'Run your digital storefront, customize 3D kiosk stall themes, manage stock & reservations, and order in-city billboards.',
      features: ['Virtual Stall Customization', 'Inventory & Stays Catalog', 'Daily Footfall & KES Revenue', 'Ad Design & Billboard Orders'],
    },
    {
      id: 'admin' as PortalRole,
      title: 'SaaS Admin Panel',
      badge: 'Platform Authority',
      route: '/admin',
      icon: ShieldCheck,
      accent: 'border-indigo-500/80 bg-indigo-500/10 text-indigo-700',
      description: 'City governance & SaaS operations: collect digital land lease subscriptions, moderate merchants, and approve billboard ads.',
      features: ['ARR & Lease Subscription Billing', 'Merchant KYC & Stall Approvals', 'City Billboard Ad Queue', 'District Grid Configuration'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-stone-200/90 p-5 md:p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-heading">Switch Dala Portal Interface</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select one of the 3 role-based architectures under the single domain
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isCurrent = detectedPortal === portal.id;

            return (
              <div
                key={portal.id}
                onClick={() => handleSelectPortal(portal.id, portal.route)}
                className={`relative flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/30'
                    : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${portal.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 font-heading">{portal.title}</h3>
                  <span className="text-[10px] text-stone-400 block mb-2 font-mono">{portal.route}</span>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{portal.description}</p>
                </div>

                <div>
                  <ul className="text-[11px] text-stone-500 space-y-1 mb-4 pt-2 border-t border-stone-100">
                    {portal.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-stone-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPortal(portal.id, portal.route);
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 hover:bg-amber-600'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    <span>Launch {portal.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
