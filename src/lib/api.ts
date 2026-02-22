import type { BookingPayload, InquiryPayload, Trip, TripsQuery } from '../types/trip';
import { FALLBACK_TRIPS } from '../data/tripCatalog';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function matchesQuery(trip: Trip, query: TripsQuery) {
  if (query.days && trip.durationDays !== query.days) return false;
  if (query.category && trip.category !== query.category) return false;
  if (typeof query.featured === 'boolean' && trip.featured !== query.featured) return false;
  if (query.search) {
    const value = query.search.toLowerCase();
    const hay = `${trip.name} ${trip.location}`.toLowerCase();
    if (!hay.includes(value)) return false;
  }
  return true;
}

function sortTrips(trips: Trip[], sort?: TripsQuery['sort']) {
  const list = [...trips];
  if (sort === 'priceLow') {
    list.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    return list;
  }
  if (sort === 'priceHigh') {
    list.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    return list;
  }
  if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }
  return list;
}

function queueOfflinePayload(key: string, payload: unknown) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(key);
  const items = raw ? (JSON.parse(raw) as unknown[]) : [];
  items.push({ payload, queuedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(items));
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const headers = new Headers(options?.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Server is unavailable right now. Please try again shortly.');
    }
    throw new Error('Unexpected network error');
  }
}

export async function getTrips(query: TripsQuery = {}) {
  try {
    const params = new URLSearchParams();
    if (query.days) params.append('days', String(query.days));
    if (query.category) params.append('category', query.category);
    if (typeof query.featured === 'boolean') params.append('featured', String(query.featured));
    if (query.search) params.append('search', query.search);
    if (query.sort) params.append('sort', query.sort);

    const queryString = params.toString();
    const path = `/trips${queryString ? `?${queryString}` : ''}`;
    const data = await request<{ trips: Trip[] }>(path);
    return data.trips;
  } catch {
    const filtered = FALLBACK_TRIPS.filter((trip) => matchesQuery(trip, query));
    return sortTrips(filtered, query.sort);
  }
}

export async function getTripDetails(slug: string) {
  try {
    const data = await request<{ trip: Trip }>(`/trips/${slug}`);
    return data.trip;
  } catch {
    const trip = FALLBACK_TRIPS.find((item) => item.slug === slug);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return trip;
  }
}

export async function submitInquiry(payload: InquiryPayload) {
  try {
    return await request<{ message: string; inquiryId: string }>('/trips/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    queueOfflinePayload('qarwaan_offline_inquiries', payload);
    return {
      message: 'Inquiry saved. Our team will follow up once server sync is restored.',
      inquiryId: `offline-${Date.now()}`,
    };
  }
}

export async function submitBooking(slug: string, payload: BookingPayload) {
  try {
    return await request<{ message: string; bookingId: string; totalAmount: number }>(
      `/trips/${slug}/bookings`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  } catch {
    const trip = FALLBACK_TRIPS.find((item) => item.slug === slug);
    const totalAmount = (trip?.discountedPrice || trip?.price || 0) * payload.travelers;
    queueOfflinePayload('qarwaan_offline_bookings', { slug, ...payload, totalAmount });
    return {
      message: 'Booking request saved locally. We will confirm once server sync is available.',
      bookingId: `offline-${Date.now()}`,
      totalAmount,
    };
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    return await request<{ message: string }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  } catch {
    queueOfflinePayload('qarwaan_offline_newsletter', { email });
    return { message: 'Subscription saved and will sync when server is available.' };
  }
}
