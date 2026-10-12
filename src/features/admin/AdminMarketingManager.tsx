import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Flame,
  Megaphone,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Tag,
  Store,
  DollarSign,
  Clock,
  Eye,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StorageMediaUploader } from '../../components/common/StorageMediaUploader';
import { HeroSlide, ShowcaseAdvert, WeeklyOffer, ListingItem } from '../../types';
import { databaseService } from '../../services/supabaseClient';

export const AdminMarketingManager: React.FC = () => {
  const {
    platformLogoUrl,
    setPlatformLogoUrl,
    heroSlides,
    addHeroSlide,
    deleteHeroSlide,
    showcaseAdverts,
    addShowcaseAdvert,
    deleteShowcaseAdvert,
    toggleStallShowcase,
    weeklyOffers,
    deleteWeeklyOffer,
    toggleListingOfferOfTheWeek,
    stalls,
    listings,
    formatPrice,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'logo' | 'hero' | 'showcase' | 'offers'>('hero');
  const [notification, setNotification] = useState<string | null>(null);

  // New Hero Slide Modal/Form State
  const [isAddingHeroSlide, setIsAddingHeroSlide] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideKicker, setNewSlideKicker] = useState('Featured District');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideDistrictId, setNewSlideDistrictId] = useState('retail-avenue');
  const [newSlideBadge, setNewSlideBadge] = useState('★ City Spotlight');
  const [newSlideCtaText, setNewSlideCtaText] = useState('Explore District');
  const [newSlideAccentColor, setNewSlideAccentColor] = useState('#ea580c');

  // Search & Filter for Stalls & Listings
  const [stallSearch, setStallSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle || !newSlideImage) {
      triggerToast('Please provide both a slide headline and a background image URL.');
      return;
    }

    const matchedDistrict = stalls.find((s) => s.districtId === newSlideDistrictId)?.districtId || 'Retail Avenue';
    const districtName =
      newSlideDistrictId === 'retail-avenue'
        ? 'Retail Avenue'
        : newSlideDistrictId === 'hospitality-hills'
        ? 'Hospitality Hills'
        : newSlideDistrictId === 'entertainment-square'
        ? 'Entertainment Square'
        : newSlideDistrictId === 'freelancer-hub'
        ? 'Freelancer Hub'
        : 'Wellness Ward';

    addHeroSlide({
      title: newSlideTitle,
      subtitle: newSlideSubtitle || 'Direct merchant access with instant M-Pesa checkouts.',
      highlightKicker: newSlideKicker,
      backgroundImage: newSlideImage,
      districtId: newSlideDistrictId,
      districtName,
      badge: newSlideBadge,
      ctaText: newSlideCtaText,
      accentColor: newSlideAccentColor,
    });

    // Record in database simulation
    databaseService.broadcastDatabaseEvent({
      id: `evt-hero-${Date.now()}`,
      table: 'media_metadata',
      eventType: 'INSERT',
      timestamp: new Date().toLocaleTimeString(),
      recordSummary: `Hero carousel slide added: "${newSlideTitle}"`,
      latencyMs: 14,
      payload: {
        title: newSlideTitle,
        section_type: 'hero',
        image_url: newSlideImage,
      },
    });

    triggerToast('Hero carousel slide published to marketplace live!');
    setIsAddingHeroSlide(false);
    setNewSlideTitle('');
    setNewSlideSubtitle('');
    setNewSlideImage('');
  };

  const filteredStalls = stalls.filter((s) =>
    s.name.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.plotNumber.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.ownerName.toLowerCase().includes(stallSearch.toLowerCase())
  );

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.stallName.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(listingSearch.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-300">
              <Megaphone className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
              City Marketing & Visual Asset CMS
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 font-heading mt-1">
            Media Assets, Billboard Showcases & Special Offers
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload custom hero slides, brand logos, promote stalls to billboard showcases, and mark catalog items as Offers of the Week.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'hero'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Hero Carousel ({heroSlides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'logo'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Brand Logo</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'showcase'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-sky-600" />
            <span>Showcases ({showcaseAdverts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'offers'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Special Offers ({weeklyOffers.length})</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: HERO SECTION IMAGES & CAROUSEL BUILDER */}
      {/* ======================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>Active Hero Section Carousel Slides</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                  Live on Marketplace
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Every slide cycles every 6 seconds on the citizen homepage with cross-fade background transitions and CTA triggers.
              </p>
            </div>
            <button
              onClick={() => setIsAddingHeroSlide(!isAddingHeroSlide)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingHeroSlide ? 'Cancel Slide Form' : 'Upload & Add New Hero Slide'}</span>
            </button>
          </div>

          {/* Add Slide Drawer / Card */}
          {isAddingHeroSlide && (
            <form onSubmit={handleSaveHeroSlide} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Configure New Hero Background Slide</span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Upload to dala-media or enter URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Upload Slide Image (5MB Limit · Saved to dala-media bucket)
                  </label>
                  <StorageMediaUploader
                    sectionType="hero"
                    vendorId="admin-dala-ops"
                    vendorName="Dala City Admin"
                    onUploadSuccess={(url) => {
                      setNewSlideImage(url);
                      triggerToast('Image uploaded to dala-media bucket successfully!');
                    }}
                  />
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Or paste an Image URL manually:
                    </label>
                    <input
                      type="url"
                      value={newSlideImage}
                      onChange={(e) => setNewSlideImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Metadata & Copy */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Slide Title / Headline</label>
                    <input
                      type="text"
                      required
                      value={newSlideTitle}
                      onChange={(e) => setNewSlideTitle(e.target.value)}
                      placeholder="e.g. Discover Kisumu's Floating Eco-Villas on Lake Victoria"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Subtitle / Descriptive Tagline</label>
                    <textarea
                      rows={2}
                      value={newSlideSubtitle}
                      onChange={(e) => setNewSlideSubtitle(e.target.value)}
                      placeholder="e.g. Browse verified lakeside suites with instant M-Pesa checkouts."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Highlight Kicker</label>
                      <input
                        type="text"
                        value={newSlideKicker}
                        onChange={(e) => setNewSlideKicker(e.target.value)}
                        placeholder="Sunrise in Dala"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newSlideBadge}
                        onChange={(e) => setNewSlideBadge(e.target.value)}
                        placeholder="★ Verified Flagship"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Target District</label>
                      <select
                        value={newSlideDistrictId}
                        onChange={(e) => setNewSlideDistrictId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white"
                      >
                        <option value="retail-avenue">Retail Avenue</option>
                        <option value="hospitality-hills">Hospitality Hills</option>
                        <option value="entertainment-square">Entertainment Square</option>
                        <option value="freelancer-hub">Freelancer Hub</option>
                        <option value="wellness-ward">Wellness Ward</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={newSlideCtaText}
                        onChange={(e) => setNewSlideCtaText(e.target.value)}
                        placeholder="Explore District"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHeroSlide(false)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newSlideImage || !newSlideTitle}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition disabled:opacity-50"
                    >
                      Publish Hero Slide
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* List of Existing Hero Slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={slide.backgroundImage}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                        Slide #{idx + 1}
                      </span>
                      <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-medium">
                        {slide.badge}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {slide.highlightKicker}
                      </span>
                      <h4 className="text-sm font-extrabold line-clamp-1">{slide.title}</h4>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-stone-600 line-clamp-2">{slide.subtitle}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-stone-800">{slide.districtName}</span>
                    </div>

                    <button
                      onClick={() => {
                        deleteHeroSlide(slide.id);
                        triggerToast(`Deleted slide #${idx + 1}`);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BRAND LOGO UPLOADER */}
      {/* ======================================================== */}
      {activeTab === 'logo' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-200">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Platform Brand Logo Customization</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Upload an official logo icon or badge for Dala Virtual City. This icon appears across the marketplace navigation bar, vendor studios, and SaaS admin portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
            {/* Current Preview */}
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-amber-300 bg-white p-2 shadow-xs flex items-center justify-center overflow-hidden">
                {platformLogoUrl ? (
                  <img
                    src={platformLogoUrl}
                    alt="Current Platform Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-stone-950 flex items-center justify-center font-heading font-black text-amber-400 text-3xl">
                    D
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {platformLogoUrl ? 'Custom Logo' : 'Default "D" Crest'}
              </span>
            </div>

            {/* Upload form */}
            <div className="flex-1 space-y-3 w-full">
              <StorageMediaUploader
                sectionType="hero"
                vendorId="admin-dala-branding"
                vendorName="Dala Authority"
                onUploadSuccess={(url) => {
                  setPlatformLogoUrl(url);
                  triggerToast('Platform brand logo updated across all navigation headers!');
                }}
              />

              {platformLogoUrl && (
                <button
                  onClick={() => {
                    setPlatformLogoUrl(null);
                    triggerToast('Reset to default Dala crest logo.');
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 pt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default Dala Crest</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SHOWCASE ADVERTS & BILLBOARDS */}
      {/* ======================================================== */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-200">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-sky-600" />
              <span>Digital Billboard & Showcase Adverts Oversight</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Promote top merchants into the high-visibility "City Billboard & Sponsored Showcase" banner carousel on the marketplace homepage. Click to promote or demote storefronts instantly.
            </p>
          </div>

          {/* Current Active Showcases */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Currently Promoted Showcases ({showcaseAdverts.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {showcaseAdverts.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-2xl border border-sky-200 bg-sky-50/30 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-300">
                        {ad.badge}
                      </span>
                      <span className="text-xs font-bold text-amber-600">★ {ad.rating}</span>
                    </div>

                    <div className="h-28 w-full rounded-xl overflow-hidden bg-stone-900">
                      <img src={ad.image} alt={ad.stallName} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">{ad.stallName}</h5>
                      <p className="text-[11px] font-semibold text-stone-700 line-clamp-1">{ad.campaignTitle}</p>
                      <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">{ad.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-sky-200/60 text-xs">
                    <span className="text-[10px] text-emerald-700 font-bold">{ad.discountOffer || 'Active Billboard'}</span>
                    <button
                      onClick={() => {
                        deleteShowcaseAdvert(ad.id);
                        triggerToast(`Removed ${ad.stallName} from showcase.`);
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stalls Table: One-Click Toggle Promotion */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Select Storefront to Mark / Demote as Billboard Showcase
                </h4>
                <p className="text-xs text-stone-500">
                  Click "Mark Showcase" on any merchant below to publish their banner to the digital billboards.
                </p>
              </div>

              <input
                type="text"
                value={stallSearch}
                onChange={(e) => setStallSearch(e.target.value)}
                placeholder="Search vendor by name or plot..."
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">Merchant Storefront</th>
                    <th className="py-2.5 px-4">District & Plot</th>
                    <th className="py-2.5 px-4">Tier</th>
                    <th className="py-2.5 px-4">Showcase Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStalls.slice(0, 8).map((stall) => {
                    const isPromoted = showcaseAdverts.some((ad) => ad.stallId === stall.id);

                    return (
                      <tr key={stall.id} className="hover:bg-amber-50/20 transition">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={stall.avatarUrl || stall.bannerUrl}
                              alt={stall.name}
                              className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-xs">{stall.name}</p>
                              <p className="text-[10px] text-stone-500">{stall.ownerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-mono text-xs font-semibold">{stall.plotNumber}</span>
                        </td>
                        <td className="py-2.5 px-4 text-stone-600">{stall.tier}</td>
                        <td className="py-2.5 px-4">
                          {isPromoted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-300">
                              <Check className="w-3 h-3" />
                              Promoted Showcase
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-medium">Standard Listing</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => {
                              toggleStallShowcase(stall.id);
                              triggerToast(
                                isPromoted
                                  ? `Removed ${stall.name} from showcase billboards.`
                                  : `Promoted ${stall.name} to billboard showcase!`
                              );
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                              isPromoted
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
                            }`}
                          >
                            {isPromoted ? 'Demote' : 'Mark Showcase'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: OFFERS OF THE WEEK / SPECIAL OFFERS */}
      {/* ======================================================== */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-200">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Offers of the Week & Flash Markdown Curator</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Items marked as "Offer of the Week" get featured in the interactive flash deals scroll banner with countdown timer badges, instant M-Pesa discounts, and reserve passes.
            </p>
          </div>

          {/* Current Active Offers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Live Flash Offers ({weeklyOffers.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {weeklyOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-rose-200 bg-rose-50/30 p-3.5 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-stone-900">
                      <img src={offer.thumbnail} alt={offer.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow-xs">
                        -{offer.discountPercent}% OFF
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-500">{offer.stallName}</span>
                      <h5 className="font-bold text-stone-900 text-xs line-clamp-1">{offer.title}</h5>
                      <div className="flex items-center gap-2 pt-1 font-mono">
                        <span className="text-xs font-extrabold text-stone-950">
                          {formatPrice(offer.salePriceKes)}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          {formatPrice(offer.originalPriceKes)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-rose-200 text-xs">
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {offer.endsInHours}h left
                    </span>
                    <button
                      onClick={() => {
                        deleteWeeklyOffer(offer.id);
                        triggerToast(`Removed offer "${offer.title}".`);
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Offers from Product Catalog */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Select Product / Stay to Mark as Special Offer
                </h4>
                <p className="text-xs text-stone-500">
                  Toggle any catalog item below into the Weekly Offers carousel with automated discount calculations.
                </p>
              </div>

              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder="Search catalog item or vendor..."
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">Item & Stall</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Sale Price</th>
                    <th className="py-2.5 px-4">Offer Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredListings.slice(0, 10).map((item) => {
                    const isSpecialOffer = Boolean(item.isOfferOfTheWeek);

                    return (
                      <tr key={item.id} className="hover:bg-amber-50/20 transition">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-xs">{item.title}</p>
                              <p className="text-[10px] text-stone-500">{item.stallName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-stone-600 uppercase text-[10px] font-bold">
                          {item.category}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-stone-900">
                          {formatPrice(item.priceKes)}
                        </td>
                        <td className="py-2.5 px-4">
                          {isSpecialOffer ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                              <Flame className="w-3 h-3 text-rose-600" />
                              Offer of the Week
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-medium">Regular Price</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => {
                              toggleListingOfferOfTheWeek(item.id);
                              triggerToast(
                                isSpecialOffer
                                  ? `Removed "${item.title}" from weekly offers.`
                                  : `Marked "${item.title}" as Offer of the Week!`
                              );
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                              isSpecialOffer
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                            }`}
                          >
                            {isSpecialOffer ? 'Unmark Offer' : 'Mark as Special Offer'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
