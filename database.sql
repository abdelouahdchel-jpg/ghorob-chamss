-- ========================================================================
-- إقامة غروب شمس | Ghorob Chams Residence - Briech, Asilah, Morocco
-- PostgreSQL Database Schema
-- Compatible with PostgreSQL 13, 14, 15, 16+
-- ========================================================================

-- 1. Site Settings Table (Stores WhatsApp contact, phone, address, check-in times)
CREATE TABLE IF NOT EXISTS gc_settings (
  id INT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Apartments Table (Apartment listings, multilingual descriptions, pricing, amenities)
CREATE TABLE IF NOT EXISTS gc_apartments (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  price_per_night NUMERIC,
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gc_apartments_slug ON gc_apartments(slug);
CREATE INDEX IF NOT EXISTS idx_gc_apartments_status ON gc_apartments(status);
CREATE INDEX IF NOT EXISTS idx_gc_apartments_created ON gc_apartments(created_at DESC);

-- 3. Booking Inquiries Table (Guest reservation inquiries, dates, WhatsApp contact, status)
CREATE TABLE IF NOT EXISTS gc_inquiries (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  apartment_id TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gc_inquiries_status ON gc_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_gc_inquiries_created ON gc_inquiries(created_at DESC);

-- 4. Administrator Credentials Table (Secure HMAC-SHA256 password hash)
CREATE TABLE IF NOT EXISTS gc_admin (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Administrator Active Sessions Table (Session tokens with expiration)
CREATE TABLE IF NOT EXISTS gc_sessions (
  token TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gc_sessions_expires ON gc_sessions(expires_at);

-- ========================================================================
-- Note: When the application starts with DATABASE_URL configured,
-- these tables and initial apartments/settings are created and seeded
-- automatically if not already present.
-- ========================================================================
