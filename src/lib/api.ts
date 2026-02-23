import type { BookingPayload, InquiryPayload, Trip, TripsQuery } from '../types/trip';
import type {
  AdminAnalyticsOverview,
  AdminDashboardPayload,
  AdminMarketingAnalytics,
  AdminReferralOverview,
  AdminUserRecord,
  AuditLogRecord,
  BookingRecord,
  CouponRecord,
  InquiryRecord,
  MediaAssetRecord,
  PaymentInvoiceRecord,
  PaymentRecord,
  RefundRecord,
} from '../types/admin';
import type { TripReview } from '../types/review';
import type { AuthResponse, UserBookingsResponse, UserProfile, UserReferralResponse } from '../types/user';
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
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
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
    if (error instanceof TypeError) {
      throw new Error('Server is unavailable right now. Ensure backend is running and reachable, then try again.');
    }
    throw error instanceof Error ? error : new Error('Unexpected network error');
  }
}

function getAdminToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('qarwaan_admin_token') || '';
}

function getUserToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('qarwaan_user_token') || '';
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  return request<T>(path, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

async function userRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getUserToken();
  return request<T>(path, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
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

export async function adminLogin(username: string, password: string) {
  const data = await request<{
    token: string;
    admin: {
      id: string;
      username: string;
      role: 'super_admin' | 'manager' | 'crm_agent';
      permissions: string[];
    };
  }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('qarwaan_admin_token', data.token);
    localStorage.setItem('qarwaan_admin_user', data.admin.username);
    localStorage.setItem('qarwaan_admin_role', data.admin.role);
    localStorage.setItem('qarwaan_admin_permissions', JSON.stringify(data.admin.permissions || []));
  }

  return data;
}

export function adminLogout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('qarwaan_admin_token');
  localStorage.removeItem('qarwaan_admin_user');
  localStorage.removeItem('qarwaan_admin_role');
  localStorage.removeItem('qarwaan_admin_permissions');
}

export async function getAdminOverview() {
  const data = await adminRequest<{ overview: AdminDashboardPayload['overview'] }>('/admin/overview');
  return data.overview;
}

export async function getAdminAnalyticsOverview() {
  const data = await adminRequest<{ analytics: AdminAnalyticsOverview }>('/admin/analytics/overview');
  return data.analytics;
}

export async function getAdminTrips() {
  const data = await adminRequest<{ trips: Trip[] }>('/admin/trips');
  return data.trips;
}

export async function getAdminMediaAssets() {
  const data = await adminRequest<{ media: MediaAssetRecord[] }>('/media/admin');
  return data.media;
}

