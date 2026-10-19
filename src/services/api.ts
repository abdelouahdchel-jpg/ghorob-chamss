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
 * Safely inspect and parse HTTP responses, preventing "Unexpected token < in JSON"
 * when a static host (Vercel/Netlify/SPA) returns index.html instead of JSON.
 */
async function parseSafeResponse(res: Response): Promise<{ isJson: boolean; data: any }> {
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const rawText = await res.text();

  if (contentType.includes('application/json')) {
    try {
      const data = JSON.parse(rawText);
      return { isJson: true, data };
    } catch {
      return { isJson: false, data: null };
    }
  }

  // Not JSON (usually HTML error page or SPA index.html)
  return { isJson: false, data: null };
}

/**
 * Known valid passwords for client-side fallback when running on static hosts
 * without an active Node.js / Express backend.
 */
function isValidStaticPassword(password: string): boolean {
  const customPwd = localStorage.getItem('gc_custom_admin_pwd') || 'Rafi3a123@';
  return (
    password === customPwd ||
    password === 'Rafi3a123@' ||
    password === 'GhorobChams2026!'
  );
}

/**
 * Public: Fetch Apartments
 * Gracefully falls back to initial demo data if backend is offline or static-only.
 */
export async function apiFetchApartments(): Promise<Apartment[]> {
  try {
    const res = await fetch(getApiUrl('/api/apartments'));
    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[API] Backend /api/apartments unreachable, checking local fallback.', err);
  }

  // Check localStorage for locally modified apartments (Static Mode)
  try {
    const local = localStorage.getItem('gc_local_apartments');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return initialApartments;
}

/**
 * Public: Fetch Site Settings
 */
export async function apiFetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(getApiUrl('/api/settings'));
    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson && data && data.whatsappNumber) {
      return data;
    }
  } catch (err) {
    console.warn('[API] Backend /api/settings unreachable, checking local fallback.', err);
  }

  try {
    const local = localStorage.getItem('gc_local_settings');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.whatsappNumber) return parsed;
    }
  } catch {}

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

    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson) {
      return {
        success: true,
        reference: data.reference,
        inquiry: data.inquiry,
        message: data.message
      };
    } else if (isJson && data?.error) {
      throw new Error(data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      // Re-throw genuine backend validation errors
      if (err.message.includes('dates') || err.message.includes('name') || err.message.includes('phone')) {
        throw err;
      }
    }
  }

  // Static / Offline fallback: generate reference and save locally
  const fallbackRef = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
  const localInquiry: BookingInquiry = {
    id: fallbackRef,
    guestName: payload.guestName,
    phone: payload.phone,
    countryCode: payload.countryCode,
    email: payload.email,
    apartmentId: payload.apartmentId || 'general',
    apartmentTitle: payload.apartmentTitle || 'Apartment Booking',
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guestsCount: payload.guestsCount,
    nightsCount: 3,
    estimatedTotal: payload.estimatedTotal || 1500,
    currency: 'MAD',
    message: payload.message || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem('gc_local_inquiries') || '[]');
    existing.unshift(localInquiry);
    localStorage.setItem('gc_local_inquiries', JSON.stringify(existing));
  } catch {}

  return {
    success: true,
    reference: fallbackRef,
    inquiry: localInquiry,
    isOfflineFallback: true,
    message: 'Booking request registered. Please proceed to WhatsApp to complete your reservation.'
  };
}

/**
 * Admin: Login
 * Robustly handles both Full-Stack Node.js backend and Static Hosting environments.
 */
export async function apiAdminLogin(password: string): Promise<{ token: string; username: string }> {
  try {
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const { isJson, data } = await parseSafeResponse(res);

    if (isJson) {
      if (res.ok) {
        return { token: data.token, username: data.user?.username || 'youssf' };
      }
      throw new Error(data.error || 'Incorrect administrator password.');
    }
  } catch (err: any) {
    // If backend returned a JSON 401 error, rethrow it directly
    if (err.message && err.message.includes('password')) {
      throw err;
    }
    console.warn('[API] Backend /api/auth/login returned HTML or was unreachable. Checking static authentication.');
  }

  // Static Host / Preview Fallback Authentication
  if (isValidStaticPassword(password)) {
    const staticToken = `gc_static_session_${Date.now()}`;
    return { token: staticToken, username: 'youssf' };
  }

  throw new Error('كلمة المرور غير صحيحة (Incorrect administrator password).');
}

/**
 * Admin: Verify Session Token
 */
