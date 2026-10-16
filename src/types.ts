export type Language = 'en' | 'fr' | 'ar' | 'es' | 'de';

export interface MultilingualText {
  en: string;
  fr: string;
  ar: string;
  es?: string;
  de?: string;
}

export interface MultilingualList {
  en: string[];
  fr: string[];
  ar: string[];
  es?: string[];
  de?: string[];
}

export interface Apartment {
  id: string;
  slug: string;
  title: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  floor: number;
  areaM2: number;
  pricePerNight: number;
  pricePerMonth?: number;
  currency: string;
  furnished: boolean;
  seaView: boolean;
  balcony: boolean;
  amenities: string[];
  features: MultilingualList;
  images: string[];
  status: 'available' | 'reserved' | 'maintenance';
  featured: boolean;
  isDemo: boolean;
  demoNotice?: MultilingualText;
  createdAt: string;
}

export interface BookingInquiry {
  id: string;
  guestName: string;
  phone: string;
  countryCode: string;
  email?: string;
  apartmentId: string;
  apartmentTitle: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nightsCount: number;
  estimatedTotal: number;
  currency: string;
  message?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  contactPhone: string;
  contactEmail: string;
  address: MultilingualText;
  briechLocationDetails: MultilingualText;
  googleMapsEmbedUrl: string;
  googleMapsLink: string;
  checkInTime: string;
  checkOutTime: string;
  minNights: number;
  currency: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface AdminUser {
  username: string;
  role: 'owner' | 'manager';
}
