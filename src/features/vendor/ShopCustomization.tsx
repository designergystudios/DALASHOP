import React, { useState } from 'react';
import { Palette, Check, Save, Image, Sparkles, Store, Phone, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StorageMediaUploader } from '../../components/common/StorageMediaUploader';

const COLOR_PRESETS = [
  { name: 'Ochre Orange', value: '#ea580c' },
  { name: 'Swahili Emerald', value: '#059669' },
  { name: 'Lakeside Cyan', value: '#0284c7' },
  { name: 'Amethyst Indigo', value: '#6366f1' },
  { name: 'Savannah Gold', value: '#ca8a04' },
  { name: 'Coral Rose', value: '#e11d48' },
];

export const ShopCustomization: React.FC = () => {
  const { stalls, activeVendorStallId, updateStallCustomization } = useAppStore();
  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];

  const [name, setName] = useState(currentStall.name);
  const [bio, setBio] = useState(currentStall.bio);
  const [themeColor, setThemeColor] = useState(currentStall.themeColor);
  const [bannerUrl, setBannerUrl] = useState(currentStall.bannerUrl);
  const [contactMpesa, setContactMpesa] = useState(currentStall.contactMpesa);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStallCustomization(currentStall.id, {
      name,
      bio,
      themeColor,
      bannerUrl,
      contactMpesa,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
          Shop Customization & Virtual Kiosk Studio
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Design your virtual stall branding, banner appearance, and merchant contacts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Kiosk / Stall Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
                <Store className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Stall Story & Artisan Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Brand Accent Palette
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setThemeColor(color.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      themeColor === color.value
                        ? 'border-white bg-slate-800 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.value }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Virtual Stall Banner (dala-media persistent bucket)
              </label>
              <StorageMediaUploader
                compact
                vendorId={currentStall.id}
                vendorName={currentStall.name}
                sectionType="shop_banner"
                onUploadSuccess={(url) => setBannerUrl(url)}
              />
              <div className="relative">
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Image className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Merchant Safaricom M-Pesa Contact
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactMpesa}
                  onChange={(e) => setContactMpesa(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Stall Branding</span>
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800/80">
                  <Check className="w-3.5 h-3.5" />
                  <span>Kiosk customization published live to virtual city!</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Live Kiosk Preview */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Live Virtual Kiosk Preview
          </span>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/8] w-full bg-slate-950">
              <img src={bannerUrl} alt={name} className="w-full h-full object-cover" />
              <div
                className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono text-white font-bold"
                style={{ backgroundColor: themeColor }}
              >
                Plot {currentStall.plotNumber}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{name}</h3>
                  <span className="text-xs text-emerald-400 font-medium">
                    Verified East Africa Kiosk
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  🏪
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{bio}</p>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="font-semibold text-white">{contactMpesa}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
