import { Apartment, BookingInquiry, SiteSettings } from '../types';
import { initialApartments, initialSettings } from '../data/initialData';

/**
 * Portable API Configuration
 * Supports both full-stack unified hosting (relative URL)
 * and decoupled frontend hosting (pointing to external backend via VITE_API_BASE_URL).
 */
const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export interface BookingSubmissionPayload {
  guestName: string;
  phone: string;
  countryCode: string;
  email?: string;
  apartmentId?: string;
  apartmentTitle?: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  message?: string;
  estimatedTotal?: number;
}

export interface BookingSubmissionResponse {
  success: boolean;
  reference: string;
  inquiry?: BookingInquiry;
  isOfflineFallback?: boolean;
  message?: string;
}

/**
 * Public: Fetch Apartments
 * Gracefully falls back to initial demo data if backend is offline or static-only.
 */
export async function apiFetchApartments(): Promise<Apartment[]> {
  try {
    const res = await fetch(getApiUrl('/api/apartments'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[API] Could not reach backend /api/apartments, using local data fallback.', err);
  }
  return initialApartments;
}

/**
 * Public: Fetch Site Settings
 */
export async function apiFetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(getApiUrl('/api/settings'));
    if (res.ok) {
      const data = await res.json();
      if (data && data.whatsappNumber) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[API] Could not reach backend /api/settings, using local data fallback.', err);
  }
  return initialSettings;
}

/**
 * Public: Submit Booking Inquiry
 * If backend is reachable, persists in DB and returns real reference.
 * If backend is unreachable (e.g. pure static GitHub Pages/Netlify deployment),
 * generates a valid reference so the guest can immediately proceed to WhatsApp reservation.
 */
export async function apiSubmitInquiry(
  payload: BookingSubmissionPayload
): Promise<BookingSubmissionResponse> {
  try {
    const res = await fetch(getApiUrl('/api/inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      return {
        success: true,
        reference: data.reference,
        inquiry: data.inquiry,
        message: data.message
      };
    } else {
      throw new Error(data.error || 'Server rejected booking inquiry');
    }
  } catch (err: any) {
    // If backend is down or on a static-only host, provide a fallback reference so reservation continues via WhatsApp
    const isNetworkError =
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed');

    if (isNetworkError) {
      const fallbackRef = `GC-WA-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        success: true,
        reference: fallbackRef,
        isOfflineFallback: true,
        message: 'Static mode: Reference generated. Please proceed via WhatsApp.'
      };
    }

    throw err;
  }
}

/**
 * Admin: Login
 */
export async function apiAdminLogin(password: string): Promise<{ token: string; username: string }> {
  const res = await fetch(getApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return { token: data.token, username: data.user?.username || 'owner' };
}

/**
 * Admin: Verify Session Token
 */
export async function apiAdminVerifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl('/api/auth/verify'), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Admin: Change Password
 */
export async function apiAdminChangePassword(
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<void> {
  const res = await fetch(getApiUrl('/api/auth/change-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Password update failed');
  }
}

/**
 * Admin: Save Apartment (Create or Update)
 */
export async function apiAdminSaveApartment(
  apartment: Partial<Apartment>,
  token: string,
  isNew: boolean
): Promise<Apartment> {
  const url = isNew
    ? getApiUrl('/api/apartments')
    : getApiUrl(`/api/apartments/${apartment.id}`);
  const method = isNew ? 'POST' : 'PUT';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(apartment)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save apartment');
  }

  return data;
}

/**
 * Admin: Delete Apartment
 */
export async function apiAdminDeleteApartment(id: string, token: string): Promise<void> {
  const res = await fetch(getApiUrl(`/api/apartments/${id}`), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete apartment');
  }
}

/**
 * Admin: Fetch All Inquiries
 */
export async function apiAdminFetchInquiries(token: string): Promise<BookingInquiry[]> {
  const res = await fetch(getApiUrl('/api/inquiries'), {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to load inquiries');
  }

  return res.json();
}

/**
 * Admin: Update Inquiry Status
 */
export async function apiAdminUpdateInquiryStatus(
  id: string,
  status: string,
  token: string
): Promise<void> {
  const res = await fetch(getApiUrl(`/api/inquiries/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error('Failed to update inquiry status');
  }
}

/**
 * Admin: Delete Inquiry
 */
export async function apiAdminDeleteInquiry(id: string, token: string): Promise<void> {
  const cleanId = (id || '').trim();
  const res = await fetch(getApiUrl(`/api/inquiries/${encodeURIComponent(cleanId)}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete inquiry (Status ${res.status})`);
  }
}

/**
 * Admin: Update Settings
 */
export async function apiAdminSaveSettings(
  settings: SiteSettings,
  token: string
): Promise<SiteSettings> {
  const res = await fetch(getApiUrl('/api/settings'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save settings');
  }

  return data.settings || settings;
}
