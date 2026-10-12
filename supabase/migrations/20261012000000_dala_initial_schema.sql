-- ============================================================================
-- DALA VIRTUAL CITY - RELATIONAL DATABASE SCHEMA & MIGRATION
-- Engine: PostgreSQL 15+ / Supabase
-- Modules: Multi-Vendor Stalls, 365-Day Listings, SaaS Subscriptions, Ad Pipeline
-- ============================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- 1. ENUMERATED TYPES (Strict Domain Integrity)
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');

CREATE TYPE vendor_category AS ENUM (
  'retail',
  'entertainment',
  'wellness',
  'hospitality',
  'travel',
  'freelance'
);

CREATE TYPE virtual_shop_tier AS ENUM (
  'micro_stall',
  'boutique_kiosk',
  'flagship_pavilion'
);

CREATE TYPE vendor_subscription_status AS ENUM (
  'trial',
  'active',
  'grace_period',
  'overdue',
  'canceled'
);

CREATE TYPE listing_type AS ENUM (
  'product',
  'event',
  'accommodation',
  'service'
);

CREATE TYPE billing_cycle_type AS ENUM (
  'monthly',
  'quarterly',
  'annual'
);

CREATE TYPE ad_package_type AS ENUM (
  'city_square_billboard',
  'district_spotlight',
  'category_sponsor'
);

CREATE TYPE ad_request_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'rejected'
);

CREATE TYPE payment_gateway_type AS ENUM (
  'mpesa',
  'card'
);

CREATE TYPE transaction_type AS ENUM (
  'rent',
  'ad_service'
);

CREATE TYPE transaction_status AS ENUM (
  'initiated',
  'completed',
  'failed',
  'refunded'
);

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 USERS
-- Integrates with Supabase Auth or standalone PostgreSQL
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  full_name VARCHAR(150),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_users_phone_format CHECK (phone_number ~* '^\+?[0-9]{9,15}$')
);

-- ----------------------------------------------------------------------------
-- 2.2 VENDORS
-- Profiles for verified merchants and independent artisans
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  category vendor_category NOT NULL,
  virtual_shop_tier virtual_shop_tier NOT NULL DEFAULT 'micro_stall',
  subscription_status vendor_subscription_status NOT NULL DEFAULT 'trial',
  logo_url TEXT,
  tax_identifier VARCHAR(100), -- KRA PIN / Rwanda TIN / TRA TIN
  contact_mpesa VARCHAR(50),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 2.3 VIRTUAL SHOPS
-- 3D / Isometric stall visual configuration and visitor telemetry
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS virtual_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
  template_id VARCHAR(100) NOT NULL DEFAULT 'swahili_bazaar_v1',
  custom_css_theme JSONB NOT NULL DEFAULT '{
    "primary_color": "#ea580c",
    "accent_color": "#0284c7",
    "stall_roof_style": "canopy_reed",
    "font_family": "Plus Jakarta Sans"
  }'::jsonb,
  banner_url TEXT,
  plot_number VARCHAR(50), -- e.g., 'NS-04', 'KL-12'
  district_code VARCHAR(50) NOT NULL DEFAULT 'nairobi-souk',
  views_count BIGINT NOT NULL DEFAULT 0 CHECK (views_count >= 0),
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 2.4 LISTINGS
-- Goods, eco-stays, experiences & tickets (supports 365-day active ranges)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  virtual_shop_id UUID NOT NULL REFERENCES virtual_shops(id) ON DELETE CASCADE,
  type listing_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'KES',
  dates_available DATERANGE NOT NULL DEFAULT daterange(CURRENT_DATE, (CURRENT_DATE + INTERVAL '365 days')::DATE, '[]'),
  location_metadata JSONB NOT NULL DEFAULT '{
    "country": "Kenya",
    "city": "Nairobi",
    "district": "Silicon Souk",
    "coordinates": {"lat": -1.286389, "lng": 36.817223}
  }'::jsonb,
  image_urls TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INT CHECK (stock_quantity >= 0), -- NULL = unlimited/service
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
  review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT chk_listings_365_day_cap CHECK (
    upper(dates_available) - lower(dates_available) <= 366
  )
);

