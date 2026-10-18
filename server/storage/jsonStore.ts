import fs from 'fs';
import path from 'path';
import { Apartment, BookingInquiry, SiteSettings } from '../../src/types';
import { defaultApartments, defaultSettings } from './seedData';
import { AdminSession, AdminUser, IDataStore } from './types';

interface JsonDbSchema {
  admin: {
    username: string;
    passwordHash: string;
    sessions: AdminSession[];
  };
  settings: SiteSettings;
  apartments: Apartment[];
  inquiries: BookingInquiry[];
}

export class JsonFileStore implements IDataStore {
  private filePath: string;
  private dirPath: string;
  private data: JsonDbSchema | null = null;

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(process.cwd(), 'data', 'database.json');
    this.dirPath = path.dirname(this.filePath);
  }

  getDriverName(): 'json_file' {
    return 'json_file';
  }

  async init(): Promise<void> {
    if (!fs.existsSync(this.dirPath)) {
      fs.mkdirSync(this.dirPath, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('[JsonStore] Failed to parse existing database.json, reinitializing from seed:', err);
      }
    }

    if (!this.data) {
      this.data = {
        admin: {
          username: process.env.ADMIN_USERNAME || 'owner',
          passwordHash: '',
          sessions: []
        },
        settings: defaultSettings,
        apartments: defaultApartments,
        inquiries: []
      };
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    if (!this.data) return;
    const tempFile = `${this.filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, this.filePath);
  }

  private ensureLoaded(): JsonDbSchema {
    if (!this.data) {
      throw new Error('[JsonStore] Database has not been initialized. Call init() first.');
    }
    return this.data;
  }

  async getSettings(): Promise<SiteSettings> {
    const data = this.ensureLoaded();
    return { ...data.settings };
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const data = this.ensureLoaded();
    data.settings = { ...data.settings, ...settings };
    await this.persist();
    return { ...data.settings };
  }

  async getApartments(): Promise<Apartment[]> {
    const data = this.ensureLoaded();
    return [...data.apartments];
  }

  async getApartmentByIdOrSlug(idOrSlug: string): Promise<Apartment | null> {
    const data = this.ensureLoaded();
    const apt = data.apartments.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    return apt ? { ...apt } : null;
  }

  async createApartment(apartment: Apartment): Promise<Apartment> {
    const data = this.ensureLoaded();
    const exists = data.apartments.some(a => a.id === apartment.id);
    if (exists) {
      throw new Error(`Apartment with id "${apartment.id}" already exists.`);
    }
    data.apartments.push(apartment);
    await this.persist();
    return { ...apartment };
  }

  async updateApartment(id: string, updates: Partial<Apartment>): Promise<Apartment | null> {
    const data = this.ensureLoaded();
    const idx = data.apartments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    data.apartments[idx] = { ...data.apartments[idx], ...updates };
    await this.persist();
    return { ...data.apartments[idx] };
  }

  async deleteApartment(id: string): Promise<boolean> {
    const data = this.ensureLoaded();
    const idx = data.apartments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    data.apartments.splice(idx, 1);
    await this.persist();
    return true;
  }

  async getInquiries(): Promise<BookingInquiry[]> {
    const data = this.ensureLoaded();
    return [...data.inquiries];
  }

  async createInquiry(inquiry: BookingInquiry): Promise<BookingInquiry> {
    const data = this.ensureLoaded();
    data.inquiries.unshift(inquiry);
    await this.persist();
    return { ...inquiry };
  }

  async updateInquiryStatus(id: string, status: string): Promise<BookingInquiry | null> {
    const data = this.ensureLoaded();
    const inq = data.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status as any;
    await this.persist();
    return { ...inq };
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const data = this.ensureLoaded();
    const cleanId = (id || '').trim();
    const idx = data.inquiries.findIndex(i => (i.id || '').trim() === cleanId);
    if (idx === -1) return false;
    data.inquiries.splice(idx, 1);
    await this.persist();
    return true;
  }

  async getAdminUser(): Promise<AdminUser | null> {
    const data = this.ensureLoaded();
    return {
      username: data.admin.username,
      passwordHash: data.admin.passwordHash
    };
  }

  async setAdminPassword(passwordHash: string): Promise<void> {
    const data = this.ensureLoaded();
    data.admin.passwordHash = passwordHash;
    if (process.env.ADMIN_USERNAME?.trim()) {
      data.admin.username = process.env.ADMIN_USERNAME.trim();
    }
    await this.persist();
  }

  async createSession(session: AdminSession): Promise<void> {
    const data = this.ensureLoaded();
    // Purge expired sessions
    const now = Date.now();
    data.admin.sessions = data.admin.sessions.filter(
      s => new Date(s.expiresAt).getTime() > now
    );
    data.admin.sessions.push(session);
    await this.persist();
  }

  async validateSession(token: string): Promise<boolean> {
    const data = this.ensureLoaded();
    const now = Date.now();
    const session = data.admin.sessions.find(
      s => s.token === token && new Date(s.expiresAt).getTime() > now
    );
    return !!session;
  }

  async deleteSession(token: string): Promise<void> {
    const data = this.ensureLoaded();
    data.admin.sessions = data.admin.sessions.filter(s => s.token !== token);
    await this.persist();
  }
}
