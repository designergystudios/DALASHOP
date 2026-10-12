import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { NotFound } from './components/common/NotFound';

// Lazy loading role-based portal subtrees for optimal mobile performance and data-savings
const MarketplaceHome = lazy(() =>
  import('./features/marketplace/MarketplaceHome').then((m) => ({ default: m.MarketplaceHome }))
);
const ExploreStalls = lazy(() =>
  import('./features/marketplace/ExploreStalls').then((m) => ({ default: m.ExploreStalls }))
);

// Vendor Portal Subroutes
const VendorDashboard = lazy(() =>
  import('./features/vendor/VendorDashboard').then((m) => ({ default: m.VendorDashboard }))
);
const ShopCustomization = lazy(() =>
  import('./features/vendor/ShopCustomization').then((m) => ({ default: m.ShopCustomization }))
);
const InventoryManager = lazy(() =>
  import('./features/vendor/InventoryManager').then((m) => ({ default: m.InventoryManager }))
);
const AdServiceRequests = lazy(() =>
  import('./features/vendor/AdServiceRequests').then((m) => ({ default: m.AdServiceRequests }))
);

// SaaS Admin Panel Subroutes
const AdminDashboard = lazy(() =>
  import('./features/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const RentSubscriptionManager = lazy(() =>
  import('./features/admin/RentSubscriptionManager').then((m) => ({ default: m.RentSubscriptionManager }))
);
const UserModeration = lazy(() =>
  import('./features/admin/UserModeration').then((m) => ({ default: m.UserModeration }))
);
const AdQueueManager = lazy(() =>
  import('./features/admin/AdQueueManager').then((m) => ({ default: m.AdQueueManager }))
);
const AdminMarketingManager = lazy(() =>
  import('./features/admin/AdminMarketingManager').then((m) => ({ default: m.AdminMarketingManager }))
);

// Mobile-optimized loading skeleton with zero layout shift
const PageLoadingFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-3">
    <div className="relative flex h-8 w-8">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-500"></span>
    </div>
    <p className="text-xs font-mono text-slate-400">Loading Dala Portal Subsystem...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Reusable Portal Layout Wrapper */}
        <Route element={<AppLayout />}>
          {/* 1. Marketplace Interface (Default Public Citizen View) */}
          <Route
            index
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <MarketplaceHome />
              </Suspense>
            }
          />
          <Route
            path="explore"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ExploreStalls />
              </Suspense>
            }
          />

          {/* 2. Vendor Portal (/vendor/*) */}
          <Route path="vendor">
            <Route
              index
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorDashboard />
                </Suspense>
              }
            />
            <Route
              path="customize"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <ShopCustomization />
                </Suspense>
              }
            />
            <Route
              path="inventory"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <InventoryManager />
                </Suspense>
              }
            />
            <Route
              path="ads"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdServiceRequests />
                </Suspense>
              }
            />
          </Route>

          {/* 3. SaaS Admin Panel (/admin/*) */}
          <Route path="admin">
            <Route
              index
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="rent"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <RentSubscriptionManager />
                </Suspense>
              }
            />
            <Route
              path="moderation"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <UserModeration />
                </Suspense>
              }
            />
            <Route
              path="ad-queue"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdQueueManager />
                </Suspense>
              }
            />
            <Route
              path="marketing"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
                    <AdminMarketingManager />
                  </div>
                </Suspense>
              }
            />
          </Route>

          {/* Catch-all 404 handler */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