-- ----------------------------------------------------------------------------
-- 2.5 SUBSCRIPTIONS
-- SaaS digital land lease management & recurring billing cycles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  plan_type virtual_shop_tier NOT NULL,
  rent_amount NUMERIC(12, 2) NOT NULL CHECK (rent_amount >= 0),
  billing_cycle billing_cycle_type NOT NULL DEFAULT 'monthly',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  expires_at TIMESTAMPTZ NOT NULL,
  status vendor_subscription_status NOT NULL DEFAULT 'active',
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  mpesa_daraja_billref VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT chk_subscriptions_valid_dates CHECK (expires_at > starts_at)
);

-- ----------------------------------------------------------------------------
-- 2.6 AD DESIGN REQUESTS
-- Creative services pipeline for 3D billboard and sponsored spotlights
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_design_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  package_type ad_package_type NOT NULL,
  status ad_request_status NOT NULL DEFAULT 'pending',
  asset_brief_url TEXT NOT NULL,
  assigned_designer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  duration_days INT NOT NULL DEFAULT 7 CHECK (duration_days > 0 AND duration_days <= 90),
  estimated_cost NUMERIC(12, 2) NOT NULL CHECK (estimated_cost >= 0),
  designer_notes TEXT,
  completed_asset_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 2.7 TRANSACTIONS
-- Immutable financial ledger (Safaricom Daraja M-Pesa STK & Card settlements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'KES',
  payment_gateway payment_gateway_type NOT NULL,
  reference_code VARCHAR(100) NOT NULL UNIQUE, -- e.g. M-Pesa Receipt 'QKH782ABC'
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'completed',
  checkout_request_id VARCHAR(120), -- Daraja CheckoutRequestID
  payer_phone VARCHAR(50),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================================
-- 3. HIGH-PERFORMANCE INDEXES
-- ============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

-- Vendors
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_sub_status ON vendors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_vendors_tier ON vendors(virtual_shop_tier);

-- Virtual Shops
CREATE INDEX IF NOT EXISTS idx_virtual_shops_vendor_id ON virtual_shops(vendor_id);
CREATE INDEX IF NOT EXISTS idx_virtual_shops_district ON virtual_shops(district_code);
CREATE INDEX IF NOT EXISTS idx_virtual_shops_views ON virtual_shops(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_virtual_shops_plot ON virtual_shops(plot_number);

-- Listings
CREATE INDEX IF NOT EXISTS idx_listings_virtual_shop_id ON listings(virtual_shop_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active) WHERE is_active = true;
-- GIN Index for JSONB location queries (e.g., district, city, GPS polygon containment)
CREATE INDEX IF NOT EXISTS idx_listings_location_gin ON listings USING gin (location_metadata);
-- GiST Index for 365-day range availability overlap checks
CREATE INDEX IF NOT EXISTS idx_listings_dates_gist ON listings USING gist (dates_available);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_vendor_id ON subscriptions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_expires ON subscriptions(status, expires_at);

-- Ad Design Requests
CREATE INDEX IF NOT EXISTS idx_ad_requests_vendor_id ON ad_design_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ad_requests_status ON ad_design_requests(status);
CREATE INDEX IF NOT EXISTS idx_ad_requests_designer ON ad_design_requests(assigned_designer_id);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_vendor_id ON transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_code);
CREATE INDEX IF NOT EXISTS idx_transactions_gateway_type ON transactions(payment_gateway, type);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);

-- ============================================================================
-- 4. AUTOMATED AUDIT & TIMESTAMP TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_virtual_shops_updated_at
  BEFORE UPDATE ON virtual_shops
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_ad_requests_updated_at
  BEFORE UPDATE ON ad_design_requests
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Isolation: Vendors Manage ONLY Their Own Virtual Shops & Data
-- ============================================================================

-- Helper functions for role identification
CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS UUID AS $$
  -- Supabase Auth compatibility with fallback to current_setting for testing
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), '')::uuid,
    nullif(current_setting('app.current_user_id', true), '')::uuid
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth_user_id() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE;

-- Enable RLS across all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5.1 USERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (id = auth_user_id() OR is_admin());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth_user_id() OR is_admin());

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  USING (is_admin());

