import pg from 'pg';
import { Apartment, BookingInquiry, SiteSettings } from '../../src/types';
import { defaultApartments, defaultSettings } from './seedData';
import { AdminSession, AdminUser, IDataStore } from './types';

const { Pool } = pg;

export class PostgresStore implements IDataStore {
  private pool: pg.Pool;

  constructor(connectionString: string) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    this.pool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false }
    });
  }

  getDriverName(): 'postgresql' {
    return 'postgresql';
  }

  async init(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Settings Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS gc_settings (
          id INT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // 2. Apartments Table
      await client.query(`
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
      `);

      // 3. Inquiries Table
      await client.query(`
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
      `);

      // 4. Admin Credentials Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS gc_admin (
          username TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // 5. Admin Sessions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS gc_sessions (
          token TEXT PRIMARY KEY,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_gc_sessions_expires ON gc_sessions(expires_at);
      `);

      // Check and seed initial settings if empty
      const settingsRes = await client.query('SELECT id FROM gc_settings WHERE id = 1');
      if (settingsRes.rowCount === 0) {
        await client.query(
          'INSERT INTO gc_settings (id, data, updated_at) VALUES ($1, $2, NOW())',
          [1, JSON.stringify(defaultSettings)]
        );
      }

      // Check and seed initial apartments if empty
      const aptsCountRes = await client.query('SELECT COUNT(*) as count FROM gc_apartments');
      const count = parseInt(aptsCountRes.rows[0].count, 10);
      if (count === 0) {
        for (const apt of defaultApartments) {
          await client.query(
            `INSERT INTO gc_apartments (id, slug, title, price_per_night, status, featured, data, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [
              apt.id,
              apt.slug,
              apt.title.en,
              apt.pricePerNight,
              apt.status,
              apt.featured || false,
              JSON.stringify(apt),
              apt.createdAt || new Date().toISOString()
            ]
          );
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getSettings(): Promise<SiteSettings> {
    const res = await this.pool.query('SELECT data FROM gc_settings WHERE id = 1');
    if (res.rows.length === 0) {
      return defaultSettings;
    }
    return res.rows[0].data as SiteSettings;
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    await this.pool.query(
      `INSERT INTO gc_settings (id, data, updated_at) VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()`,
      [JSON.stringify(updated)]
    );
    return updated;
  }

  async getApartments(): Promise<Apartment[]> {
    const res = await this.pool.query('SELECT data FROM gc_apartments ORDER BY created_at DESC');
    return res.rows.map(r => r.data as Apartment);
  }

  async getApartmentByIdOrSlug(idOrSlug: string): Promise<Apartment | null> {
    const res = await this.pool.query(
      'SELECT data FROM gc_apartments WHERE id = $1 OR slug = $1 LIMIT 1',
      [idOrSlug]
    );
    if (res.rows.length === 0) return null;
    return res.rows[0].data as Apartment;
  }

  async createApartment(apartment: Apartment): Promise<Apartment> {
    await this.pool.query(
      `INSERT INTO gc_apartments (id, slug, title, price_per_night, status, featured, data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        apartment.id,
        apartment.slug,
        apartment.title.en || 'Apartment',
        apartment.pricePerNight,
        apartment.status,
        apartment.featured || false,
        JSON.stringify(apartment),
        apartment.createdAt || new Date().toISOString()
      ]
    );
    return apartment;
  }

  async updateApartment(id: string, updates: Partial<Apartment>): Promise<Apartment | null> {
    const current = await this.getApartmentByIdOrSlug(id);
    if (!current) return null;
    const merged = { ...current, ...updates };

    await this.pool.query(
      `UPDATE gc_apartments
       SET slug = $2, title = $3, price_per_night = $4, status = $5, featured = $6, data = $7
       WHERE id = $1`,
      [
        id,
        merged.slug,
        merged.title.en || 'Apartment',
        merged.pricePerNight,
        merged.status,
        merged.featured || false,
        JSON.stringify(merged)
      ]
    );
    return merged;
  }

  async deleteApartment(id: string): Promise<boolean> {
    const res = await this.pool.query('DELETE FROM gc_apartments WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async getInquiries(): Promise<BookingInquiry[]> {
    const res = await this.pool.query('SELECT data FROM gc_inquiries ORDER BY created_at DESC');
    return res.rows.map(r => r.data as BookingInquiry);
  }

  async createInquiry(inquiry: BookingInquiry): Promise<BookingInquiry> {
    await this.pool.query(
      `INSERT INTO gc_inquiries (id, guest_name, phone, apartment_id, status, data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        inquiry.id,
        inquiry.guestName,
        inquiry.phone,
        inquiry.apartmentId,
        inquiry.status,
        JSON.stringify(inquiry),
        inquiry.createdAt || new Date().toISOString()
      ]
    );
    return inquiry;
  }

  async updateInquiryStatus(id: string, status: string): Promise<BookingInquiry | null> {
    const res = await this.pool.query('SELECT data FROM gc_inquiries WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    const item = res.rows[0].data as BookingInquiry;
    item.status = status as any;

    await this.pool.query(
      `UPDATE gc_inquiries SET status = $2, data = $3 WHERE id = $1`,
      [id, status, JSON.stringify(item)]
    );
    return item;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const res = await this.pool.query('DELETE FROM gc_inquiries WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async getAdminUser(): Promise<AdminUser | null> {
    const res = await this.pool.query('SELECT username, password_hash FROM gc_admin LIMIT 1');
    if (res.rows.length === 0) return null;
    return {
      username: res.rows[0].username,
      passwordHash: res.rows[0].password_hash
    };
  }

  async setAdminPassword(passwordHash: string): Promise<void> {
    const username = process.env.ADMIN_USERNAME || 'owner';
    await this.pool.query(
      `INSERT INTO gc_admin (username, password_hash, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (username) DO UPDATE SET password_hash = $2, updated_at = NOW()`,
      [username, passwordHash]
    );
  }

  async createSession(session: AdminSession): Promise<void> {
    await this.pool.query(
      `INSERT INTO gc_sessions (token, expires_at, created_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (token) DO UPDATE SET expires_at = $2`,
      [session.token, session.expiresAt, session.createdAt]
    );
    // Cleanup expired sessions asynchronously
    this.pool.query('DELETE FROM gc_sessions WHERE expires_at < NOW()').catch(() => {});
  }

  async validateSession(token: string): Promise<boolean> {
    const res = await this.pool.query(
      'SELECT token FROM gc_sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1',
      [token]
    );
    return res.rows.length > 0;
  }

  async deleteSession(token: string): Promise<void> {
    await this.pool.query('DELETE FROM gc_sessions WHERE token = $1', [token]);
  }
}
