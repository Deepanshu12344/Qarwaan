import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminLogout,
  createAdminTrip,
  createAdminMediaAsset,
  createAdminUser,
  createAdminCoupon,
  downloadAdminPaymentInvoicePdf,
  deleteAdminTrip,
  getAdminAuditLogs,
  getAdminBookings,
  getAdminCoupons,
  getAdminAnalyticsOverview,
  getAdminCrmReminders,
  getAdminCrmTimeline,
  getAdminInquiries,
  getAdminMediaAssets,
  getAdminMarketingAnalytics,
  getAdminOverview,
  getAdminPaymentInvoice,
  getAdminPayments,
  getAdminRefunds,
  getAdminReferralOverview,
  getAdminTrips,
  getAdminUsers,
  refundAdminPayment,
  retryAdminFailedWebhooks,
  triggerAdminCrmNotifyDue,
  updateAdminTrip,
  updateAdminCoupon,
  updateAdminMediaAsset,
  updateAdminBooking,
  updateAdminInquiry,
  updateAdminUser,
  uploadAdminMediaAsset,
} from '../../lib/api';
import type {
  AdminUserRecord,
  AdminAnalyticsOverview,
  AuditLogRecord,
  BookingRecord,
  CouponRecord,
  InquiryRecord,
  MediaAssetRecord,
  PaymentInvoiceRecord,
  PaymentRecord,
  RefundRecord,
  AdminReferralOverview,
  AdminMarketingAnalytics,
} from '../../types/admin';
import type { Trip } from '../../types/trip';

type Tab = 'overview' | 'crm' | 'trips' | 'marketing' | 'payments' | 'users' | 'audit';
type TripCategory = 'Domestic' | 'International';
type InquiryDraft = {
  status: InquiryRecord['status'];
  crmStage: InquiryRecord['crmStage'];
  assignedAgent: string;
  followUpAt: string;
  followUpNote: string;
};
type BookingDraft = {
  bookingStatus: BookingRecord['bookingStatus'];
  crmStage: BookingRecord['crmStage'];
  assignedAgent: string;
  followUpAt: string;
  followUpNote: string;
};
type DueFilter = 'all' | 'due_today' | 'overdue';
type SortFilter = 'created_desc' | 'created_asc' | 'followup_asc' | 'followup_desc';

const tabs: Tab[] = ['overview', 'crm', 'trips', 'marketing', 'payments', 'users', 'audit'];

const permissionOptions = [
  'view_overview',
  'manage_trips',
  'manage_crm',
  'view_payments',
  'issue_refunds',
  'trigger_crm_notifications',
  'view_audit_logs',
  'manage_admin_users',
];

const inquiryStageOptions: InquiryRecord['crmStage'][] = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
  'closed',
];

const bookingStageOptions: BookingRecord['crmStage'][] = [
  'new',
  'follow_up',
  'docs_pending',
  'payment_pending',
  'confirmed',
  'completed',
  'cancelled',
];