-- ----------------------------------------------------------------------------
-- 5.2 VENDORS POLICIES
-- ----------------------------------------------------------------------------
-- Public marketplace directory can view verified vendors
CREATE POLICY "Public can view active vendors"
  ON vendors FOR SELECT
  USING (is_verified = true OR user_id = auth_user_id() OR is_admin());

CREATE POLICY "Vendors can register profile"
  ON vendors FOR INSERT
  WITH CHECK (user_id = auth_user_id());

CREATE POLICY "Vendors can update own profile"
  ON vendors FOR UPDATE
  USING (user_id = auth_user_id() OR is_admin())
  WITH CHECK (user_id = auth_user_id() OR is_admin());

CREATE POLICY "Admins full vendor access"
  ON vendors FOR ALL
  USING (is_admin());

-- ----------------------------------------------------------------------------
-- 5.3 VIRTUAL SHOPS POLICIES
-- ----------------------------------------------------------------------------
-- Public visitors can view open shops in the virtual city
CREATE POLICY "Public can view virtual shops"
  ON virtual_shops FOR SELECT
  USING (is_open = true OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()) OR is_admin());

CREATE POLICY "Vendors can create shop"
  ON virtual_shops FOR INSERT
  WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()));

CREATE POLICY "Vendors can update own virtual shop"
  ON virtual_shops FOR UPDATE
  USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()) OR is_admin())
  WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()) OR is_admin());

CREATE POLICY "Admins full shop access"
  ON virtual_shops FOR ALL
  USING (is_admin());

-- ----------------------------------------------------------------------------
-- 5.4 LISTINGS POLICIES
-- ----------------------------------------------------------------------------
-- Public can browse active listings in city stalls
CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  USING (
    is_active = true 
    OR virtual_shop_id IN (
      SELECT vs.id FROM virtual_shops vs
      JOIN vendors v ON vs.vendor_id = v.id
      WHERE v.user_id = auth_user_id()
    ) 
    OR is_admin()
  );

CREATE POLICY "Vendors can insert listings in own shop"
  ON listings FOR INSERT
  WITH CHECK (
    virtual_shop_id IN (
      SELECT vs.id FROM virtual_shops vs
      JOIN vendors v ON vs.vendor_id = v.id
      WHERE v.user_id = auth_user_id()
    )
  );

CREATE POLICY "Vendors can update own listings"
  ON listings FOR UPDATE
  USING (
    virtual_shop_id IN (
      SELECT vs.id FROM virtual_shops vs
      JOIN vendors v ON vs.vendor_id = v.id
      WHERE v.user_id = auth_user_id()
    ) OR is_admin()
  );

CREATE POLICY "Vendors can delete own listings"
  ON listings FOR DELETE
  USING (
    virtual_shop_id IN (
      SELECT vs.id FROM virtual_shops vs
      JOIN vendors v ON vs.vendor_id = v.id
      WHERE v.user_id = auth_user_id()
    ) OR is_admin()
  );

-- ----------------------------------------------------------------------------
-- 5.5 SUBSCRIPTIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Vendors can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()) 
    OR is_admin()
  );

CREATE POLICY "Admins manage subscriptions"
  ON subscriptions FOR ALL
  USING (is_admin());

-- ----------------------------------------------------------------------------
-- 5.6 AD DESIGN REQUESTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Vendors can view own ad requests"
  ON ad_design_requests FOR SELECT
  USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id()) 
    OR assigned_designer_id = auth_user_id()
    OR is_admin()
  );

CREATE POLICY "Vendors can order ad campaigns"
  ON ad_design_requests FOR INSERT
  WITH CHECK (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id())
  );

CREATE POLICY "Designers and Admins can update ad requests"
  ON ad_design_requests FOR UPDATE
  USING (
    assigned_designer_id = auth_user_id() 
    OR is_admin()
    OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id())
  );

-- ----------------------------------------------------------------------------
-- 5.7 TRANSACTIONS POLICIES (Audit & Financial Ledger)
-- ----------------------------------------------------------------------------
CREATE POLICY "Vendors can view own transactions"
  ON transactions FOR SELECT
  USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth_user_id())
    OR is_admin()
  );

CREATE POLICY "Admins full transaction oversight"
  ON transactions FOR ALL
  USING (is_admin());
