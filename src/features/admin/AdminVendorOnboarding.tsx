import React, { useState } from 'react';
import {
  UserPlus,
  Building,
  Store,
  MapPin,
  Tag,
  DollarSign,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const CATEGORY_OPTIONS = [
  'Retail and Commerce',
  'Real Estate and Property',
  'Events and Entertainment',
  'Hospitality, Tourism and Experiences',
  'Wellness and Personal Services',
];

const TIER_OPTIONS: Array<{ label: 'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion'; rent: number; desc: string }> = [
  { label: 'Micro-Stall', rent: 2500, desc: 'Ideal for solo artisans & micro-retailers' },
  { label: 'Boutique Kiosk', rent: 6000, desc: 'Great for growing shops, agencies & cafes' },
  { label: 'Flagship Pavilion', rent: 15000, desc: 'Premium prominence with priority ad placement' },
];

const DISTRICT_OPTIONS = [
  { id: 'all', name: 'All Kisumu Districts' },
  { id: 'city-square', name: 'City Square & Oginga Odinga' },
  { id: 'kibuye', name: 'Kibuye Market & Trade Hub' },
  { id: 'milimani', name: 'Milimani Commercial & Residential' },
  { id: 'kondele', name: 'Kondele Expressway Center' },
  { id: 'downtown', name: 'Kisumu Downtown Waterfront' },
];

const BANNER_PRESETS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
];

export const AdminVendorOnboarding: React.FC = () => {
  const { addVendorStall, districts } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [districtId, setDistrictId] = useState('city-square');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [tier, setTier] = useState<'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion'>('Boutique Kiosk');
  const [monthlyRentKes, setMonthlyRentKes] = useState(6000);
  const [plotNumber, setPlotNumber] = useState('Plot 12, Oginga Odinga Street');
  const [bannerUrl, setBannerUrl] = useState(BANNER_PRESETS[0]);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  const [bio, setBio] = useState('Premier verified merchant on Dala Virtual City.');
  const [contactMpesa, setContactMpesa] = useState('+254 712 345 678');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTierChange = (selectedTier: 'Micro-Stall' | 'Boutique Kiosk' | 'Flagship Pavilion') => {
    setTier(selectedTier);
    const found = TIER_OPTIONS.find((t) => t.label === selectedTier);
    if (found) {
      setMonthlyRentKes(found.rent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim()) return;

    addVendorStall({
      name,
      ownerName,
      districtId,
      category,
      tier,
      plotNumber,
      bannerUrl,
      avatarUrl,
      bio,
      contactMpesa,
      monthlyRentKes,
    });

    setSuccessMessage(`Successfully onboarded "${name}" as a verified ${category} vendor!`);
    setName('');
    setOwnerName('');
    setBio('Premier verified merchant on Dala Virtual City.');
    setTimeout(() => {
      setSuccessMessage(null);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="rounded-3xl bg-white border border-stone-200/90 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Merchant Provisioning
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 font-heading mt-1">
            Vendor Onboarding & Storefront Creation
          </h2>
          <p className="text-xs text-stone-500">
            Provision new merchant stalls, assign storefront categories, and establish M-Pesa automated leases.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Onboarding Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-heading">
                  Onboard New Dala Vendor Storefront
                </h3>
                <p className="text-xs text-stone-500">
                  Select shop category, lease tier, and setup proprietor credentials.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lakeside Elegance Fashion"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Proprietor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Akinyi Otieno"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Vendor Type / Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Shop Discovery Category (Vendor Type) *</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50 font-medium"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500">
                  Classifies the vendor into one of Dala's 5 principal discovery pathways.
                </p>
              </div>

              {/* District & Plot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>City District / Zone</span>
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  >
                    {DISTRICT_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Plot Number / Street Address</label>
                  <input
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    placeholder="e.g. Plot 42, Oginga Odinga Street"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Lease Tier & Monthly Rent */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700">Virtual Land Lease Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIER_OPTIONS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => handleTierChange(t.label)}
                      className={`p-3 rounded-2xl border text-left transition space-y-1 ${
                        tier === t.label
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold text-stone-900 text-xs">{t.label}</p>
                      <p className="text-xs font-extrabold text-amber-700">KES {t.rent.toLocaleString()} / mo</p>
                      <p className="text-[10px] text-stone-500 leading-relaxed">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp / Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / M-Pesa Contact</span>
                  </label>
                  <input
                    type="text"
                    value={contactMpesa}
                    onChange={(e) => setContactMpesa(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Monthly Rent (KES)</label>
                  <input
                    type="number"
                    value={monthlyRentKes}
                    onChange={(e) => setMonthlyRentKes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Banner & Logo Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                    <span>Storefront Banner Image URL</span>
                  </label>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Logo / Avatar URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Business Bio / Tagline</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50/50"
                  placeholder="Describe the merchant shop..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & Provision Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