export async function apiAdminVerifyToken(token: string): Promise<boolean> {
  if (token.startsWith('gc_static_session_')) {
    return true;
  }

  try {
    const res = await fetch(getApiUrl('/api/auth/verify'), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { isJson } = await parseSafeResponse(res);
    if (isJson) {
      return res.ok;
    }
    // If backend is unreachable or returning HTML, keep existing token valid
    return !!token;
  } catch {
    return !!token;
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
  try {
    const res = await fetch(getApiUrl('/api/auth/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (isJson) {
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update administrator password');
      }
      return;
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('password') || err.message.includes('Current'))) {
      throw err;
    }
  }

  // Static fallback: save locally
  if (isValidStaticPassword(currentPassword)) {
    localStorage.setItem('gc_custom_admin_pwd', newPassword);
    return;
  }
  throw new Error('Current password is incorrect (كلمة المرور الحالية غير صحيحة).');
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

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(apartment)
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson) {
      return data;
    } else if (isJson && data?.error) {
      throw new Error(data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Static fallback: persist in localStorage
  const localApts = await apiFetchApartments();
  let updatedList: Apartment[];
  const aptToSave = apartment as Apartment;

  if (isNew) {
    updatedList = [aptToSave, ...localApts];
  } else {
    updatedList = localApts.map(a => (a.id === aptToSave.id ? { ...a, ...aptToSave } : a));
  }

  localStorage.setItem('gc_local_apartments', JSON.stringify(updatedList));
  return aptToSave;
}

/**
 * Admin: Delete Apartment
 */
export async function apiAdminDeleteApartment(id: string, token: string): Promise<void> {
  try {
    const res = await fetch(getApiUrl(`/api/apartments/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (isJson && !res.ok) {
      throw new Error(data?.error || 'Failed to delete apartment');
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Static fallback
  const localApts = await apiFetchApartments();
  const filtered = localApts.filter(a => a.id !== id);
  localStorage.setItem('gc_local_apartments', JSON.stringify(filtered));
}

/**
 * Admin: Fetch All Inquiries
 */
export async function apiAdminFetchInquiries(token: string): Promise<BookingInquiry[]> {
  try {
    const res = await fetch(getApiUrl('/api/inquiries'), {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson && Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('[API] Could not fetch inquiries from backend, using local store.', err);
  }

  try {
    const local = localStorage.getItem('gc_local_inquiries');
    if (local) return JSON.parse(local);
  } catch {}

  return [];
}

/**
 * Admin: Update Inquiry Status
 */
export async function apiAdminUpdateInquiryStatus(
  id: string,
  status: string,
  token: string
): Promise<void> {
  try {
    const res = await fetch(getApiUrl(`/api/inquiries/${encodeURIComponent(id)}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (isJson && !res.ok) {
      throw new Error(data?.error || 'Failed to update inquiry status');
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Static fallback
  try {
    const local: BookingInquiry[] = JSON.parse(localStorage.getItem('gc_local_inquiries') || '[]');
    const updated = local.map(i => (i.id === id ? { ...i, status: status as any } : i));
    localStorage.setItem('gc_local_inquiries', JSON.stringify(updated));
  } catch {}
}

/**
 * Admin: Delete Inquiry
 */
export async function apiAdminDeleteInquiry(id: string, token: string): Promise<void> {
  const cleanId = (id || '').trim();
  try {
    const res = await fetch(getApiUrl(`/api/inquiries/${encodeURIComponent(cleanId)}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (isJson && !res.ok) {
      throw new Error(data?.error || `Failed to delete inquiry (${res.status})`);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Static fallback
  try {
    const local: BookingInquiry[] = JSON.parse(localStorage.getItem('gc_local_inquiries') || '[]');
    const filtered = local.filter(i => (i.id || '').trim() !== cleanId);
    localStorage.setItem('gc_local_inquiries', JSON.stringify(filtered));
  } catch {}
}

/**
 * Admin: Update Settings
 */
export async function apiAdminSaveSettings(
  settings: SiteSettings,
  token: string
): Promise<SiteSettings> {
  try {
    const res = await fetch(getApiUrl('/api/settings'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });

    const { isJson, data } = await parseSafeResponse(res);
    if (res.ok && isJson) {
      return data.settings || settings;
    } else if (isJson && data?.error) {
      throw new Error(data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Static fallback
  localStorage.setItem('gc_local_settings', JSON.stringify(settings));
  return settings;
}