function isoToInputValue(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (item: number) => String(item).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isDueToday(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isOverdue(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminRole, setAdminRole] = useState<AdminUserRecord['role']>('manager');
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);

  const [overview, setOverview] = useState({
    tripCount: 0,
    inquiryCount: 0,
    bookingCount: 0,
    paymentCount: 0,
    revenue: 0,
    adminUsers: 0,
  });
  const [analytics, setAnalytics] = useState<AdminAnalyticsOverview>({
    periodDays: 30,
    totalEvents: 0,
    uniqueSessions: 0,
    funnel: [],
    topEvents: [],
    topPages: [],
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [referralOverview, setReferralOverview] = useState<AdminReferralOverview>({
    totalUsersWithReferralCode: 0,
    totalReferredUsers: 0,
    totalRewardsIssued: 0,
    totalRewardsRedeemed: 0,
    topReferrers: [],
  });
  const [marketingAnalytics, setMarketingAnalytics] = useState<AdminMarketingAnalytics>({
    periodDays: 90,
    bookingsWithCoupon: 0,
    couponDiscountValue: 0,
    couponRevenue: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    rewardsIssued: 0,
    rewardsRedeemed: 0,
    rewardRedemptionRate: 0,
    topCampaigns: [],
  });
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [reminders, setReminders] = useState<{ inquiries: InquiryRecord[]; bookings: BookingRecord[] }>({
    inquiries: [],
    bookings: [],
  });
  const [inquiryDrafts, setInquiryDrafts] = useState<Record<string, InquiryDraft>>({});
  const [bookingDrafts, setBookingDrafts] = useState<Record<string, BookingDraft>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoiceRecord | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<{
    entityType: 'inquiry' | 'booking';
    entityId: string;
    logs: AuditLogRecord[];
  } | null>(null);
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);

  const [inquiryFilters, setInquiryFilters] = useState<{
    search: string;
    agent: string;
    stage: 'all' | InquiryRecord['crmStage'];
    due: DueFilter;
    sort: SortFilter;
  }>({
    search: '',
    agent: 'all',
    stage: 'all',
    due: 'all',
    sort: 'created_desc',
  });

  const [bookingFilters, setBookingFilters] = useState<{
    search: string;
    agent: string;
    stage: 'all' | BookingRecord['crmStage'];
    due: DueFilter;
    sort: SortFilter;
  }>({
    search: '',
    agent: 'all',
    stage: 'all',
    due: 'all',
    sort: 'created_desc',
  });

  const [bulkInquiry, setBulkInquiry] = useState<{
    status: '' | InquiryRecord['status'];
    crmStage: '' | InquiryRecord['crmStage'];
    assignedAgent: string;
    followUpAt: string;
  }>({
    status: '',
    crmStage: '',
    assignedAgent: '',
    followUpAt: '',
  });

  const [bulkBooking, setBulkBooking] = useState<{
    bookingStatus: '' | BookingRecord['bookingStatus'];
    crmStage: '' | BookingRecord['crmStage'];
    assignedAgent: string;
    followUpAt: string;
  }>({
    bookingStatus: '',
    crmStage: '',
    assignedAgent: '',
    followUpAt: '',
  });

  const [newTrip, setNewTrip] = useState({
    name: '',
    slug: '',
    location: '',
    durationDays: '',
    nights: '',
    category: 'Domestic' as TripCategory,
    groupType: '',
    price: '',
    discountedPrice: '',
    featured: false,
    heroImage: '',
    overview: '',
    blackoutDates: '',
    availabilityJson: '',
  });
  const [mediaForm, setMediaForm] = useState({
    title: '',
    url: '',
    type: 'gallery' as MediaAssetRecord['type'],
    altText: '',
    tags: '',
    active: true,
    cdnUrl: '',
    cacheControl: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [editingAvailabilityTripId, setEditingAvailabilityTripId] = useState('');
  const [availabilityDraft, setAvailabilityDraft] = useState<Array<{ date: string; seatsLeft: string; status: 'open' | 'waitlist' | 'closed' }>>([]);
  const [blackoutDraft, setBlackoutDraft] = useState('');
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percent' as CouponRecord['discountType'],
    discountValue: '',
    maxDiscount: '',
    minOrderAmount: '0',
    usageLimit: '',
    validFrom: '',
    validTill: '',
    active: true,
  });

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'manager' as AdminUserRecord['role'],
    active: true,
    permissions: ['view_overview', 'manage_crm', 'view_payments'],
  });

  const [savingTrip, setSavingTrip] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [savingUserId, setSavingUserId] = useState('');
  const [savingCrmId, setSavingCrmId] = useState('');
  const [busyTimelineId, setBusyTimelineId] = useState('');
  const [busyPaymentId, setBusyPaymentId] = useState('');
  const [busyInvoiceId, setBusyInvoiceId] = useState('');
  const [notifyResult, setNotifyResult] = useState('');
  const [editingUserId, setEditingUserId] = useState('');
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

  const hasPermission = (permission: string) => adminPermissions.includes(permission);

  const availableTabs = tabs.filter((tab) => {
    if (tab === 'overview') return hasPermission('view_overview');
    if (tab === 'crm') return hasPermission('manage_crm');
    if (tab === 'trips') return hasPermission('manage_trips');
    if (tab === 'marketing') return hasPermission('manage_trips') || hasPermission('view_overview');
    if (tab === 'payments') return hasPermission('view_payments');
    if (tab === 'users') return hasPermission('manage_admin_users');
    if (tab === 'audit') return hasPermission('view_audit_logs');
    return true;
  });

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const requests: Array<Promise<unknown>> = [];

      requests.push(getAdminOverview());
      requests.push(getAdminAnalyticsOverview());
      if (hasPermission('manage_trips')) {
        requests.push(getAdminTrips());
        requests.push(getAdminMediaAssets());
        requests.push(getAdminCoupons());
        requests.push(getAdminMarketingAnalytics());
      }
      if (hasPermission('view_overview')) requests.push(getAdminReferralOverview());
      if (hasPermission('manage_crm')) {
        requests.push(getAdminInquiries());
        requests.push(getAdminBookings());
        requests.push(getAdminCrmReminders());
      }
      if (hasPermission('view_payments')) {
        requests.push(getAdminPayments());
        requests.push(getAdminRefunds());
      }
      if (hasPermission('manage_admin_users')) requests.push(getAdminUsers());
      if (hasPermission('view_audit_logs')) requests.push(getAdminAuditLogs());

      const data = await Promise.all(requests);
      let index = 0;

      setOverview(data[index] as typeof overview);
      index += 1;
      setAnalytics(data[index] as AdminAnalyticsOverview);
      index += 1;

      if (hasPermission('manage_trips')) {
        setTrips(data[index] as Trip[]);
        setMediaAssets(data[index + 1] as MediaAssetRecord[]);
        setCoupons(data[index + 2] as CouponRecord[]);
        setMarketingAnalytics(data[index + 3] as AdminMarketingAnalytics);
        index += 4;
      }

      if (hasPermission('view_overview')) {
        setReferralOverview(data[index] as AdminReferralOverview);
        index += 1;
      }

      if (hasPermission('manage_crm')) {
        setInquiries(data[index] as InquiryRecord[]);
        setBookings(data[index + 1] as BookingRecord[]);
        setReminders((data[index + 2] as { reminders: { inquiries: InquiryRecord[]; bookings: BookingRecord[] } }).reminders);
        index += 3;
      }

      if (hasPermission('view_payments')) {
        setPayments(data[index] as PaymentRecord[]);
        setRefunds(data[index + 1] as RefundRecord[]);
        index += 2;
      }

      if (hasPermission('manage_admin_users')) {
        setUsers(data[index] as AdminUserRecord[]);
        index += 1;
      }

      if (hasPermission('view_audit_logs')) {
        setAuditLogs(data[index] as AuditLogRecord[]);
      }
    } catch (dashboardError) {
      const message = dashboardError instanceof Error ? dashboardError.message : 'Failed to load admin dashboard';
      setError(message);
      if (message.toLowerCase().includes('token') || message.toLowerCase().includes('authorized')) {
        adminLogout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('qarwaan_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const role = (localStorage.getItem('qarwaan_admin_role') || 'manager') as AdminUserRecord['role'];
    const rawPermissions = localStorage.getItem('qarwaan_admin_permissions') || '[]';

    setAdminRole(role);
    try {
      setAdminPermissions(JSON.parse(rawPermissions));
    } catch {
      setAdminPermissions([]);
    }

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nextDrafts: Record<string, InquiryDraft> = {};
    inquiries.forEach((item) => {
      nextDrafts[item._id] = {
        status: item.status,
        crmStage: item.crmStage || 'new',
        assignedAgent: item.assignedAgent || '',
        followUpAt: isoToInputValue(item.followUpAt),
        followUpNote: item.followUpNote || '',
      };
    });
    setInquiryDrafts(nextDrafts);
  }, [inquiries]);

  useEffect(() => {
    const nextDrafts: Record<string, BookingDraft> = {};
    bookings.forEach((item) => {
      nextDrafts[item._id] = {
        bookingStatus: item.bookingStatus,
        crmStage: item.crmStage || 'new',
        assignedAgent: item.assignedAgent || '',
        followUpAt: isoToInputValue(item.followUpAt),
        followUpNote: item.followUpNote || '',
      };
    });
    setBookingDrafts(nextDrafts);
  }, [bookings]);

  useEffect(() => {
    const valid = new Set(inquiries.map((item) => item._id));
    setSelectedInquiryIds((prev) => prev.filter((id) => valid.has(id)));
  }, [inquiries]);

  useEffect(() => {
    const valid = new Set(bookings.map((item) => item._id));
    setSelectedBookingIds((prev) => prev.filter((id) => valid.has(id)));
  }, [bookings]);

  const overdueCount = useMemo(
    () => reminders.inquiries.length + reminders.bookings.length,
    [reminders.bookings.length, reminders.inquiries.length]
  );

  const inquiryAgents = useMemo(
    () => [...new Set(inquiries.map((item) => (item.assignedAgent || '').trim()).filter(Boolean))].sort(),
    [inquiries]
  );

  const bookingAgents = useMemo(
    () => [...new Set(bookings.map((item) => (item.assignedAgent || '').trim()).filter(Boolean))].sort(),
    [bookings]
  );

  const filteredInquiries = useMemo(() => {
    const term = inquiryFilters.search.trim().toLowerCase();
    const list = inquiries.filter((item) => {
      if (term) {
        const hay = `${item.fullName} ${item.email} ${item.phone} ${item.tripName || ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (inquiryFilters.agent !== 'all' && (item.assignedAgent || '') !== inquiryFilters.agent) return false;
      if (inquiryFilters.stage !== 'all' && item.crmStage !== inquiryFilters.stage) return false;
      if (inquiryFilters.due === 'due_today' && !isDueToday(item.followUpAt)) return false;
      if (inquiryFilters.due === 'overdue' && !isOverdue(item.followUpAt)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (inquiryFilters.sort === 'created_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (inquiryFilters.sort === 'followup_asc') return new Date(a.followUpAt || 0).getTime() - new Date(b.followUpAt || 0).getTime();
      if (inquiryFilters.sort === 'followup_desc') return new Date(b.followUpAt || 0).getTime() - new Date(a.followUpAt || 0).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [inquiries, inquiryFilters]);

  const filteredBookings = useMemo(() => {
    const term = bookingFilters.search.trim().toLowerCase();
    const list = bookings.filter((item) => {
      if (term) {
        const hay = `${item.fullName} ${item.email} ${item.phone} ${item.tripName}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (bookingFilters.agent !== 'all' && (item.assignedAgent || '') !== bookingFilters.agent) return false;
      if (bookingFilters.stage !== 'all' && item.crmStage !== bookingFilters.stage) return false;
      if (bookingFilters.due === 'due_today' && !isDueToday(item.followUpAt)) return false;
      if (bookingFilters.due === 'overdue' && !isOverdue(item.followUpAt)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (bookingFilters.sort === 'created_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (bookingFilters.sort === 'followup_asc') return new Date(a.followUpAt || 0).getTime() - new Date(b.followUpAt || 0).getTime();
      if (bookingFilters.sort === 'followup_desc') return new Date(b.followUpAt || 0).getTime() - new Date(a.followUpAt || 0).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [bookings, bookingFilters]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleCreateTrip = async (event: FormEvent) => {
    event.preventDefault();
    setSavingTrip(true);
    setError('');
    try {
      let availability: Trip['availability'] = [];
      if (newTrip.availabilityJson.trim()) {
        const parsed = JSON.parse(newTrip.availabilityJson) as Trip['availability'];
        availability = Array.isArray(parsed) ? parsed : [];
      }
      const blackoutDates = newTrip.blackoutDates
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      await createAdminTrip({
        name: newTrip.name,
        slug: newTrip.slug,
        location: newTrip.location,
        durationDays: Number(newTrip.durationDays),
        nights: Number(newTrip.nights),
        category: newTrip.category,
        groupType: newTrip.groupType,
        price: Number(newTrip.price),
        discountedPrice: newTrip.discountedPrice ? Number(newTrip.discountedPrice) : undefined,
        featured: newTrip.featured,
        heroImage: newTrip.heroImage,
        overview: newTrip.overview,
        rating: 4.5,
        reviewCount: 10,
        highlights: [],
        inclusions: [],
        exclusions: [],
        availableMonths: [],
        availability,
        blackoutDates,
        itinerary: [],
      });

      setNewTrip({
        name: '',
        slug: '',
        location: '',
        durationDays: '',
        nights: '',
        category: 'Domestic',
        groupType: '',
        price: '',
        discountedPrice: '',
        featured: false,
        heroImage: '',
        overview: '',
        blackoutDates: '',
        availabilityJson: '',
      });

      await loadDashboard();
    } catch (tripError) {
      setError(tripError instanceof Error ? tripError.message : 'Failed to create trip');
    } finally {
      setSavingTrip(false);
    }
  };

  const handleCreateMedia = async (event: FormEvent) => {
    event.preventDefault();
    setSavingMedia(true);
    setError('');
    try {
      if (mediaFile) {
        await uploadAdminMediaAsset({
          file: mediaFile,
          title: mediaForm.title || undefined,
          type: mediaForm.type,
          altText: mediaForm.altText || undefined,
          tags: mediaForm.tags || undefined,
          active: mediaForm.active,
          cdnUrl: mediaForm.cdnUrl || undefined,
          cacheControl: mediaForm.cacheControl || undefined,
        });
      } else {
        if (!mediaForm.url.trim()) {
          throw new Error('Media URL is required when no file is selected');
        }
        await createAdminMediaAsset({
          title: mediaForm.title || 'Media Asset',
          url: mediaForm.url.trim(),
          type: mediaForm.type,
          altText: mediaForm.altText || undefined,
          tags: mediaForm.tags || undefined,
          active: mediaForm.active,
          cdnUrl: mediaForm.cdnUrl || undefined,
          cacheControl: mediaForm.cacheControl || undefined,
        });
      }

      setMediaForm({
        title: '',
        url: '',
        type: 'gallery',
        altText: '',
        tags: '',
        active: true,
        cdnUrl: '',
        cacheControl: '',
      });
      setMediaFile(null);
      await loadDashboard();
    } catch (mediaError) {
      setError(mediaError instanceof Error ? mediaError.message : 'Failed to create media asset');
    } finally {
      setSavingMedia(false);
    }
  };

  const toggleMediaActive = async (asset: MediaAssetRecord) => {
    setSavingMedia(true);
    setError('');
    try {
      await updateAdminMediaAsset(asset._id, { active: !asset.active });
      await loadDashboard();
    } catch (mediaError) {
      setError(mediaError instanceof Error ? mediaError.message : 'Failed to update media asset');
    } finally {
      setSavingMedia(false);
    }
  };

  const handleCreateCoupon = async (event: FormEvent) => {
    event.preventDefault();
    setSavingCoupon(true);
    setError('');
    try {
      await createAdminCoupon({
        code: newCoupon.code.trim().toUpperCase(),
        description: newCoupon.description.trim() || undefined,
        discountType: newCoupon.discountType,
        discountValue: Number(newCoupon.discountValue),
        maxDiscount: newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : undefined,
        minOrderAmount: Number(newCoupon.minOrderAmount || 0),
        usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : undefined,
        validFrom: newCoupon.validFrom ? new Date(newCoupon.validFrom).toISOString() : undefined,
        validTill: newCoupon.validTill ? new Date(newCoupon.validTill).toISOString() : undefined,
        active: newCoupon.active,
      });
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: '',
        maxDiscount: '',
        minOrderAmount: '0',
        usageLimit: '',
        validFrom: '',
        validTill: '',
        active: true,
      });
      await loadDashboard();
    } catch (couponError) {
      setError(couponError instanceof Error ? couponError.message : 'Failed to create coupon');
    } finally {
      setSavingCoupon(false);
    }
  };

  const toggleCouponActive = async (coupon: CouponRecord) => {
    setSavingCoupon(true);
    setError('');
    try {
      await updateAdminCoupon(coupon._id, { active: !coupon.active });
      await loadDashboard();
    } catch (couponError) {
      setError(couponError instanceof Error ? couponError.message : 'Failed to update coupon');
    } finally {
      setSavingCoupon(false);
    }
  };

  const updateInquiryDraft = (id: string, key: keyof InquiryDraft, value: string) => {
    setInquiryDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  const updateBookingDraft = (id: string, key: keyof BookingDraft, value: string) => {
    setBookingDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  const saveInquiry = async (id: string) => {
    const draft = inquiryDrafts[id];
    if (!draft) return;

    setSavingCrmId(id);
    setError('');
    try {
      await updateAdminInquiry(id, {
        status: draft.status,
        crmStage: draft.crmStage,
        assignedAgent: draft.assignedAgent,
        followUpAt: draft.followUpAt ? new Date(draft.followUpAt).toISOString() : null,
        followUpNote: draft.followUpNote,
      });
      await loadDashboard();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update inquiry');
    } finally {
      setSavingCrmId('');
    }
  };

  const saveBooking = async (id: string) => {
    const draft = bookingDrafts[id];
    if (!draft) return;

    setSavingCrmId(id);
    setError('');
    try {
      await updateAdminBooking(id, {
        bookingStatus: draft.bookingStatus,
        crmStage: draft.crmStage,
        assignedAgent: draft.assignedAgent,
        followUpAt: draft.followUpAt ? new Date(draft.followUpAt).toISOString() : null,
        followUpNote: draft.followUpNote,
      });
      await loadDashboard();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update booking');
    } finally {
      setSavingCrmId('');
    }
  };

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiryIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectBooking = (id: string) => {
    setSelectedBookingIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAllFilteredInquiries = () => {
    const visibleIds = filteredInquiries.slice(0, 50).map((item) => item._id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedInquiryIds.includes(id));
    if (allSelected) {
      setSelectedInquiryIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedInquiryIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const toggleSelectAllFilteredBookings = () => {
    const visibleIds = filteredBookings.slice(0, 50).map((item) => item._id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedBookingIds.includes(id));
    if (allSelected) {
      setSelectedBookingIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedBookingIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const applyInquiryBulk = async () => {
    if (selectedInquiryIds.length === 0) {
      setError('Select at least one inquiry for bulk action');
      return;
    }

    const payload: Partial<Omit<InquiryRecord, 'followUpAt'> & { followUpAt?: string | null }> = {};
    if (bulkInquiry.status) payload.status = bulkInquiry.status;
    if (bulkInquiry.crmStage) payload.crmStage = bulkInquiry.crmStage;
    if (bulkInquiry.assignedAgent.trim()) payload.assignedAgent = bulkInquiry.assignedAgent.trim();
    if (bulkInquiry.followUpAt) payload.followUpAt = new Date(bulkInquiry.followUpAt).toISOString();

    if (Object.keys(payload).length === 0) {
      setError('Set at least one bulk value (status/stage/agent/follow-up)');
      return;
    }

    setSavingCrmId('bulk_inquiry');
    setError('');
    try {
      await Promise.all(selectedInquiryIds.map((id) => updateAdminInquiry(id, payload)));
      setSelectedInquiryIds([]);
      await loadDashboard();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to apply inquiry bulk action');
    } finally {
      setSavingCrmId('');
    }
  };

  const applyBookingBulk = async () => {
    if (selectedBookingIds.length === 0) {
      setError('Select at least one booking for bulk action');
      return;
    }

    const payload: Partial<Omit<BookingRecord, 'followUpAt'> & { followUpAt?: string | null }> = {};
    if (bulkBooking.bookingStatus) payload.bookingStatus = bulkBooking.bookingStatus;
    if (bulkBooking.crmStage) payload.crmStage = bulkBooking.crmStage;
    if (bulkBooking.assignedAgent.trim()) payload.assignedAgent = bulkBooking.assignedAgent.trim();
    if (bulkBooking.followUpAt) payload.followUpAt = new Date(bulkBooking.followUpAt).toISOString();

    if (Object.keys(payload).length === 0) {
      setError('Set at least one bulk value (status/stage/agent/follow-up)');
      return;
    }

    setSavingCrmId('bulk_booking');
    setError('');
    try {
      await Promise.all(selectedBookingIds.map((id) => updateAdminBooking(id, payload)));
      setSelectedBookingIds([]);
      await loadDashboard();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to apply booking bulk action');
    } finally {
      setSavingCrmId('');
    }
  };

  const clearInquiryFollowUps = async () => {
    if (selectedInquiryIds.length === 0) {
      setError('Select at least one inquiry for bulk action');
      return;
    }
    setSavingCrmId('bulk_inquiry_clear');
    setError('');
    try {
      await Promise.all(selectedInquiryIds.map((id) => updateAdminInquiry(id, { followUpAt: null, followUpNote: '' })));
      setSelectedInquiryIds([]);
      await loadDashboard();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to clear inquiry follow-up');
    } finally {
      setSavingCrmId('');
    }
  };

  const clearBookingFollowUps = async () => {
    if (selectedBookingIds.length === 0) {
      setError('Select at least one booking for bulk action');
      return;
    }
    setSavingCrmId('bulk_booking_clear');
    setError('');
    try {
      await Promise.all(selectedBookingIds.map((id) => updateAdminBooking(id, { followUpAt: null, followUpNote: '' })));
      setSelectedBookingIds([]);
      await loadDashboard();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to clear booking follow-up');
    } finally {
      setSavingCrmId('');
    }
  };

  const removeTrip = async (id: string) => {
    await deleteAdminTrip(id);
    await loadDashboard();
  };

  const toggleTripFeatured = async (trip: Trip) => {
    setSavingTrip(true);
    setError('');
    try {
      await updateAdminTrip(trip._id, { featured: !trip.featured });
      await loadDashboard();
    } catch (tripError) {
      setError(tripError instanceof Error ? tripError.message : 'Failed to update featured flag');
    } finally {
      setSavingTrip(false);
    }
  };

  const setTripDiscount = async (trip: Trip) => {
    const input = window.prompt(
      'Set discounted price (leave empty to clear discount)',
      trip.discountedPrice ? String(trip.discountedPrice) : ''
    );
    if (input === null) return;

    setSavingTrip(true);
    setError('');
    try {
      const value = input.trim();
      await updateAdminTrip(trip._id, {
        discountedPrice: value ? Number(value) : null,
      } as unknown as Partial<Trip>);
      await loadDashboard();
    } catch (tripError) {
      setError(tripError instanceof Error ? tripError.message : 'Failed to update discount');
    } finally {
      setSavingTrip(false);
    }
  };

  const setTripAvailability = async (trip: Trip) => {
    setEditingAvailabilityTripId(trip._id);
    setAvailabilityDraft(
      (trip.availability || []).map((slot) => ({
        date: slot.date,
        seatsLeft: String(slot.seatsLeft),
        status: slot.status,
      }))
    );
    setBlackoutDraft((trip.blackoutDates || []).join(', '));
  };

  const saveTripAvailability = async () => {
    if (!editingAvailabilityTripId) return;
    setSavingTrip(true);
    setError('');
    try {
      const availability = availabilityDraft
        .filter((item) => item.date.trim())
        .map((item) => ({
          date: item.date.trim(),
          seatsLeft: Math.max(0, Number(item.seatsLeft || 0)),
          status: item.status,
        }));
      const blackoutDates = blackoutDraft
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      await updateAdminTrip(editingAvailabilityTripId, {
        availability,
        blackoutDates,
      } as Partial<Trip>);
      setEditingAvailabilityTripId('');
      setAvailabilityDraft([]);
      setBlackoutDraft('');
      await loadDashboard();
    } catch (tripError) {
      setError(tripError instanceof Error ? tripError.message : 'Failed to save availability');
    } finally {
      setSavingTrip(false);
    }
  };

  const handleTriggerNotify = async () => {
    try {
      const data = await triggerAdminCrmNotifyDue();
      setNotifyResult(`Queued ${data.result.queued} notifications from ${data.result.totalEntities} entities`);
      await loadDashboard();
    } catch (notifyError) {
      setError(notifyError instanceof Error ? notifyError.message : 'Failed to trigger CRM notifications');
    }
  };

  const handleRetryFailed = async () => {
    try {
      const result = await retryAdminFailedWebhooks();
      setNotifyResult(`Queued ${result.retried} failed webhooks for retry`);
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : 'Failed to retry failed webhooks');
    }
  };

  const handleRefund = async (payment: PaymentRecord) => {
    const refundable = payment.amount - (payment.refundedAmount || 0);
    const amountInput = window.prompt(`Refund amount (max ${refundable})`, String(refundable));
    if (!amountInput) return;

    const amount = Number(amountInput);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Invalid refund amount');
      return;
    }

    const reason = window.prompt('Refund reason', 'Customer request') || '';

    setBusyPaymentId(payment._id);
    setError('');
    try {
      await refundAdminPayment(payment._id, { amount, reason });
      await loadDashboard();
    } catch (refundError) {
      setError(refundError instanceof Error ? refundError.message : 'Refund failed');
    } finally {
      setBusyPaymentId('');
    }
  };

  const viewInvoice = async (payment: PaymentRecord) => {
    setBusyInvoiceId(payment._id);
    setError('');
    try {
      const invoice = await getAdminPaymentInvoice(payment._id);
      setSelectedInvoice(invoice);
    } catch (invoiceError) {
      setError(invoiceError instanceof Error ? invoiceError.message : 'Failed to load invoice');
    } finally {
      setBusyInvoiceId('');
    }
  };

  const downloadInvoicePdf = async (payment: PaymentRecord) => {
    setBusyInvoiceId(payment._id);
    setError('');
    try {
      await downloadAdminPaymentInvoicePdf(payment._id);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download invoice PDF');
    } finally {
      setBusyInvoiceId('');
    }
  };

  const openTimeline = async (entityType: 'inquiry' | 'booking', entityId: string) => {
    setBusyTimelineId(entityId);
    setError('');
    try {
      const logs = await getAdminCrmTimeline(entityType, entityId);
      setSelectedTimeline({ entityType, entityId, logs });
    } catch (timelineError) {
      setError(timelineError instanceof Error ? timelineError.message : 'Failed to fetch timeline');
    } finally {
      setBusyTimelineId('');
    }
  };

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    setSavingUser(true);
    setError('');
    try {
      await createAdminUser(newUser);
      setNewUser({
        username: '',
        password: '',
        role: 'manager',
        active: true,
        permissions: ['view_overview', 'manage_crm', 'view_payments'],
      });
      await loadDashboard();
    } catch (userError) {
      setError(userError instanceof Error ? userError.message : 'Failed to create user');
    } finally {
      setSavingUser(false);
    }
  };

  const toggleUser = async (user: AdminUserRecord) => {
    await updateAdminUser(user.id, { active: !user.active });
    await loadDashboard();
  };

  const startEditUserPermissions = (user: AdminUserRecord) => {
    setEditingUserId(user.id);
    setEditingPermissions(user.permissions || []);
  };

  const cancelEditUserPermissions = () => {
    setEditingUserId('');
    setEditingPermissions([]);
  };

  const toggleEditingPermission = (permission: string) => {
    setEditingPermissions((prev) =>
      prev.includes(permission) ? prev.filter((item) => item !== permission) : [...prev, permission]
    );
  };

  const saveUserPermissions = async (user: AdminUserRecord) => {
    setSavingUserId(user.id);
    setError('');
    try {
      await updateAdminUser(user.id, { permissions: editingPermissions, role: user.role });
      await loadDashboard();
      cancelEditUserPermissions();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update user permissions');
    } finally {
      setSavingUserId('');
    }
  };

  const togglePermission = (permission: string) => {
    setNewUser((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists ? prev.permissions.filter((p) => p !== permission) : [...prev.permissions, permission],
      };
    });
  };

  return (
    <main className="min-h-screen bg-[#f4faf8] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#112211]">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Role: {adminRole} | Permissions: {adminPermissions.length}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                  activeTab === tab ? 'bg-[#112211] text-white' : 'bg-white text-[#112211] border border-emerald-100'
                }`}
              >
                {tab}
              </button>
            ))}
            <button onClick={handleLogout} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        {loading ? <p className="text-gray-600">Loading admin data...</p> : null}

        {!loading && activeTab === 'overview' ? (
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Trips</p><p className="text-2xl font-bold text-[#112211]">{overview.tripCount}</p></article>
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Inquiries</p><p className="text-2xl font-bold text-[#112211]">{overview.inquiryCount}</p></article>
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Bookings</p><p className="text-2xl font-bold text-[#112211]">{overview.bookingCount}</p></article>
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Payments</p><p className="text-2xl font-bold text-[#112211]">{overview.paymentCount}</p></article>
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Revenue</p><p className="text-2xl font-bold text-[#112211]">INR {overview.revenue.toLocaleString()}</p></article>
              <article className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">Admin Users</p><p className="text-2xl font-bold text-[#112211]">{overview.adminUsers}</p></article>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Analytics Window</p>
                <p className="text-2xl font-bold text-[#112211]">{analytics.periodDays} days</p>
              </article>
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Total Tracked Events</p>
                <p className="text-2xl font-bold text-[#112211]">{analytics.totalEvents.toLocaleString()}</p>
              </article>
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Unique Sessions</p>
                <p className="text-2xl font-bold text-[#112211]">{analytics.uniqueSessions.toLocaleString()}</p>
              </article>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-[#112211]">Funnel</h3>
                <div className="space-y-2">
                  {analytics.funnel.map((item) => (
                    <div key={item.event} className="rounded-lg border p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">{item.event}</p>
                      <p className="text-lg font-semibold text-[#112211]">{item.count.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-[#112211]">Top Events</h3>
                <div className="space-y-2">
                  {analytics.topEvents.length === 0 ? (
                    <p className="text-sm text-gray-600">No events collected yet.</p>
                  ) : (
                    analytics.topEvents.map((item) => (
                      <div key={item.event} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <span className="font-medium text-[#112211]">{item.event}</span>
                        <span className="text-gray-600">{item.count.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-[#112211]">Top Pages</h3>
                <div className="space-y-2">
                  {analytics.topPages.length === 0 ? (
                    <p className="text-sm text-gray-600">No page views tracked yet.</p>
                  ) : (
                    analytics.topPages.map((item) => (
                      <div key={item.pagePath} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <span className="truncate pr-3 font-medium text-[#112211]">{item.pagePath}</span>
                        <span className="text-gray-600">{item.count.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === 'crm' ? (
          <section className="space-y-6">
            <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-lg font-bold text-[#112211]">Due Reminders ({overdueCount})</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button onClick={handleTriggerNotify} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white">Queue Due Notifications</button>
                <button onClick={handleRetryFailed} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#112211] border border-[#112211]">Retry Failed Webhooks</button>
                {notifyResult ? <span className="text-sm text-gray-700">{notifyResult}</span> : null}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-[#112211]">Inquiries</h3>
                <button onClick={toggleSelectAllFilteredInquiries} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211]">
                  {filteredInquiries.slice(0, 50).length > 0 && filteredInquiries.slice(0, 50).every((item) => selectedInquiryIds.includes(item._id)) ? 'Unselect visible' : 'Select visible'}
                </button>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-2 rounded-lg border bg-[#f8fcfa] p-3 md:grid-cols-5">
                <input value={inquiryFilters.search} onChange={(e) => setInquiryFilters((prev) => ({ ...prev, search: e.target.value }))} placeholder="Search lead" className="rounded-lg border px-3 py-2 text-sm" />
                <select value={inquiryFilters.agent} onChange={(e) => setInquiryFilters((prev) => ({ ...prev, agent: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All agents</option>
                  {inquiryAgents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
                </select>
                <select value={inquiryFilters.stage} onChange={(e) => setInquiryFilters((prev) => ({ ...prev, stage: e.target.value as 'all' | InquiryRecord['crmStage'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All stages</option>
                  {inquiryStageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
                <select value={inquiryFilters.due} onChange={(e) => setInquiryFilters((prev) => ({ ...prev, due: e.target.value as DueFilter }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All due states</option>
                  <option value="due_today">Due today</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select value={inquiryFilters.sort} onChange={(e) => setInquiryFilters((prev) => ({ ...prev, sort: e.target.value as SortFilter }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="created_desc">Newest created</option>
                  <option value="created_asc">Oldest created</option>
                  <option value="followup_asc">Follow-up earliest</option>
                  <option value="followup_desc">Follow-up latest</option>
                </select>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-2 rounded-lg border bg-[#f8fcfa] p-3 md:grid-cols-6">
                <select value={bulkInquiry.status} onChange={(e) => setBulkInquiry((prev) => ({ ...prev, status: e.target.value as '' | InquiryRecord['status'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">Bulk status</option>
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="closed">closed</option>
                </select>
                <select value={bulkInquiry.crmStage} onChange={(e) => setBulkInquiry((prev) => ({ ...prev, crmStage: e.target.value as '' | InquiryRecord['crmStage'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">Bulk stage</option>
                  {inquiryStageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
                <input value={bulkInquiry.assignedAgent} onChange={(e) => setBulkInquiry((prev) => ({ ...prev, assignedAgent: e.target.value }))} placeholder="Bulk assign agent" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="datetime-local" value={bulkInquiry.followUpAt} onChange={(e) => setBulkInquiry((prev) => ({ ...prev, followUpAt: e.target.value }))} placeholder="Follow-up date and time" className="rounded-lg border px-3 py-2 text-sm" />
                <button onClick={applyInquiryBulk} disabled={savingCrmId === 'bulk_inquiry'} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                  {savingCrmId === 'bulk_inquiry' ? 'Applying...' : `Apply to ${selectedInquiryIds.length}`}
                </button>
                <button onClick={clearInquiryFollowUps} disabled={savingCrmId === 'bulk_inquiry_clear'} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                  {savingCrmId === 'bulk_inquiry_clear' ? 'Clearing...' : 'Clear Follow-up'}
                </button>
              </div>
              <div className="space-y-3">
                {filteredInquiries.slice(0, 50).map((item) => {
                  const draft = inquiryDrafts[item._id];
                  if (!draft) return null;

                  return (
                    <div key={item._id} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <label className="mb-1 flex items-center gap-2 text-xs text-gray-600">
                            <input type="checkbox" checked={selectedInquiryIds.includes(item._id)} onChange={() => toggleSelectInquiry(item._id)} />
                            Select
                          </label>
                          <p className="font-semibold text-[#112211]">{item.fullName}</p>
                          <p className="text-sm text-gray-600">{item.email} | {item.phone} | {item.travelers} travelers</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openTimeline('inquiry', item._id)} disabled={busyTimelineId === item._id} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                            {busyTimelineId === item._id ? 'Loading...' : 'Timeline'}
                          </button>
                          <button onClick={() => saveInquiry(item._id)} disabled={savingCrmId === item._id} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                            {savingCrmId === item._id ? 'Saving...' : 'Save Inquiry'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-5">
                        <select value={draft.status} onChange={(e) => updateInquiryDraft(item._id, 'status', e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="closed">closed</option>
                        </select>
                        <select value={draft.crmStage} onChange={(e) => updateInquiryDraft(item._id, 'crmStage', e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                          {inquiryStageOptions.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                        <input value={draft.assignedAgent} onChange={(e) => updateInquiryDraft(item._id, 'assignedAgent', e.target.value)} placeholder="Assigned agent" className="rounded-lg border px-3 py-2 text-sm" />
                        <input type="datetime-local" value={draft.followUpAt} onChange={(e) => updateInquiryDraft(item._id, 'followUpAt', e.target.value)} placeholder="Follow-up date and time" className="rounded-lg border px-3 py-2 text-sm" />
                        <input value={draft.followUpNote} onChange={(e) => updateInquiryDraft(item._id, 'followUpNote', e.target.value)} placeholder="Follow-up note" className="rounded-lg border px-3 py-2 text-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-[#112211]">Bookings</h3>
                <button onClick={toggleSelectAllFilteredBookings} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211]">
                  {filteredBookings.slice(0, 50).length > 0 && filteredBookings.slice(0, 50).every((item) => selectedBookingIds.includes(item._id)) ? 'Unselect visible' : 'Select visible'}
                </button>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-2 rounded-lg border bg-[#f8fcfa] p-3 md:grid-cols-5">
                <input value={bookingFilters.search} onChange={(e) => setBookingFilters((prev) => ({ ...prev, search: e.target.value }))} placeholder="Search booking" className="rounded-lg border px-3 py-2 text-sm" />
                <select value={bookingFilters.agent} onChange={(e) => setBookingFilters((prev) => ({ ...prev, agent: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All agents</option>
                  {bookingAgents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
                </select>
                <select value={bookingFilters.stage} onChange={(e) => setBookingFilters((prev) => ({ ...prev, stage: e.target.value as 'all' | BookingRecord['crmStage'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All stages</option>
                  {bookingStageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
                <select value={bookingFilters.due} onChange={(e) => setBookingFilters((prev) => ({ ...prev, due: e.target.value as DueFilter }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="all">All due states</option>
                  <option value="due_today">Due today</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select value={bookingFilters.sort} onChange={(e) => setBookingFilters((prev) => ({ ...prev, sort: e.target.value as SortFilter }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="created_desc">Newest created</option>
                  <option value="created_asc">Oldest created</option>
                  <option value="followup_asc">Follow-up earliest</option>
                  <option value="followup_desc">Follow-up latest</option>
                </select>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-2 rounded-lg border bg-[#f8fcfa] p-3 md:grid-cols-6">
                <select value={bulkBooking.bookingStatus} onChange={(e) => setBulkBooking((prev) => ({ ...prev, bookingStatus: e.target.value as '' | BookingRecord['bookingStatus'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">Bulk booking status</option>
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <select value={bulkBooking.crmStage} onChange={(e) => setBulkBooking((prev) => ({ ...prev, crmStage: e.target.value as '' | BookingRecord['crmStage'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">Bulk stage</option>
                  {bookingStageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
                <input value={bulkBooking.assignedAgent} onChange={(e) => setBulkBooking((prev) => ({ ...prev, assignedAgent: e.target.value }))} placeholder="Bulk assign agent" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="datetime-local" value={bulkBooking.followUpAt} onChange={(e) => setBulkBooking((prev) => ({ ...prev, followUpAt: e.target.value }))} placeholder="Follow-up date and time" className="rounded-lg border px-3 py-2 text-sm" />
                <button onClick={applyBookingBulk} disabled={savingCrmId === 'bulk_booking'} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                  {savingCrmId === 'bulk_booking' ? 'Applying...' : `Apply to ${selectedBookingIds.length}`}
                </button>
                <button onClick={clearBookingFollowUps} disabled={savingCrmId === 'bulk_booking_clear'} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                  {savingCrmId === 'bulk_booking_clear' ? 'Clearing...' : 'Clear Follow-up'}
                </button>
              </div>
              <div className="space-y-3">
                {filteredBookings.slice(0, 50).map((item) => {
                  const draft = bookingDrafts[item._id];
                  if (!draft) return null;

                  return (
                    <div key={item._id} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <label className="mb-1 flex items-center gap-2 text-xs text-gray-600">
                            <input type="checkbox" checked={selectedBookingIds.includes(item._id)} onChange={() => toggleSelectBooking(item._id)} />
                            Select
                          </label>
                          <p className="font-semibold text-[#112211]">{item.fullName}</p>
                          <p className="text-sm text-gray-600">{item.tripName} | INR {item.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openTimeline('booking', item._id)} disabled={busyTimelineId === item._id} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                            {busyTimelineId === item._id ? 'Loading...' : 'Timeline'}
                          </button>
                          <button onClick={() => saveBooking(item._id)} disabled={savingCrmId === item._id} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                            {savingCrmId === item._id ? 'Saving...' : 'Save Booking'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-5">
                        <select value={draft.bookingStatus} onChange={(e) => updateBookingDraft(item._id, 'bookingStatus', e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <select value={draft.crmStage} onChange={(e) => updateBookingDraft(item._id, 'crmStage', e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                          {bookingStageOptions.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                        <input value={draft.assignedAgent} onChange={(e) => updateBookingDraft(item._id, 'assignedAgent', e.target.value)} placeholder="Assigned agent" className="rounded-lg border px-3 py-2 text-sm" />
                        <input type="datetime-local" value={draft.followUpAt} onChange={(e) => updateBookingDraft(item._id, 'followUpAt', e.target.value)} placeholder="Follow-up date and time" className="rounded-lg border px-3 py-2 text-sm" />
                        <input value={draft.followUpNote} onChange={(e) => updateBookingDraft(item._id, 'followUpNote', e.target.value)} placeholder="Follow-up note" className="rounded-lg border px-3 py-2 text-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {selectedTimeline ? (
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#112211]">
                    Timeline: {selectedTimeline.entityType} #{selectedTimeline.entityId.slice(-6)}
                  </h3>
                  <button onClick={() => setSelectedTimeline(null)} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">
                    Close Timeline
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedTimeline.logs.length === 0 ? (
                    <p className="text-sm text-gray-600">No timeline events yet for this lead.</p>
                  ) : (
                    selectedTimeline.logs.map((log) => (
                      <div key={log._id} className="rounded-lg border p-3 text-sm">
                        <p className="font-semibold text-[#112211]">{log.action}</p>
                        <p className="text-gray-600">{log.adminUsername || 'system'} | {new Date(log.createdAt).toLocaleString()}</p>
                        {log.details && 'changes' in log.details ? (
                          <pre className="mt-2 overflow-auto rounded bg-[#f6faf8] p-2 text-xs text-gray-700">
                            {JSON.stringify(log.details['changes'], null, 2)}
                          </pre>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </article>
            ) : null}
          </section>
        ) : null}

        {!loading && activeTab === 'trips' ? (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Create Trip</h3>
              <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleCreateTrip}>
                <input required placeholder="Name" value={newTrip.name} onChange={(e) => setNewTrip((p) => ({ ...p, name: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required placeholder="Slug" value={newTrip.slug} onChange={(e) => setNewTrip((p) => ({ ...p, slug: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required placeholder="Location" value={newTrip.location} onChange={(e) => setNewTrip((p) => ({ ...p, location: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required type="number" min={1} placeholder="Days" value={newTrip.durationDays} onChange={(e) => setNewTrip((p) => ({ ...p, durationDays: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required type="number" min={1} placeholder="Nights" value={newTrip.nights} onChange={(e) => setNewTrip((p) => ({ ...p, nights: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required placeholder="Group Type" value={newTrip.groupType} onChange={(e) => setNewTrip((p) => ({ ...p, groupType: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input required type="number" min={1} placeholder="Price" value={newTrip.price} onChange={(e) => setNewTrip((p) => ({ ...p, price: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <input type="number" min={1} placeholder="Discounted price (optional)" value={newTrip.discountedPrice} onChange={(e) => setNewTrip((p) => ({ ...p, discountedPrice: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <select value={newTrip.category} onChange={(e) => setNewTrip((p) => ({ ...p, category: e.target.value as TripCategory }))} className="rounded-lg border px-3 py-2">
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
                <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
                  <input type="checkbox" checked={newTrip.featured} onChange={(e) => setNewTrip((p) => ({ ...p, featured: e.target.checked }))} />
                  Featured trip
                </label>
                <input required placeholder="Hero image URL" value={newTrip.heroImage} onChange={(e) => setNewTrip((p) => ({ ...p, heroImage: e.target.value }))} className="rounded-lg border px-3 py-2 md:col-span-2" />
                <textarea required placeholder="Overview" value={newTrip.overview} onChange={(e) => setNewTrip((p) => ({ ...p, overview: e.target.value }))} className="rounded-lg border px-3 py-2 md:col-span-2" rows={4} />
                <input placeholder="Blackout dates CSV (2026-06-10, 2026-06-11)" value={newTrip.blackoutDates} onChange={(e) => setNewTrip((p) => ({ ...p, blackoutDates: e.target.value }))} className="rounded-lg border px-3 py-2 md:col-span-2" />
                <textarea placeholder='Availability JSON e.g. [{"date":"2026-06-20","seatsLeft":8,"status":"open"}]' value={newTrip.availabilityJson} onChange={(e) => setNewTrip((p) => ({ ...p, availabilityJson: e.target.value }))} className="rounded-lg border px-3 py-2 md:col-span-2" rows={4} />
                <button type="submit" disabled={savingTrip} className="rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white md:col-span-2">{savingTrip ? 'Creating...' : 'Create Trip'}</button>
              </form>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Existing Trips</h3>
              <div className="max-h-[650px] space-y-3 overflow-auto pr-1">
                {trips.map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-semibold text-[#112211]">{trip.name}</p>
                      <p className="text-sm text-gray-600">{trip.durationDays} days | {trip.location}</p>
                      <p className="text-xs text-gray-500">Price: INR {trip.price.toLocaleString()} | Discount: {trip.discountedPrice ? `INR ${trip.discountedPrice.toLocaleString()}` : '-'} | Featured: {trip.featured ? 'yes' : 'no'}</p>
                      <p className="text-xs text-gray-500">Departures: {trip.availability?.length || 0} | Blackout dates: {trip.blackoutDates?.length || 0}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => toggleTripFeatured(trip)} disabled={savingTrip} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">{trip.featured ? 'Unfeature' : 'Feature'}</button>
                      <button onClick={() => setTripDiscount(trip)} disabled={savingTrip} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">Discount</button>
                      <button onClick={() => setTripAvailability(trip)} disabled={savingTrip} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">Availability</button>
                      <button onClick={() => removeTrip(trip._id)} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {editingAvailabilityTripId ? (
                <div className="mt-4 rounded-lg border bg-[#f8fcfa] p-3">
                  <p className="mb-2 text-sm font-semibold text-[#112211]">Availability Editor</p>
                  <div className="space-y-2">
                    {availabilityDraft.map((slot, index) => (
                      <div key={`${editingAvailabilityTripId}-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-4">
                        <input type="date" value={slot.date} onChange={(e) => setAvailabilityDraft((prev) => prev.map((item, idx) => idx === index ? { ...item, date: e.target.value } : item))} className="rounded-lg border px-3 py-2 text-sm" />
                        <input type="number" min={0} value={slot.seatsLeft} onChange={(e) => setAvailabilityDraft((prev) => prev.map((item, idx) => idx === index ? { ...item, seatsLeft: e.target.value } : item))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Seats left" />
                        <select value={slot.status} onChange={(e) => setAvailabilityDraft((prev) => prev.map((item, idx) => idx === index ? { ...item, status: e.target.value as 'open' | 'waitlist' | 'closed' } : item))} className="rounded-lg border px-3 py-2 text-sm">
                          <option value="open">open</option>
                          <option value="waitlist">waitlist</option>
                          <option value="closed">closed</option>
                        </select>
                        <button onClick={() => setAvailabilityDraft((prev) => prev.filter((_, idx) => idx !== index))} className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => setAvailabilityDraft((prev) => [...prev, { date: '', seatsLeft: '0', status: 'open' }])} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211]">Add Departure</button>
                    <input value={blackoutDraft} onChange={(e) => setBlackoutDraft(e.target.value)} placeholder="Blackout dates CSV" className="w-full rounded-lg border px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <button onClick={saveTripAvailability} disabled={savingTrip} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{savingTrip ? 'Saving...' : 'Save Availability'}</button>
                      <button onClick={() => setEditingAvailabilityTripId('')} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">Cancel</button>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Media Library</h3>
              <form className="space-y-2" onSubmit={handleCreateMedia}>
                <input value={mediaForm.title} onChange={(e) => setMediaForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={mediaForm.url} onChange={(e) => setMediaForm((p) => ({ ...p, url: e.target.value }))} placeholder="URL (optional if uploading file)" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} className="w-full rounded-lg border px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={mediaForm.type} onChange={(e) => setMediaForm((p) => ({ ...p, type: e.target.value as MediaAssetRecord['type'] }))} className="rounded-lg border px-3 py-2 text-sm">
                    <option value="gallery">gallery</option>
                    <option value="hero">hero</option>
                    <option value="banner">banner</option>
                    <option value="logo">logo</option>
                  </select>
                  <input value={mediaForm.tags} onChange={(e) => setMediaForm((p) => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma-separated)" className="rounded-lg border px-3 py-2 text-sm" />
                </div>
                <input value={mediaForm.altText} onChange={(e) => setMediaForm((p) => ({ ...p, altText: e.target.value }))} placeholder="Alt text" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={mediaForm.cdnUrl} onChange={(e) => setMediaForm((p) => ({ ...p, cdnUrl: e.target.value }))} placeholder="CDN URL (optional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={mediaForm.cacheControl} onChange={(e) => setMediaForm((p) => ({ ...p, cacheControl: e.target.value }))} placeholder="Cache-Control override (optional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={mediaForm.active} onChange={(e) => setMediaForm((p) => ({ ...p, active: e.target.checked }))} />
                  Active
                </label>
                <button type="submit" disabled={savingMedia} className="w-full rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {savingMedia ? 'Saving...' : mediaFile ? 'Upload Asset' : 'Create Asset'}
                </button>
              </form>

              <div className="mt-4 max-h-[360px] space-y-2 overflow-auto pr-1">
                {mediaAssets.slice(0, 50).map((asset) => (
                  <div key={asset._id} className="rounded-lg border p-2 text-xs">
                    <p className="font-semibold text-[#112211]">{asset.title}</p>
                    <p className="truncate text-gray-600">{asset.url}</p>
                    <p className="text-gray-500">{asset.storageType} | {asset.type} | {asset.active ? 'active' : 'inactive'}</p>
                    <button onClick={() => toggleMediaActive(asset)} disabled={savingMedia} className="mt-2 rounded border border-[#112211] px-2 py-1 font-semibold text-[#112211] disabled:opacity-60">
                      {asset.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {!loading && activeTab === 'marketing' ? (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Coupons & Campaigns</h3>
              <form className="grid grid-cols-1 gap-2 md:grid-cols-2" onSubmit={handleCreateCoupon}>
                <input required value={newCoupon.code} onChange={(e) => setNewCoupon((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="Code" className="rounded-lg border px-3 py-2 text-sm" />
                <select value={newCoupon.discountType} onChange={(e) => setNewCoupon((p) => ({ ...p, discountType: e.target.value as CouponRecord['discountType'] }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="percent">percent</option>
                  <option value="flat">flat</option>
                </select>
                <input required type="number" min={1} value={newCoupon.discountValue} onChange={(e) => setNewCoupon((p) => ({ ...p, discountValue: e.target.value }))} placeholder="Discount value" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="number" min={0} value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon((p) => ({ ...p, maxDiscount: e.target.value }))} placeholder="Max discount" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="number" min={0} value={newCoupon.minOrderAmount} onChange={(e) => setNewCoupon((p) => ({ ...p, minOrderAmount: e.target.value }))} placeholder="Min order amount" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="number" min={1} value={newCoupon.usageLimit} onChange={(e) => setNewCoupon((p) => ({ ...p, usageLimit: e.target.value }))} placeholder="Usage limit" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="datetime-local" value={newCoupon.validFrom} onChange={(e) => setNewCoupon((p) => ({ ...p, validFrom: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                <input type="datetime-local" value={newCoupon.validTill} onChange={(e) => setNewCoupon((p) => ({ ...p, validTill: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                <input value={newCoupon.description} onChange={(e) => setNewCoupon((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="rounded-lg border px-3 py-2 text-sm md:col-span-2" />
                <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
                  <input type="checkbox" checked={newCoupon.active} onChange={(e) => setNewCoupon((p) => ({ ...p, active: e.target.checked }))} />
                  Active
                </label>
                <button type="submit" disabled={savingCoupon} className="rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 md:col-span-2">
                  {savingCoupon ? 'Saving...' : 'Create Coupon'}
                </button>
              </form>

              <div className="mt-4 max-h-[380px] space-y-2 overflow-auto pr-1">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="rounded-lg border p-3 text-sm">
                    <p className="font-semibold text-[#112211]">{coupon.code} | {coupon.discountType} {coupon.discountValue}</p>
                    <p className="text-gray-600">Used {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''} | Min INR {coupon.minOrderAmount}</p>
                    <p className="text-gray-500">{coupon.description || 'No description'}</p>
                    <button onClick={() => toggleCouponActive(coupon)} disabled={savingCoupon} className="mt-2 rounded border border-[#112211] px-2 py-1 text-xs font-semibold text-[#112211] disabled:opacity-60">
                      {coupon.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Referral Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Users with referral code</p>
                  <p className="text-2xl font-bold text-[#112211]">{referralOverview.totalUsersWithReferralCode}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Total referred users</p>
                  <p className="text-2xl font-bold text-[#112211]">{referralOverview.totalReferredUsers}</p>
                </div>
                <div className="rounded-lg border p-3 md:col-span-2">
                  <p className="text-xs text-gray-500">Issued reward coupons</p>
                  <p className="text-2xl font-bold text-[#112211]">{referralOverview.totalRewardsIssued}</p>
                </div>
                <div className="rounded-lg border p-3 md:col-span-2">
                  <p className="text-xs text-gray-500">Redeemed reward coupons</p>
                  <p className="text-2xl font-bold text-[#112211]">{referralOverview.totalRewardsRedeemed}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {referralOverview.topReferrers.length === 0 ? (
                  <p className="text-sm text-gray-600">No referral activity yet.</p>
                ) : (
                  referralOverview.topReferrers.map((item) => (
                    <div key={item.id} className="rounded-lg border p-3 text-sm">
                      <p className="font-semibold text-[#112211]">{item.name}</p>
                      <p className="text-gray-600">{item.email}</p>
                      <p className="text-gray-500">Code: {item.referralCode} | Referrals: {item.referralCount}</p>
                    </div>
                  ))
                )}
              </div>

              <h3 className="mb-3 mt-6 text-xl font-bold text-[#112211]">Campaign Analytics ({marketingAnalytics.periodDays}d)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Coupon bookings</p>
                  <p className="text-2xl font-bold text-[#112211]">{marketingAnalytics.bookingsWithCoupon}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Total discount</p>
                  <p className="text-2xl font-bold text-[#112211]">INR {marketingAnalytics.couponDiscountValue.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Revenue from coupon bookings</p>
                  <p className="text-2xl font-bold text-[#112211]">INR {marketingAnalytics.couponRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Active/Total coupons</p>
                  <p className="text-2xl font-bold text-[#112211]">{marketingAnalytics.activeCoupons}/{marketingAnalytics.totalCoupons}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Reward coupons redeemed</p>
                  <p className="text-2xl font-bold text-[#112211]">{marketingAnalytics.rewardsRedeemed}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">Reward redemption rate</p>
                  <p className="text-2xl font-bold text-[#112211]">{marketingAnalytics.rewardRedemptionRate.toFixed(1)}%</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {marketingAnalytics.topCampaigns.length === 0 ? (
                  <p className="text-sm text-gray-600">No coupon campaign usage yet.</p>
                ) : (
                  marketingAnalytics.topCampaigns.map((campaign) => (
                    <div key={campaign.code} className="rounded-lg border p-3 text-sm">
                      <p className="font-semibold text-[#112211]">{campaign.code}</p>
                      <p className="text-gray-600">Bookings: {campaign.bookings} | Discount: INR {campaign.discount.toLocaleString()}</p>
                      <p className="text-gray-500">Revenue: INR {campaign.revenue.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        ) : null}

        {!loading && activeTab === 'payments' ? (
          <section className="space-y-6">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Payments, Invoices and Refunds</h3>
              <div className="space-y-3">
                {payments.map((payment) => {
                  const refundable = payment.amount - (payment.refundedAmount || 0);
                  return (
                    <div key={payment._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                      <div>
                        <p className="font-semibold text-[#112211]">{payment.payerName}</p>
                        <p className="text-sm text-gray-600">{payment.payerEmail}</p>
                        <p className="text-xs text-gray-500">Invoice: {payment.invoiceNumber || '-'} | Paid: {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-'}</p>
                        <p className="text-xs text-gray-500">Refunded: INR {(payment.refundedAmount || 0).toLocaleString()} | Remaining: INR {Math.max(0, refundable).toLocaleString()}</p>
                      </div>
                      <div className="text-sm text-gray-700">INR {payment.amount.toLocaleString()} | {payment.gateway}</div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'failed' ? 'bg-rose-100 text-rose-700' : payment.status === 'refunded' ? 'bg-blue-100 text-blue-700' : payment.status === 'partially_refunded' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                        }`}>{payment.status}</span>
                        <button onClick={() => viewInvoice(payment)} disabled={busyInvoiceId === payment._id} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                          {busyInvoiceId === payment._id ? 'Loading...' : 'Invoice'}
                        </button>
                        <button onClick={() => downloadInvoicePdf(payment)} disabled={busyInvoiceId === payment._id} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                          {busyInvoiceId === payment._id ? 'Loading...' : 'PDF'}
                        </button>
                        {['paid', 'partially_refunded'].includes(payment.status) && refundable > 0 ? (
                          <button onClick={() => handleRefund(payment)} disabled={busyPaymentId === payment._id} className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                            {busyPaymentId === payment._id ? 'Refunding...' : 'Refund'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {selectedInvoice ? (
              <article className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xl font-bold text-[#112211]">Invoice {selectedInvoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-600">Customer: {selectedInvoice.customer.name} ({selectedInvoice.customer.email})</p>
                <p className="text-sm text-gray-600">Issued: {new Date(selectedInvoice.issuedAt).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Trip: {selectedInvoice.trip?.name || selectedInvoice.booking?.tripName || 'N/A'}</p>
                <p className="mt-2 text-sm text-gray-700">Subtotal: INR {selectedInvoice.totals.subtotal.toLocaleString()} | Refunded: INR {selectedInvoice.totals.refunded.toLocaleString()} | Net Paid: INR {selectedInvoice.totals.netPaid.toLocaleString()}</p>
                <button onClick={() => setSelectedInvoice(null)} className="mt-3 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">
                  Close Invoice
                </button>
              </article>
            ) : null}

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Refund Ledger</h3>
              <div className="space-y-2">
                {refunds.slice(0, 50).map((refund) => (
                  <div key={refund._id} className="rounded-lg border p-3 text-sm">
                    <p className="font-semibold text-[#112211]">INR {refund.amount.toLocaleString()} | {refund.gateway}</p>
                    <p className="text-gray-600">{refund.reason || 'No reason'} | {refund.adminUsername || '-'} | {new Date(refund.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {!loading && activeTab === 'users' ? (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Create Admin User</h3>
              <form className="space-y-3" onSubmit={handleCreateUser}>
                <input required value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} placeholder="Username" className="w-full rounded-lg border px-3 py-2" />
                <input required type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="Password" className="w-full rounded-lg border px-3 py-2" />
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as AdminUserRecord['role'] }))} className="w-full rounded-lg border px-3 py-2">
                  <option value="manager">manager</option>
                  <option value="crm_agent">crm_agent</option>
                  <option value="super_admin">super_admin</option>
                </select>
                <div className="grid grid-cols-1 gap-2 rounded-lg border p-3">
                  {permissionOptions.map((permission) => (
                    <label key={permission} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={newUser.permissions.includes(permission)} onChange={() => togglePermission(permission)} />
                      <span>{permission}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" disabled={savingUser} className="w-full rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingUser ? 'Creating...' : 'Create User'}</button>
              </form>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-[#112211]">Admin Users</h3>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#112211]">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.role} | {user.permissions.length} permissions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => (editingUserId === user.id ? cancelEditUserPermissions() : startEditUserPermissions(user))}
                          className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211]"
                        >
                          {editingUserId === user.id ? 'Cancel Edit' : 'Edit Permissions'}
                        </button>
                        <button onClick={() => toggleUser(user)} className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${user.active ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                          {user.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>

                    {editingUserId === user.id ? (
                      <div className="mt-3 rounded-lg border bg-[#f9fdfb] p-3">
                        <div className="grid grid-cols-1 gap-2">
                          {permissionOptions.map((permission) => (
                            <label key={`${user.id}-${permission}`} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={editingPermissions.includes(permission)}
                                onChange={() => toggleEditingPermission(permission)}
                              />
                              <span>{permission}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => saveUserPermissions(user)}
                            disabled={savingUserId === user.id}
                            className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {savingUserId === user.id ? 'Saving...' : 'Save Permissions'}
                          </button>
                          <button
                            onClick={cancelEditUserPermissions}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {!loading && activeTab === 'audit' ? (
          <section className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xl font-bold text-[#112211]">Audit Logs</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log._id} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold text-[#112211]">{log.action}</p>
                  <p className="text-gray-600">{log.adminUsername || '-'} | {log.role || '-'} | {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
