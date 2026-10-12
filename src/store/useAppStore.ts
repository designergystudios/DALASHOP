import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PortalRole,
  Currency,
  CityDistrict,
  Stall,
  ListingItem,
  CartItem,
  AdRequest,
  LeaseSubscription,
  ModerationItem,
  ListingCategory,
  HeroSlide,
  ShowcaseAdvert,
  WeeklyOffer,
} from '../types';
import {
  INITIAL_DISTRICTS,
  INITIAL_STALLS,
  INITIAL_LISTINGS,
  INITIAL_LEASES,
  INITIAL_ADS,
  INITIAL_MODERATION,
  HERO_SLIDES,
  SHOWCASE_ADVERTS,
  WEEKLY_OFFERS,
} from './mockData';

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; decimals: number }> = {
  KES: { rate: 1, symbol: 'KSh', decimals: 0 },
  USD: { rate: 0.0077, symbol: '$', decimals: 2 },
  TZS: { rate: 20.2, symbol: 'TSh', decimals: 0 },
  UGX: { rate: 28.5, symbol: 'USh', decimals: 0 },
  RWF: { rate: 10.4, symbol: 'FRw', decimals: 0 },
};

interface AppState {
  // Navigation & Role Context
  activeRole: PortalRole;
  setActiveRole: (role: PortalRole) => void;

  // Performance & East Africa Mobile Flags
  isLowDataMode: boolean;
  setLowDataMode: (enabled: boolean) => void;
  toggleLowDataMode: () => void;

