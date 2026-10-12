-- ==============================================================================
-- DALA MEDIA & PERSISTENT STORAGE BUCKET SCHEMA MIGRATION
-- Project: Dala Virtual City (Kisumu & East Africa Multi-Vendor Platform)
-- Purpose: Persistent media bucket configuration, RLS policies, metadata tracking,
--          and automated timestamps to resolve image persistence bugs.
-- ==============================================================================

-- 1. Create the persistent storage bucket for Dala media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dala-media', 
  'dala-media', 
  true, 
  5242880, -- 5MB limit per file for mobile network optimization in East Africa
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- ==========================================
-- 2. Storage Bucket RLS Policies
-- ==========================================

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Access for Dala Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Vendors and Admins Delete" ON storage.objects;

-- Allow public viewing of all virtual shop images, banners, and hero assets
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
-- Storing image URLs alone in local state often causes persistence bugs when sessions refresh. 
-- This table binds images permanently to specific vendors, hero sections, and descriptions.

CREATE TABLE IF NOT EXISTS public.media_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    section_type TEXT CHECK (section_type IN ('hero', 'shop_banner', 'product', 'gallery')),
    file_size_bytes INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security on metadata
ALTER TABLE public.media_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing metadata policies if re-running
DROP POLICY IF EXISTS "Public can view media metadata" ON public.media_metadata;
DROP POLICY IF EXISTS "Vendors and Admins can manage media metadata" ON public.media_metadata;

-- Allow everyone to read metadata (Marketplace display & storefront rendering)
CREATE POLICY "Public can view media metadata"
ON public.media_metadata FOR SELECT
USING (true);

-- Allow authenticated vendors and admins to insert, update, and delete metadata descriptions/hero sections
CREATE POLICY "Vendors and Admins can manage media metadata"
ON public.media_metadata FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Indexes for lightning fast lookups across storefronts and categories
CREATE INDEX IF NOT EXISTS idx_media_metadata_vendor ON public.media_metadata(vendor_id);
CREATE INDEX IF NOT EXISTS idx_media_metadata_section ON public.media_metadata(section_type);

-- 4. Auto-update timestamp trigger for persistence tracking
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_media_metadata_modtime ON public.media_metadata;

CREATE TRIGGER update_media_metadata_modtime
    BEFORE UPDATE ON public.media_metadata
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
