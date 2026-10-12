export type PortalRole = 'citizen' | 'vendor' | 'admin';

export type Currency = 'KES' | 'USD' | 'TZS' | 'UGX' | 'RWF';

export interface CityDistrict {
  id: string;
  name: string;
  tagline: string;
  country: string;
  accentColor: string;
  iconName: string;
  totalStalls: number;
  activeCitizens: number;
  description: string;
  coordinates: { x: number; y: number };
}

export type ListingCategory =
  | 'all'
  | 'crafts'
  | 'fashion'
  | 'stays'
  | 'events'
  | 'tech'
  | 'food'
  | 'wellness';

export interface ListingItem {
  id: string;
  stallId: string;
  stallName: string;
  title: string;
  category: Exclude<ListingCategory, 'all'>;
  priceKes: number;
  originalPriceKes?: number;
  rating: number;
  reviewCount: number;
  location: string;
  districtId: string;
  thumbnail: string;
  description: string;
  badge?: string;
  isAvailable: boolean;
  type: 'product' | 'stay' | 'event' | 'service';
  dates?: string; // For events or stays
  duration?: string;
  discountPercent?: number;
  isOfferOfTheWeek?: boolean;
}

export interface Stall {
  id: string;
  name: string;
  ownerName: string;
  districtId: string;
  category: string;
  bannerUrl: string;
  avatarUrl: string;
  tier: 'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion';
  status: 'active' | 'pending_review' | 'lease_due';
  rating: number;
  footfallToday: number;
  salesMonthKes: number;
  verified: boolean;
  plotNumber: string;
  themeColor: string;
  bio: string;
  contactMpesa: string;
  featuredTag?: string;
}

export interface CartItem {
  item: ListingItem;
  quantity: number;
  bookingDate?: string;
}

export interface AdRequest {
  id: string;
  vendorId: string;
  stallName: string;
  campaignTitle: string;
  placement:
    | 'City Square Billboard'
    | 'District Spotlight'
    | 'Category Sponsor'
    | 'Featured Showcase Billboard'
    | 'Offer of the Week Feature';
  durationDays: number;
  budgetKes: number;
  status: 'pending_review' | 'approved' | 'active' | 'rejected';
  submittedAt: string;
  creativeNotes: string;
}

export interface LeaseSubscription {
  stallId: string;
  stallName: string;
  ownerName: string;
  tier: 'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion';
  monthlyRentKes: number;
  nextBillingDate: string;
  paymentMethod: 'M-Pesa Auto-Stk' | 'Airtel Money' | 'Card / Bank';
  status: 'paid' | 'grace_period' | 'overdue';
}

export interface ModerationItem {
  id: string;
  targetType: 'vendor_application' | 'listing_report' | 'kyc_verification';
  targetTitle: string;
  applicant: string;
  district: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlightKicker: string;
  backgroundImage: string;
  districtId: string;
  districtName: string;
  ctaText: string;
  badge: string;
  accentColor: string;
}

export interface ShowcaseAdvert {
  id: string;
  stallId: string;
  stallName: string;
  campaignTitle: string;
  tagline: string;
  image: string;
  districtId: string;
  districtName: string;
  badge: string; // e.g. "Flagship Billboard", "Trending Merchant", "Sponsored Spotlight"
  ctaText: string;
  accentColor: string;
  rating: number;
  discountOffer?: string;
}

export interface WeeklyOffer {
  id: string;
  listingId: string;
  stallId: string;
  stallName: string;
  title: string;
  originalPriceKes: number;
  salePriceKes: number;
  discountPercent: number;
  thumbnail: string;
  category: string;
  districtName: string;
  endsInHours: number;
  claimedCount: number;
  totalAvailable: number;
  badge: string;
}
