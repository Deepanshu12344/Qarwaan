import type { Trip } from './trip';

export type AdminOverview = {
  tripCount: number;
  inquiryCount: number;
  bookingCount: number;
  paymentCount: number;
  revenue: number;
  adminUsers: number;
};

export type InquiryRecord = {
  _id: string;
  tripName?: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  durationDays?: number;
  status: 'new' | 'contacted' | 'closed';
  crmStage: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'closed';
  assignedAgent?: string;
  followUpAt?: string;
  followUpNote?: string;
  createdAt: string;
};

export type BookingRecord = {
  _id: string;
  tripName: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  totalAmount: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled';
  crmStage: 'new' | 'follow_up' | 'docs_pending' | 'payment_pending' | 'confirmed' | 'completed' | 'cancelled';
  assignedAgent?: string;
  followUpAt?: string;
  followUpNote?: string;
  createdAt: string;
};

export type PaymentRecord = {
  _id: string;
  payerName: string;
  payerEmail: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'razorpay' | 'mock';
  status: 'created' | 'paid' | 'partially_refunded' | 'failed' | 'refunded';
  invoiceNumber?: string;
  paidAt?: string;
  refundedAmount?: number;
  refundedAt?: string;
  refundReason?: string;
  createdAt: string;
};

export type PaymentInvoiceRecord = {
  invoiceNumber: string;
  issuedAt: string;
  status: PaymentRecord['status'];
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  trip: null | {
    id: string;
    name: string;
    slug: string;
    location: string;
  };
  booking: null | {
    id: string;
    tripName: string;
    travelers: number;
    travelDate: string;
    bookingStatus: BookingRecord['bookingStatus'];
  };
  lineItems: Array<{
    label: string;
    amount: number;
  }>;
  totals: {
    subtotal: number;
    refunded: number;
    netPaid: number;
  };
  refunds: Array<{
    id: string;
    amount: number;
    reason: string;
    status: RefundRecord['status'];
    createdAt: string;
  }>;
};

export type AdminUserRecord = {
  id: string;
  username: string;
  role: 'super_admin' | 'manager' | 'crm_agent';
  active: boolean;
  permissions: string[];
};

export type AuditLogRecord = {
  _id: string;
  adminUsername?: string;
  role?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

export type RefundRecord = {
  _id: string;
  payment: string;
  booking?: string;
  amount: number;
  currency: string;
  reason?: string;
  status: 'processed' | 'failed';
  gateway: 'stripe' | 'razorpay' | 'mock';
  gatewayRefundId?: string;
  adminUsername?: string;
  createdAt: string;
};

export type AdminDashboardPayload = {
  overview: AdminOverview;
  trips: Trip[];
  inquiries: InquiryRecord[];
  bookings: BookingRecord[];
  payments: PaymentRecord[];
};

export type MediaAssetRecord = {
  _id: string;
  title: string;
  storageType: 'url' | 'upload';
  url: string;
  optimizedUrl?: string;
  cdnUrl?: string;
  cacheControl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  type: 'hero' | 'gallery' | 'banner' | 'logo';
  altText?: string;
  tags: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminAnalyticsOverview = {
  periodDays: number;
  totalEvents: number;
  uniqueSessions: number;
  funnel: Array<{ event: string; count: number }>;
  topEvents: Array<{ event: string; count: number }>;
  topPages: Array<{ pagePath: string; count: number }>;
};

export type CouponRecord = {
  _id: string;
  code: string;
  description?: string;
  discountType: 'flat' | 'percent';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  validFrom?: string;
  validTill?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminReferralOverview = {
  totalUsersWithReferralCode: number;
  totalReferredUsers: number;
  totalRewardsIssued: number;
  totalRewardsRedeemed: number;
  topReferrers: Array<{
    id: string;
    name: string;
    email: string;
    referralCode: string;
    referralCount: number;
  }>;
};

export type AdminMarketingAnalytics = {
  periodDays: number;
  bookingsWithCoupon: number;
  couponDiscountValue: number;
  couponRevenue: number;
  totalCoupons: number;
  activeCoupons: number;
  rewardsIssued: number;
  rewardsRedeemed: number;
  rewardRedemptionRate: number;
  topCampaigns: Array<{
    code: string;
    bookings: number;
    discount: number;
    revenue: number;
  }>;
};
