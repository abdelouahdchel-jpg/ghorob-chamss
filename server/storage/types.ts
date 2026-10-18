import { Apartment, BookingInquiry, SiteSettings } from '../../src/types';

export interface AdminUser {
  username: string;
  passwordHash: string;
}

export interface AdminSession {
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface IDataStore {
  /**
   * Initializes the storage provider (e.g. create tables, seed data if empty, create directories)
   */
  init(): Promise<void>;

  /**
   * Returns a description of the active storage driver ('postgresql' | 'json_file')
   */
  getDriverName(): 'postgresql' | 'json_file';

  /**
   * Site Settings
   */
  getSettings(): Promise<SiteSettings>;
  updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;

  /**
   * Apartments
   */
  getApartments(): Promise<Apartment[]>;
  getApartmentByIdOrSlug(idOrSlug: string): Promise<Apartment | null>;
  createApartment(apartment: Apartment): Promise<Apartment>;
  updateApartment(id: string, updates: Partial<Apartment>): Promise<Apartment | null>;
  deleteApartment(id: string): Promise<boolean>;

  /**
   * Inquiries
   */
  getInquiries(): Promise<BookingInquiry[]>;
  createInquiry(inquiry: BookingInquiry): Promise<BookingInquiry>;
  updateInquiryStatus(id: string, status: string): Promise<BookingInquiry | null>;
  deleteInquiry(id: string): Promise<boolean>;

  /**
   * Admin Authentication & Sessions
   */
  getAdminUser(): Promise<AdminUser | null>;
  setAdminPassword(passwordHash: string): Promise<void>;
  createSession(session: AdminSession): Promise<void>;
  validateSession(token: string): Promise<boolean>;
  deleteSession(token: string): Promise<void>;
}
