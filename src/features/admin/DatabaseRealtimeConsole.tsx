import React, { useState, useEffect } from 'react';
import {
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  WifiOff,
  Zap,
  Radio,
  Server,
  Shield,
  Layers,
  ArrowUpRight,
  Play,
  Pause,
  Trash2,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  PlusCircle,
  Copy,
  Check,
  HardDrive,
  FileCode,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { databaseService, DatabaseStatus, RealtimeDatabaseEvent, MediaMetadataRecord } from '../../services/supabaseClient';
import { StorageMediaUploader } from '../../components/common/StorageMediaUploader';

interface DatabaseRealtimeConsoleProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const DatabaseRealtimeConsole: React.FC<DatabaseRealtimeConsoleProps> = ({
  onClose,
  isModal = false,
}) => {
  const [status, setStatus] = useState<DatabaseStatus>(databaseService.getStatus());
  const [events, setEvents] = useState<RealtimeDatabaseEvent[]>(databaseService.getEventsHistory());
  const [mediaRecords, setMediaRecords] = useState<MediaMetadataRecord[]>(databaseService.getMediaMetadataRecords());
  const [isPinging, setIsPinging] = useState(false);
  const [isTrafficActive, setIsTrafficActive] = useState(databaseService.isLiveTrafficActive());
  const [selectedPayload, setSelectedPayload] = useState<RealtimeDatabaseEvent | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSqlMigration, setShowSqlMigration] = useState(false);
  const [showStorageTab, setShowStorageTab] = useState<'console' | 'storage'>('console');
  const [customUrl, setCustomUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [customKey, setCustomKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [recentFlashTable, setRecentFlashTable] = useState<string | null>(null);

  const storageBucket = databaseService.getStorageBucketConfig();

  const SQL_MIGRATION_TEXT = `-- 1. Create the persistent storage bucket for Dala media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dala-media', 
  'dala-media', 
  true, 
  5242880, -- 5MB limit per file for mobile optimization in Kenya
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- ==========================================
-- 2. Storage Bucket RLS Policies
-- ==========================================

DROP POLICY IF EXISTS "Public Read Access for Dala Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Delete" ON storage.objects;

-- Allow public viewing of all virtual shop images and hero sections
CREATE POLICY "Public Read Access for Dala Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'dala-media');

-- Allow logged-in users (Vendors & Admins) to upload files
CREATE POLICY "Authenticated Vendors and Admins Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dala-media' 
  AND auth.role() = 'authenticated'
);

-- Allow logged-in users to update/replace files
CREATE POLICY "Authenticated Vendors and Admins Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'dala-media' 
  AND auth.role() = 'authenticated'
);

-- Allow logged-in users to delete files
CREATE POLICY "Authenticated Vendors and Admins Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dala-media' 
  AND auth.role() = 'authenticated'
);

-- ==========================================
-- 3. Persistent Metadata Table (Fixes Persistence Bug)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.media_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    section_type TEXT CHECK (section_type IN ('hero', 'shop_banner', 'product', 'gallery')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view media metadata" ON public.media_metadata;
DROP POLICY IF EXISTS "Vendors and Admins can manage media metadata" ON public.media_metadata;

CREATE POLICY "Public can view media metadata"
ON public.media_metadata FOR SELECT
USING (true);

CREATE POLICY "Vendors and Admins can manage media metadata"
ON public.media_metadata FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_metadata_modtime
    BEFORE UPDATE ON public.media_metadata
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();`;

  useEffect(() => {
    const unsubStatus = databaseService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
      if (newStatus.lastUpdatedTable) {
        setRecentFlashTable(newStatus.lastUpdatedTable);
        const timer = setTimeout(() => setRecentFlashTable(null), 2500);
        return () => clearTimeout(timer);
      }
    });

    const unsubEvents = databaseService.subscribeEvents((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      setMediaRecords(databaseService.getMediaMetadataRecords());
    });

    return () => {
      unsubStatus();
      unsubEvents();
    };
  }, []);

  const handlePing = async () => {
    setIsPinging(true);
    await databaseService.pingDatabase();
    setTimeout(() => setIsPinging(false), 350);
  };

  const handleToggleTraffic = () => {
    const next = databaseService.toggleLiveTrafficStream();
    setIsTrafficActive(next);
  };

  const handleSimulateMpesa = () => {
    const merchants = ['Kisumu Art Pavilion', 'Dunga Sunset Grill', 'Victoria Crafts Hub', 'Nairobi Silicon Lab'];
    const selected = merchants[Math.floor(Math.random() * merchants.length)];
    const amounts = [1200, 2500, 4800, 6500, 15000];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    databaseService.simulateRealtimeTransaction(selected, amount, 'mpesa_stk_rent');
  };

  const handleSimulateListing = () => {
    const items = [
      { title: 'Lake Victoria Tilapia Smoked Fillet', price: 1800, cat: 'hospitality' },
      { title: 'Handwoven Sisal Market Basket', price: 1450, cat: 'retail' },
      { title: 'Rusinga Island 2-Night Eco-Cottage', price: 9500, cat: 'hospitality' },
      { title: 'Traditional Nyatiti Acoustic Performance', price: 4000, cat: 'entertainment' },
    ];
    const item = items[Math.floor(Math.random() * items.length)];
    databaseService.simulateNewListing('Kisumu Artisan Collective', item.title, item.price, item.cat);
  };

  const handleSimulateKYC = () => {
    const shops = ['Kisumu Lakeview Motors', 'Milimani Holistic Retreat', 'Dunga Lakeside Pier', 'Simba Safari Outfitters'];
    const selected = shops[Math.floor(Math.random() * shops.length)];
    databaseService.simulateKYCApproval(selected, 'approved');
  };

  const handleSimulateMediaUpload = () => {
    const sampleImages = [
      {
        title: 'Kisumu Sunset Pier Over Lake Victoria',
        section: 'hero' as const,
        vendor: 'vnd-104',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Lakeside Handcrafted Soapstone Sculptures',
        section: 'product' as const,
        vendor: 'vnd-101',
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Vibrant Swahili Kanga Textile Atelier',
        section: 'shop_banner' as const,
        vendor: 'vnd-102',
        url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80',
      },
    ];
    const chosen = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    const mockFile = new File([new Blob(['mock-image-data'])], `${chosen.section}-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });

    databaseService.uploadMediaFile(mockFile, {
      title: chosen.title,
      vendor_id: chosen.vendor,
      section_type: chosen.section,
      description: 'Persistent media upload registered to dala-media and public.media_metadata',
    });
    setMediaRecords(databaseService.getMediaMetadataRecords());
  };

  const handleToggleDisconnect = () => {
    databaseService.toggleConnectionSimulation();
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim() && customKey.trim()) {
      databaseService.updateCredentials(customUrl.trim(), customKey.trim());
      setShowConfig(false);
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const isConnected = status.isConnected && status.connectionState === 'connected';

  return (
    <div
      className={`rounded-3xl bg-white border border-stone-200/90 shadow-sm overflow-hidden transition-all duration-200 ${
        isModal ? 'w-full max-w-5xl max-h-[90vh] flex flex-col' : ''
      }`}
    >
      {/* Top Console Bar */}
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-50/60 via-amber-50/30 to-stone-50/60">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-600 ring-2 ring-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 ring-2 ring-rose-500/20'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 font-heading">
                PostgreSQL Engine & Live Realtime Synchronizer
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isConnected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : status.connectionState === 'reconnecting'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {status.connectionState.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {status.url} · {status.region}
            </p>
          </div>
        </div>

        {/* Top Actions & Sub-Tabs */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* View Tab Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setShowStorageTab('console')}
              className={`px-3 py-1.5 rounded-lg transition ${
                showStorageTab === 'console'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Realtime WAL
            </button>
            <button
              onClick={() => setShowStorageTab('storage')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                showStorageTab === 'storage'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>dala-media & Metadata</span>
            </button>
          </div>

          <button
            onClick={handlePing}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition active:scale-95 border border-stone-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isPinging ? 'Pinging...' : 'Ping DB'}</span>
          </button>

          <button
            onClick={handleToggleTraffic}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              isTrafficActive
                ? 'bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            {isTrafficActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isTrafficActive ? 'Pause Live Ticker' : 'Auto Stream Live Traffic'}</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
        {/* Connection Diagnostics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Latency & Ping Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Round-Trip Latency</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-stone-900">
                {isConnected ? `${status.latencyMs} ms` : '--'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">last ping {status.lastPing}</span>
            </div>
            {/* Sparkline visualization of last pings */}
            <div className="flex items-end gap-1 h-6 pt-1">
              {status.pingHistory.map((val, idx) => {
                const heightPct = Math.min(100, Math.max(20, (val / 60) * 100));
                return (
                  <div
                    key={idx}
                    title={`${val}ms`}
                    style={{ height: `${heightPct}%` }}
                    className={`flex-1 rounded-t-xs transition-all ${
                      idx === status.pingHistory.length - 1
                        ? 'bg-amber-500'
                        : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Realtime WebSocket Channel */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Realtime WebSocket</span>
              <Radio className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-stone-900 font-mono truncate">
                {status.channelName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full-duplex WebSocket Active</span>
            </div>
          </div>

          {/* Postgres Engine Spec */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">PostgreSQL Core</span>
              <Server className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xs font-mono font-bold text-stone-800 line-clamp-1">
              PostgreSQL 16.2
            </div>
            <div className="text-[11px] text-stone-500 font-mono space-y-0.5">
              <p>Port: {status.poolerPort} (Transaction Pooler)</p>
              <p className="truncate">SSL: TLSv1.3 ECDHE-RSA</p>
            </div>
          </div>

          {/* Persistent Storage Bucket Card */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">dala-media Storage</span>
              <HardDrive className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black font-mono text-stone-900">
                5 MB Limit
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                PUBLIC READ
              </span>
            </div>
            <p className="text-[10px] text-stone-600 font-mono">
              public.media_metadata: {status.tableCounts.media_metadata} assets bound
            </p>
          </div>
        </div>

        {/* Relational Tables Realtime Counters (Now includes public.media_metadata) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Relational Tables Live Synchronizer (Postgres public schema)
              </h3>
            </div>
            <span className="text-[11px] text-stone-500">8 Relational Tables Monitored</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[
              { key: 'users', label: 'users', pk: 'id (uuid)' },
              { key: 'vendors', label: 'vendors', pk: 'user_id' },
              { key: 'virtual_shops', label: 'virtual_shops', pk: 'vendor_id' },
              { key: 'listings', label: 'listings', pk: 'shop_id' },
              { key: 'subscriptions', label: 'subscriptions', pk: 'vendor_id' },
              { key: 'ad_design_requests', label: 'ad_requests', pk: 'vendor_id' },
              { key: 'transactions', label: 'transactions', pk: 'ref_code' },
              { key: 'media_metadata', label: 'media_meta', pk: 'id (uuid)' },
            ].map((tbl) => {
              const count = status.tableCounts[tbl.key as keyof typeof status.tableCounts] || 0;
              const isFlashing = recentFlashTable === tbl.key;
              const isMedia = tbl.key === 'media_metadata';
              return (
                <div
                  key={tbl.key}
                  className={`p-3 rounded-2xl border transition-all duration-300 ${
                    isFlashing
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-sm'
                      : isMedia
                      ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                      : 'bg-stone-50 border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-mono font-bold uppercase truncate">
                      {tbl.label}
                    </span>
                    {isFlashing && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <div className="text-lg font-black text-stone-900 font-mono mt-1">
                    {count.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-stone-400 font-mono truncate mt-0.5">
                    PK: {tbl.pk}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Storage Bucket & Persistent Media Manager */}
        {showStorageTab === 'storage' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Storage Uploader & Bucket Spec */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <StorageMediaUploader
                  vendorId="vnd-101"
                  vendorName="Dala Artisan Flagship"
                  sectionType="hero"
                  onUploadSuccess={() => {
                    setMediaRecords(databaseService.getMediaMetadataRecords());
                  }}
                />

                {/* Storage SQL Viewer Toggle */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-stone-800">
                        Executed Migration: Storage Bucket & RLS Policies
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSqlMigration(!showSqlMigration)}
                      className="text-xs font-bold text-amber-700 hover:underline"
                    >
                      {showSqlMigration ? 'Hide SQL' : 'View SQL Migration'}
                    </button>
                  </div>

                  {showSqlMigration && (
                    <div className="space-y-2">
                      <pre className="p-3 bg-stone-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56">
                        {SQL_MIGRATION_TEXT}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(SQL_MIGRATION_TEXT, 'sql-mig')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-200 text-xs font-bold hover:bg-stone-800 transition"
                      >
                        {copiedText === 'sql-mig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'sql-mig' ? 'Copied SQL Script!' : 'Copy Migration SQL'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bound Media Assets Table */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Persistent Assets in public.media_metadata
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    {mediaRecords.length} records bound
                  </span>
                </div>

                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
                  <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
                    {mediaRecords.map((item) => (
                      <div key={item.id} className="p-3 hover:bg-stone-50 transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-stone-900 text-xs truncate">{item.title}</p>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                                {item.section_type}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-500 font-mono truncate">{item.image_url}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              Size: {item.file_size_bytes ? (item.file_size_bytes / 1024).toFixed(0) : '340'} KB · Bound to vendor {item.vendor_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => copyToClipboard(item.image_url, item.id)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs transition"
                            title="Copy Image URL"
                          >
                            {copiedText === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              databaseService.deleteMediaMetadataRecord(item.id);
                              setMediaRecords(databaseService.getMediaMetadataRecords());
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete metadata row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live WAL Stream & Action Bench Grid */}
        {showStorageTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            {/* Realtime Event Changefeed Stream (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Live Database WAL Changefeed Stream (Realtime WebSocket)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-stone-500">
                    {events.length} events buffered
                  </span>
                  <button
                    onClick={() => databaseService.clearEventsHistory()}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    title="Clear Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Event List */}
              <div className="border border-stone-200 rounded-2xl bg-stone-950 text-stone-200 p-3 max-h-72 overflow-y-auto space-y-2 font-mono text-xs">
                {events.length === 0 ? (
                  <div className="py-8 text-center text-stone-500 text-xs">
                    No database events buffered. Click actions on the right to broadcast WAL writes.
                  </div>
                ) : (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              evt.eventType === 'INSERT'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : evt.eventType === 'UPDATE'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {evt.eventType}
                          </span>
                          <span className="text-stone-300 font-bold truncate">public.{evt.table}</span>
                          <span className="text-stone-500 text-[10px]">{evt.timestamp}</span>
                        </div>
                        <p className="text-stone-400 text-xs font-sans line-clamp-1">{evt.recordSummary}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-stone-500">{evt.latencyMs}ms</span>
                        {evt.payload && (
                          <button
                            onClick={() => setSelectedPayload(evt)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] transition"
                          >
                            <Code className="w-3 h-3" />
                            <span>Payload</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interactive Live Realtime Action Bench (1 col) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Realtime Interaction Bench
              </h3>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <p className="text-xs text-stone-600">
                  Execute live database writes & media uploads to test instant real-time synchronization:
                </p>

                <button
                  onClick={handleSimulateMpesa}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 text-stone-900 text-xs font-bold shadow-2xs hover:border-emerald-300 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Simulate M-Pesa STK Settlement</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                    INSERT
                  </span>
                </button>

                <button
                  onClick={handleSimulateListing}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 text-stone-900 text-xs font-bold shadow-2xs hover:border-amber-300 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Simulate New Merchant Item Upload</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                    INSERT
                  </span>
                </button>

                <button
                  onClick={handleSimulateMediaUpload}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 text-stone-900 text-xs font-bold shadow-2xs hover:border-amber-300 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Upload to dala-media & Metadata</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                    RLS OK
                  </span>
                </button>

                <button
                  onClick={handleSimulateKYC}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-stone-200 text-stone-900 text-xs font-bold shadow-2xs hover:border-sky-300 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Simulate KYC Status Approval</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded font-bold">
                    UPDATE
                  </span>
                </button>

                <button
                  onClick={handleToggleDisconnect}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold shadow-2xs transition active:scale-95 text-left ${
                    isConnected
                      ? 'bg-white hover:bg-rose-50 border-stone-200 text-rose-700 hover:border-rose-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 flex-shrink-0" />
                    <span>{isConnected ? 'Simulate Connection Drop' : 'Restore Realtime Link'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-white/20">
                    CHAOS
                  </span>
                </button>
              </div>

              {/* Cloud Credentials Expander */}
              <div className="pt-1">
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                >
                  <span>Live Supabase Cloud Project Settings</span>
                  {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showConfig && (
                  <form
                    onSubmit={handleSaveCredentials}
                    className="mt-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs animate-in fade-in"
                  >
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://xyz.supabase.co"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Anon Public Key
                      </label>
                      <input
                        type="password"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition shadow-xs"
                    >
                      Connect & Re-Initialize Live Client
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl max-w-lg w-full p-5 space-y-3 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-amber-400">
                  Postgres Row Payload: public.{selectedPayload.table}
                </span>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 font-sans">{selectedPayload.recordSummary}</p>

            <pre className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-64">
              {JSON.stringify(selectedPayload.payload || {}, null, 2)}
            </pre>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-stone-500 font-mono">
                Received at {selectedPayload.timestamp} · Latency {selectedPayload.latencyMs}ms
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(selectedPayload.payload || {}, null, 2),
                    'payload'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 transition"
              >
                {copiedText === 'payload' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
