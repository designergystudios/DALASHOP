import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, XCircle, Package, Calendar, Tag, DollarSign, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ListingCategory, ListingItem } from '../../types';
import { StorageMediaUploader } from '../../components/common/StorageMediaUploader';

export const InventoryManager: React.FC = () => {
  const {
    stalls,
    activeVendorStallId,
    listings,
    addListing,
    deleteListing,
    toggleListingAvailability,
    formatPrice,
  } = useAppStore();

  const currentStall = stalls.find((s) => s.id === activeVendorStallId) || stalls[0];
  const stallListings = listings.filter((l) => l.stallId === currentStall.id);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<ListingCategory, 'all'>>('crafts');
  const [type, setType] = useState<ListingItem['type']>('product');
  const [priceKes, setPriceKes] = useState(2500);
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=75');
  const [dates, setDates] = useState('');

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      title,
      category,
      type,
      priceKes,
      description,
      thumbnail,
      location: `${currentStall.name} (${currentStall.plotNumber})`,
      districtId: currentStall.districtId,
      isAvailable: true,
      dates: type === 'stay' || type === 'event' ? dates : undefined,
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Catalog & Accommodations Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage physical goods, eco-lodge booking dates, and virtual event tickets
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product / Stay</span>
        </button>
      </div>

      {/* Inventory Table / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item / Experience</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (KES)</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stallListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{item.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                      {item.dates && (
                        <p className="text-[10px] text-cyan-400 mt-0.5">Schedule: {item.dates}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize font-medium text-slate-200">{item.type}</td>
                  <td className="py-3 px-4 capitalize text-slate-400">{item.category}</td>
                  <td className="py-3 px-4 font-bold text-white">{formatPrice(item.priceKes)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleListingAvailability(item.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                        item.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Sold Out
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-heading">
                Publish New Item to Virtual Kiosk
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Title / Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Swahili Kanga Scarf or Lake View Suite"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Item Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ListingItem['type'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="product">Physical Product</option>
                    <option value="stay">Accommodation / Lodge</option>
                    <option value="event">Live Event Pass</option>
                    <option value="service">Artisan Service</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Exclude<ListingCategory, 'all'>)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="crafts">Crafts & Woodwork</option>
                    <option value="fashion">Afro-Fashion</option>
                    <option value="stays">Stays & Villas</option>
                    <option value="events">Events & Tours</option>
                    <option value="food">Spices & Coffee</option>
                    <option value="tech">Tech & Gear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Price (KES)</label>
                <input
                  type="number"
                  value={priceKes}
                  onChange={(e) => setPriceKes(Number(e.target.value))}
                  required
                  min={50}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Storefront Media (dala-media bucket)</label>
                <StorageMediaUploader
                  compact
                  vendorId={currentStall.id}
                  vendorName={currentStall.name}
                  sectionType="product"
                  onUploadSuccess={(uploadedUrl) => setThumbnail(uploadedUrl)}
                />
                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Or Direct Image URL</label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {(type === 'stay' || type === 'event') && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Dates / Availability Schedule</label>
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="e.g. Available every weekend in November"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Artisan details, materials, or stay inclusions..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                >
                  Publish to City Grid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