  // Currency & Localisation
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountKes: number) => string;

  // Marketplace Exploration
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
  selectedCategory: ListingCategory;
  setSelectedCategory: (cat: ListingCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  districts: CityDistrict[];
  stalls: Stall[];
  listings: ListingItem[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Cart Operations
  addToCart: (item: ListingItem, bookingDate?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotalKes: () => number;

  // Vendor Portal State & Actions
  activeVendorStallId: string;
  setActiveVendorStallId: (stallId: string) => void;
  updateStallCustomization: (stallId: string, updates: Partial<Stall>) => void;
  addVendorStall: (stall: {
    name: string;
    ownerName: string;
    districtId: string;
    category: string;
    tier: 'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion';
    plotNumber: string;
    bannerUrl: string;
    avatarUrl: string;
    bio: string;
    contactMpesa: string;
    monthlyRentKes: number;
  }) => void;
  addListing: (
    listing: Omit<ListingItem, 'id' | 'stallId' | 'stallName' | 'rating' | 'reviewCount'>
  ) => void;
  deleteListing: (listingId: string) => void;
  toggleListingAvailability: (listingId: string) => void;
  adRequests: AdRequest[];
  submitAdRequest: (ad: Omit<AdRequest, 'id' | 'status' | 'submittedAt'>) => void;

  // Admin SaaS State & Actions
  leases: LeaseSubscription[];
  updateLeaseStatus: (stallId: string, status: LeaseSubscription['status']) => void;
  moderationQueue: ModerationItem[];
  processModeration: (id: string, status: 'approved' | 'rejected') => void;
  processAdApproval: (id: string, status: 'approved' | 'rejected') => void;

  // Platform Branding & Hero Sections (SaaS Admin Editable)
  platformLogoUrl: string | null;
  setPlatformLogoUrl: (url: string | null) => void;
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;

  // Showcases & Weekly Offers (SaaS Admin & Marketplace)
  showcaseAdverts: ShowcaseAdvert[];
  addShowcaseAdvert: (ad: Omit<ShowcaseAdvert, 'id'>) => void;
  updateShowcaseAdvert: (id: string, updates: Partial<ShowcaseAdvert>) => void;
  deleteShowcaseAdvert: (id: string) => void;
  toggleStallShowcase: (stallId: string) => void;

  weeklyOffers: WeeklyOffer[];
  addWeeklyOffer: (offer: Omit<WeeklyOffer, 'id'>) => void;
  updateWeeklyOffer: (id: string, updates: Partial<WeeklyOffer>) => void;
  deleteWeeklyOffer: (id: string) => void;
  toggleListingOfferOfTheWeek: (listingId: string) => void;

  // Offline Sync Queue
  offlineQueuedOrders: Array<{ id: string; timestamp: string; items: CartItem[]; totalKes: number }>;
  queueOfflineOrder: (items: CartItem[], totalKes: number) => void;
  clearOfflineQueue: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeRole: 'citizen',
      setActiveRole: (role) => set({ activeRole: role }),

      isLowDataMode: false,
      setLowDataMode: (enabled) => set({ isLowDataMode: enabled }),
      toggleLowDataMode: () => set((state) => ({ isLowDataMode: !state.isLowDataMode })),

      currency: 'KES',
      setCurrency: (currency) => set({ currency }),
      formatPrice: (amountKes: number) => {
        const { currency } = get();
        const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.KES;
        const converted = amountKes * conf.rate;
        return `${conf.symbol} ${converted.toLocaleString(undefined, {
          minimumFractionDigits: conf.decimals,
          maximumFractionDigits: conf.decimals,
        })}`;
      },

      selectedDistrictId: 'all',
      setSelectedDistrictId: (id) => set({ selectedDistrictId: id }),
      selectedCategory: 'all',
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      districts: INITIAL_DISTRICTS,
      stalls: INITIAL_STALLS,
      listings: INITIAL_LISTINGS,
      cart: [],
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (item, bookingDate) => {
        set((state) => {
          const existing = state.cart.find((c) => c.item.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
              ),
              isCartOpen: true,
            };
          }
          return {
            cart: [...state.cart, { item, quantity: 1, bookingDate }],
            isCartOpen: true,
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((c) => c.item.id !== itemId),
        }));
      },

      updateCartQuantity: (itemId, delta) => {
        set((state) => ({
          cart: state.cart
            .map((c) => {
              if (c.item.id === itemId) {
                const nextQty = c.quantity + delta;
                return nextQty > 0 ? { ...c, quantity: nextQty } : null;
              }
              return c;
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotalKes: () => {
        return get().cart.reduce((sum, item) => sum + item.item.priceKes * item.quantity, 0);
      },

      activeVendorStallId: 'stall-1',
      setActiveVendorStallId: (stallId) => set({ activeVendorStallId: stallId }),

      updateStallCustomization: (stallId, updates) => {
        set((state) => ({
          stalls: state.stalls.map((s) => (s.id === stallId ? { ...s, ...updates } : s)),
        }));
      },

      addVendorStall: (stallData) => {
        const stallId = `stall-${Date.now()}`;
        const newStall: Stall = {
          id: stallId,
          ...stallData,
          status: 'active',
          rating: 5.0,
          footfallToday: Math.floor(Math.random() * 200) + 50,
          salesMonthKes: stallData.monthlyRentKes * 4,
          verified: true,
          themeColor: '#ea580c',
        };
        const newLease: LeaseSubscription = {
          stallId,
          stallName: stallData.name,
          ownerName: stallData.ownerName,
          tier: stallData.tier,
          monthlyRentKes: stallData.monthlyRentKes,
          nextBillingDate: 'In 30 days',
          paymentMethod: 'M-Pesa Auto-Stk',
          status: 'paid',
        };
        set((state) => ({
          stalls: [newStall, ...state.stalls],
          leases: [newLease, ...state.leases],
          activeVendorStallId: stallId,
        }));
      },

      addListing: (newListingData) => {
        const { activeVendorStallId, stalls, weeklyOffers } = get();
        const stall = stalls.find((s) => s.id === activeVendorStallId);
        const newListing: ListingItem = {
          ...newListingData,
          id: `list-${Date.now()}`,
          stallId: activeVendorStallId,
          stallName: stall ? stall.name : 'Vendor Stall',
          rating: 5.0,
          reviewCount: 1,
        };

        if (newListingData.isOfferOfTheWeek) {
          const orig = newListingData.originalPriceKes || Math.round(newListingData.priceKes * 1.25);
          const discountPct = newListingData.discountPercent || Math.round(((orig - newListingData.priceKes) / orig) * 100);
          const newWeeklyOffer: WeeklyOffer = {
            id: `deal-${Date.now()}`,
            listingId: newListing.id,
            stallId: newListing.stallId,
            stallName: newListing.stallName,
            title: newListing.title,
            originalPriceKes: orig,
            salePriceKes: newListing.priceKes,
            discountPercent: discountPct,
            thumbnail: newListing.thumbnail,
            category: newListing.category.toUpperCase(),
            districtName: stall?.plotNumber || newListing.location,
            endsInHours: 48,
            claimedCount: 0,
            totalAvailable: 25,
            badge: newListing.badge || 'New Special Offer',
          };
          set((state) => ({
            listings: [newListing, ...state.listings],
            weeklyOffers: [newWeeklyOffer, ...state.weeklyOffers],
          }));
        } else {
          set((state) => ({
            listings: [newListing, ...state.listings],
          }));
        }
      },

      deleteListing: (listingId) => {
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== listingId),
        }));
      },

      toggleListingAvailability: (listingId) => {
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === listingId ? { ...l, isAvailable: !l.isAvailable } : l
          ),
        }));
      },

      adRequests: INITIAL_ADS,

      submitAdRequest: (adData) => {
        const newAd: AdRequest = {
          ...adData,
          id: `ad-${Date.now()}`,
          status: 'pending_review',
          submittedAt: 'Just now',
        };
        set((state) => ({
          adRequests: [newAd, ...state.adRequests],
        }));
      },

      leases: INITIAL_LEASES,

      updateLeaseStatus: (stallId, status) => {
        set((state) => ({
          leases: state.leases.map((l) => (l.stallId === stallId ? { ...l, status } : l)),
        }));
      },

      moderationQueue: INITIAL_MODERATION,

      processModeration: (id, status) => {
        set((state) => ({
          moderationQueue: state.moderationQueue.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        }));
      },

      processAdApproval: (id, status) => {
        set((state) => ({
          adRequests: state.adRequests.map((a) => (a.id === id ? { ...a, status } : a)),
        }));
      },

      // Platform Branding & Hero Carousel
      platformLogoUrl: null,
      setPlatformLogoUrl: (url) => set({ platformLogoUrl: url }),

      heroSlides: HERO_SLIDES,
      addHeroSlide: (slideData) => {
        const newSlide: HeroSlide = {
          ...slideData,
          id: `slide-${Date.now()}`,
        };
        set((state) => ({
          heroSlides: [newSlide, ...state.heroSlides],
        }));
      },
      updateHeroSlide: (id, updates) => {
        set((state) => ({
          heroSlides: state.heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },
      deleteHeroSlide: (id) => {
        set((state) => ({
          heroSlides: state.heroSlides.filter((s) => s.id !== id),
        }));
      },

      // Showcases & Weekly Offers
      showcaseAdverts: SHOWCASE_ADVERTS,
      addShowcaseAdvert: (adData) => {
        const newAd: ShowcaseAdvert = {
          ...adData,
          id: `ad-showcase-${Date.now()}`,
        };
        set((state) => ({
          showcaseAdverts: [newAd, ...state.showcaseAdverts],
        }));
      },
      updateShowcaseAdvert: (id, updates) => {
        set((state) => ({
          showcaseAdverts: state.showcaseAdverts.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad)),
        }));
      },
      deleteShowcaseAdvert: (id) => {
        set((state) => ({
          showcaseAdverts: state.showcaseAdverts.filter((ad) => ad.id !== id),
        }));
      },
      toggleStallShowcase: (stallId) => {
        const { showcaseAdverts, stalls } = get();
        const existing = showcaseAdverts.find((ad) => ad.stallId === stallId);
        if (existing) {
          // Remove from showcase
          set({
            showcaseAdverts: showcaseAdverts.filter((ad) => ad.stallId !== stallId),
          });
        } else {
          // Promote stall to showcase billboard
          const stall = stalls.find((s) => s.id === stallId);
          if (!stall) return;
          const newShowcase: ShowcaseAdvert = {
            id: `ad-showcase-${Date.now()}`,
            stallId: stall.id,
            stallName: stall.name,
            campaignTitle: `${stall.name} Featured Billboard`,
            tagline: stall.bio,
            image: stall.bannerUrl,
            districtId: stall.districtId,
            districtName: stall.plotNumber || 'City Square',
            badge: 'Admin Promoted Showcase',
            ctaText: 'Explore Merchant',
            accentColor: stall.themeColor || '#ea580c',
            rating: stall.rating || 5.0,
            discountOffer: 'Featured Merchant Spotlight',
          };
          set({
            showcaseAdverts: [newShowcase, ...showcaseAdverts],
          });
        }
      },

      weeklyOffers: WEEKLY_OFFERS,
      addWeeklyOffer: (offerData) => {
        const newOffer: WeeklyOffer = {
          ...offerData,
          id: `deal-${Date.now()}`,
        };
        set((state) => ({
          weeklyOffers: [newOffer, ...state.weeklyOffers],
        }));
      },
      updateWeeklyOffer: (id, updates) => {
        set((state) => ({
          weeklyOffers: state.weeklyOffers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
      },
      deleteWeeklyOffer: (id) => {
        set((state) => ({
          weeklyOffers: state.weeklyOffers.filter((o) => o.id !== id),
        }));
      },
      toggleListingOfferOfTheWeek: (listingId) => {
        const { listings, weeklyOffers, stalls } = get();
        const listing = listings.find((l) => l.id === listingId);
        if (!listing) return;

        const isCurrentlyOffer = Boolean(listing.isOfferOfTheWeek);
        const updatedListings = listings.map((l) =>
          l.id === listingId ? { ...l, isOfferOfTheWeek: !isCurrentlyOffer } : l
        );

        if (isCurrentlyOffer) {
          // Remove from weeklyOffers
          set({
            listings: updatedListings,
            weeklyOffers: weeklyOffers.filter((o) => o.listingId !== listingId),
          });
        } else {
          // Add to weekly offers
          const matchedStall = stalls.find((s) => s.id === listing.stallId);
          const orig = listing.originalPriceKes || Math.round(listing.priceKes * 1.25);
          const discountPct = listing.discountPercent || Math.round(((orig - listing.priceKes) / orig) * 100);

          const newWeeklyOffer: WeeklyOffer = {
            id: `deal-${Date.now()}`,
            listingId: listing.id,
            stallId: listing.stallId,
            stallName: listing.stallName,
            title: listing.title,
            originalPriceKes: orig,
            salePriceKes: listing.priceKes,
            discountPercent: discountPct,
            thumbnail: listing.thumbnail,
            category: listing.category.toUpperCase(),
            districtName: matchedStall ? matchedStall.plotNumber : listing.location,
            endsInHours: 48,
            claimedCount: 5,
            totalAvailable: 20,
            badge: 'Admin Highlight Offer',
          };

          set({
            listings: updatedListings,
            weeklyOffers: [newWeeklyOffer, ...weeklyOffers],
          });
        }
      },

      offlineQueuedOrders: [],

      queueOfflineOrder: (items, totalKes) => {
        const record = {
          id: `OFFLINE-ORD-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          items,
          totalKes,
        };
        set((state) => ({
          offlineQueuedOrders: [...state.offlineQueuedOrders, record],
          cart: [],
        }));
      },

      clearOfflineQueue: () => set({ offlineQueuedOrders: [] }),
    }),
    {
      name: 'dala-virtual-city-store-v1',
      partialize: (state) => ({
        activeRole: state.activeRole,
        isLowDataMode: state.isLowDataMode,
        currency: state.currency,
        cart: state.cart,
        stalls: state.stalls,
        listings: state.listings,
        adRequests: state.adRequests,
        leases: state.leases,
        moderationQueue: state.moderationQueue,
        platformLogoUrl: state.platformLogoUrl,
        heroSlides: state.heroSlides,
        showcaseAdverts: state.showcaseAdverts,
        weeklyOffers: state.weeklyOffers,
        offlineQueuedOrders: state.offlineQueuedOrders,
      }),
    }
  )
);