export async function createAdminMediaAsset(payload: {
  title: string;
  url: string;
  type?: MediaAssetRecord['type'];
  altText?: string;
  tags?: string;
  active?: boolean;
  cdnUrl?: string;
  cacheControl?: string;
}) {
  const data = await adminRequest<{ asset: MediaAssetRecord }>('/media/admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.asset;
}

export async function uploadAdminMediaAsset(payload: {
  file: File;
  title?: string;
  type?: MediaAssetRecord['type'];
  altText?: string;
  tags?: string;
  active?: boolean;
  cdnUrl?: string;
  cacheControl?: string;
}) {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append('file', payload.file);
  if (payload.title) formData.append('title', payload.title);
  if (payload.type) formData.append('type', payload.type);
  if (payload.altText) formData.append('altText', payload.altText);
  if (payload.tags) formData.append('tags', payload.tags);
  if (typeof payload.active === 'boolean') formData.append('active', String(payload.active));
  if (payload.cdnUrl) formData.append('cdnUrl', payload.cdnUrl);
  if (payload.cacheControl) formData.append('cacheControl', payload.cacheControl);

  const response = await fetch(`${API_BASE_URL}/media/admin/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(data.message || 'Media upload failed');
  }

  return data as { asset: MediaAssetRecord };
}

export async function updateAdminMediaAsset(id: string, payload: Partial<{
  title: string;
  url: string;
  type: MediaAssetRecord['type'];
  altText: string;
  tags: string;
  active: boolean;
  cdnUrl: string;
  cacheControl: string;
}>) {
  const data = await adminRequest<{ asset: MediaAssetRecord }>(`/media/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.asset;
}

export async function createAdminTrip(payload: Partial<Trip>) {
  const data = await adminRequest<{ trip: Trip }>('/admin/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.trip;
}

export async function updateAdminTrip(id: string, payload: Partial<Trip>) {
  const data = await adminRequest<{ trip: Trip }>(`/admin/trips/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.trip;
}

export async function deleteAdminTrip(id: string) {
  return adminRequest<{ message: string }>(`/admin/trips/${id}`, { method: 'DELETE' });
}

export async function getAdminInquiries() {
  const data = await adminRequest<{ inquiries: InquiryRecord[] }>('/admin/inquiries');
  return data.inquiries;
}

export async function updateAdminInquiry(
  id: string,
  payload: Partial<Omit<InquiryRecord, 'followUpAt'> & { followUpAt?: string | null }>
) {
  const data = await adminRequest<{ inquiry: InquiryRecord }>(`/admin/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.inquiry;
}

export async function getAdminBookings() {
  const data = await adminRequest<{ bookings: BookingRecord[] }>('/admin/bookings');
  return data.bookings;
}

export async function updateAdminBooking(
  id: string,
  payload: Partial<Omit<BookingRecord, 'followUpAt'> & { followUpAt?: string | null }>
) {
  const data = await adminRequest<{ booking: BookingRecord }>(`/admin/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.booking;
}

export async function getAdminPayments() {
  const data = await adminRequest<{ payments: PaymentRecord[] }>('/admin/payments');
  return data.payments;
}

export async function getAdminPaymentInvoice(id: string) {
  const data = await adminRequest<{ invoice: PaymentInvoiceRecord }>(`/admin/payments/${id}/invoice`);
  return data.invoice;
}

export async function refundAdminPayment(id: string, payload: { amount?: number; reason?: string }) {
  return adminRequest<{ message: string; payment: PaymentRecord }>(`/admin/payments/${id}/refund`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getAdminCrmReminders() {
  return adminRequest<{ reminders: { inquiries: InquiryRecord[]; bookings: BookingRecord[] } }>(
    '/admin/crm/reminders'
  );
}

export async function triggerAdminCrmNotifyDue() {
  return adminRequest<{ message: string; result: { queued: number; totalEntities: number } }>(
    '/admin/crm/notify-due',
    {
    method: 'POST',
    }
  );
}

export async function retryAdminFailedWebhooks(limit = 100) {
  return adminRequest<{ message: string; retried: number }>('/admin/crm/retry-failed-webhooks', {
    method: 'POST',
    body: JSON.stringify({ limit }),
  });
}

export async function getAdminUsers() {
  const data = await adminRequest<{
    users: Array<{
      _id: string;
      username: string;
      role: AdminUserRecord['role'];
      active: boolean;
      permissions?: string[];
    }>;
  }>('/admin/users');
  return data.users.map((item) => ({
    id: item._id,
    username: item.username,
    role: item.role,
    active: item.active,
    permissions: item.permissions || [],
  }));
}

export async function createAdminUser(payload: {
  username: string;
  password: string;
  role: AdminUserRecord['role'];
  active?: boolean;
  permissions?: string[];
}) {
  return adminRequest<{ user: AdminUserRecord }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminUser(
  id: string,
  payload: Partial<{ role: AdminUserRecord['role']; active: boolean; password: string; permissions: string[] }>
) {
  return adminRequest<{ user: AdminUserRecord }>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getAdminAuditLogs() {
  const data = await adminRequest<{ logs: AuditLogRecord[] }>('/admin/audit-logs');
  return data.logs;
}

export async function getAdminRefunds() {
  const data = await adminRequest<{ refunds: RefundRecord[] }>('/admin/refunds');
  return data.refunds;
}

export async function getAdminCrmTimeline(entityType: 'inquiry' | 'booking', id: string) {
  const data = await adminRequest<{ logs: AuditLogRecord[] }>(`/admin/crm/${entityType}/${id}/timeline`);
  return data.logs;
}

export async function downloadAdminPaymentInvoicePdf(id: string) {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}/admin/payments/${id}/invoice.pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = 'Failed to download invoice PDF';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // ignore body parsing
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `invoice-${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function getPaymentInvoice(id: string) {
  const data = await request<{ invoice: PaymentInvoiceRecord }>(`/payments/${id}/invoice`);
  return data.invoice;
}

export async function downloadPaymentInvoicePdf(id: string) {
  const response = await fetch(`${API_BASE_URL}/payments/${id}/invoice.pdf`);

  if (!response.ok) {
    let message = 'Failed to download invoice PDF';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // ignore body parsing
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `invoice-${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function createPaymentOrder(payload: {
  bookingId?: string;
  tripSlug?: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  amount: number;
  currency?: string;
  gateway?: 'auto' | 'stripe' | 'razorpay' | 'mock';
}) {
  return request<{
    paymentId: string;
    gateway: 'stripe' | 'razorpay' | 'mock';
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    checkoutUrl?: string;
    publishableKey?: string;
    message?: string;
  }>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyPayment(payload: {
  paymentId: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  stripe_session_id?: string;
  status?: 'paid' | 'failed';
}) {
  return request<{ message: string }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  referralCode?: string;
}) {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('qarwaan_user_token', data.token);
    localStorage.setItem('qarwaan_user', JSON.stringify(data.user));
  }
  return data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('qarwaan_user_token', data.token);
    localStorage.setItem('qarwaan_user', JSON.stringify(data.user));
  }
  return data;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('qarwaan_user_token');
  localStorage.removeItem('qarwaan_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('qarwaan_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function getMyProfile() {
  const data = await userRequest<{ user: UserProfile }>('/users/me');
  if (typeof window !== 'undefined') {
    localStorage.setItem('qarwaan_user', JSON.stringify(data.user));
  }
  return data.user;
}

export async function updateMyProfile(payload: {
  name?: string;
  preferredCurrency?: string;
  preferredLanguage?: string;
}) {
  const data = await userRequest<{ user: UserProfile }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('qarwaan_user', JSON.stringify(data.user));
  }
  return data.user;
}

export async function getMyBookings() {
  const data = await userRequest<UserBookingsResponse>('/users/me/bookings');
  return data.bookings;
}

export async function getMyReferrals() {
  return userRequest<UserReferralResponse>('/users/me/referrals');
}

export async function getMySavedTrips() {
  const data = await userRequest<{ savedTrips: Trip[] }>('/users/me/saved-trips');
  return data.savedTrips;
}

export async function saveTrip(tripId: string) {
  return userRequest<{ message: string }>(`/users/me/saved-trips/${tripId}`, { method: 'POST' });
}

export async function removeSavedTrip(tripId: string) {
  return userRequest<{ message: string }>(`/users/me/saved-trips/${tripId}`, { method: 'DELETE' });
}

export async function validateCoupon(code: string, orderAmount: number) {
  return request<{
    valid: boolean;
    coupon: { code: string; description?: string; discountType: 'flat' | 'percent'; discountValue: number };
    discount: number;
    finalAmount: number;
  }>('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderAmount }),
  });
}

export async function getAdminCoupons() {
  const data = await adminRequest<{ coupons: CouponRecord[] }>('/coupons/admin');
  return data.coupons;
}

export async function createAdminCoupon(payload: Partial<CouponRecord>) {
  const data = await adminRequest<{ coupon: CouponRecord }>('/coupons/admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.coupon;
}

export async function updateAdminCoupon(id: string, payload: Partial<CouponRecord>) {
  const data = await adminRequest<{ coupon: CouponRecord }>(`/coupons/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.coupon;
}

export async function getAdminReferralOverview() {
  const data = await adminRequest<{ referral: AdminReferralOverview }>('/admin/referrals/overview');
  return data.referral;
}

export async function getAdminMarketingAnalytics() {
  const data = await adminRequest<{ marketing: AdminMarketingAnalytics }>('/admin/marketing/analytics');
  return data.marketing;
}

export async function getFxRates(base = 'INR') {
  return request<{
    base: string;
    rates: Record<string, number>;
    fetchedAt: string;
    source: 'cache' | 'provider';
  }>(`/fx/rates?base=${encodeURIComponent(base)}`);
}

export async function getTripReviews(slug: string) {
  const data = await request<{ reviews: TripReview[] }>(`/reviews/trip/${slug}`);
  return data.reviews;
}

export async function submitTripReview(
  slug: string,
  payload: { rating: number; title?: string; comment: string }
) {
  return userRequest<{ message: string; reviewId: string }>(`/reviews/trip/${slug}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
