import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Booking } from '../models/Booking.js';
import { Inquiry } from '../models/Inquiry.js';
import { Payment } from '../models/Payment.js';
import { Refund } from '../models/Refund.js';
import { Trip } from '../models/Trip.js';
import { User } from '../models/User.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';
import { Coupon } from '../models/Coupon.js';
import { ReferralReward } from '../models/ReferralReward.js';
import { ADMIN_PERMISSIONS, normalizePermissions } from '../config/adminPermissions.js';
import { requireAdminAuth, requireAdminPermission } from '../middleware/adminAuth.js';
import { createAuditLog } from '../services/auditLogService.js';
import { processDueFollowUps, retryFailedDeliveries } from '../services/crmNotifier.js';
import { createRazorpayRefund, createStripeRefund, isRazorpayConfigured, isStripeConfigured } from '../services/paymentGateway.js';
import { buildInvoiceDocument } from '../services/invoiceService.js';
import { renderInvoicePdf } from '../services/invoicePdfService.js';

const router = express.Router();
const inquiryTimelineFields = ['status', 'crmStage', 'assignedAgent', 'followUpAt', 'followUpNote'];
const bookingTimelineFields = ['bookingStatus', 'crmStage', 'assignedAgent', 'followUpAt', 'followUpNote'];

function getTimelineDiff(previous, incoming, fields) {
  const changes = {};
  fields.forEach((field) => {
    if (!(field in incoming)) return;
    const beforeValue = previous[field];
    const afterValue = incoming[field];
    const beforeSerialized = beforeValue instanceof Date ? beforeValue.toISOString() : beforeValue ?? null;
    const afterSerialized = afterValue instanceof Date ? afterValue.toISOString() : afterValue ?? null;

    if (beforeSerialized !== afterSerialized) {
      changes[field] = { from: beforeSerialized, to: afterSerialized };
    }
  });
  return changes;
}

function buildAdminToken(adminUser) {
  return jwt.sign(
    {
      adminId: adminUser._id,
      username: adminUser.username,
      role: adminUser.role,
    },
    process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'admin_secret',
    { expiresIn: '12h' }
  );
}

router.post('/login', async (request, response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).json({ message: 'username and password are required' });
    }

    const adminUser = await AdminUser.findOne({ username: username.toLowerCase() });
    if (!adminUser || !adminUser.active) {
      return response.status(401).json({ message: 'Invalid admin credentials' });
    }

    const match = await bcrypt.compare(password, adminUser.passwordHash);
    if (!match) {
      return response.status(401).json({ message: 'Invalid admin credentials' });
    }

    adminUser.lastLoginAt = new Date();
    await adminUser.save();

    const token = buildAdminToken(adminUser);
    const permissions = normalizePermissions(adminUser.permissions, adminUser.role);

    await createAuditLog({
      admin: {
        adminId: String(adminUser._id),
        username: adminUser.username,
        role: adminUser.role,
      },
      action: 'admin_login',
      entityType: 'AdminUser',
      entityId: adminUser._id,
      ip: request.ip,
    });

    return response.status(200).json({
      token,
      admin: {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role,
        permissions,
      },
    });
  } catch {
    return response.status(500).json({ message: 'Admin login failed' });
  }
});

router.get('/overview', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_OVERVIEW), async (_request, response) => {
  try {
    const [tripCount, inquiryCount, bookingCount, paymentCount, revenueRows, adminUsers] = await Promise.all([
      Trip.countDocuments(),
      Inquiry.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      AdminUser.countDocuments({ active: true }),
    ]);

    return response.status(200).json({
      overview: {
        tripCount,
        inquiryCount,
        bookingCount,
        paymentCount,
        revenue: revenueRows[0]?.total || 0,
        adminUsers,
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch admin overview' });
  }
});

router.get('/analytics/overview', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_OVERVIEW), async (_request, response) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const funnelEvents = ['trip_view', 'booking_request_submitted', 'payment_initiated', 'payment_success'];

    const [eventCount, uniqueSessionsRows, funnelRows, topEvents, topPages] = await Promise.all([
      AnalyticsEvent.countDocuments({ occurredAt: { $gte: since } }),
      AnalyticsEvent.aggregate([
        { $match: { occurredAt: { $gte: since }, sessionId: { $exists: true, $ne: '' } } },
        { $group: { _id: '$sessionId' } },
        { $count: 'value' },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { occurredAt: { $gte: since }, eventName: { $in: funnelEvents } } },
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { occurredAt: { $gte: since } } },
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { occurredAt: { $gte: since }, pagePath: { $exists: true, $ne: '' } } },
        { $group: { _id: '$pagePath', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const funnel = funnelEvents.map((name) => ({
      event: name,
      count: funnelRows.find((row) => row._id === name)?.count || 0,
    }));

    return response.status(200).json({
      analytics: {
        periodDays: 30,
        totalEvents: eventCount,
        uniqueSessions: uniqueSessionsRows[0]?.value || 0,
        funnel,
        topEvents: topEvents.map((row) => ({ event: row._id, count: row.count })),
        topPages: topPages.map((row) => ({ pagePath: row._id, count: row.count })),
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch analytics overview' });
  }
});

router.get('/referrals/overview', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_OVERVIEW), async (_request, response) => {
  try {
    const [totalUsersWithReferralCode, totalReferredUsers, totalRewardsIssued, totalRewardsRedeemed, topReferrers] = await Promise.all([
      User.countDocuments({ referralCode: { $exists: true, $ne: '' } }),
      User.countDocuments({ referredByCode: { $exists: true, $ne: '' } }),
      ReferralReward.countDocuments({ status: 'issued' }),
      ReferralReward.countDocuments({ status: 'redeemed' }),
      User.find({ referralCode: { $exists: true, $ne: '' }, referralCount: { $gt: 0 } })
        .sort({ referralCount: -1, createdAt: -1 })
        .limit(10)
        .select('name email referralCode referralCount'),
    ]);

    return response.status(200).json({
      referral: {
        totalUsersWithReferralCode,
        totalReferredUsers,
        totalRewardsIssued,
        totalRewardsRedeemed,
        topReferrers: topReferrers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          referralCount: Number(user.referralCount || 0),
        })),
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch referral overview' });
  }
});

router.get('/marketing/analytics', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_OVERVIEW), async (_request, response) => {
  try {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const [
      bookingsWithCoupon,
      couponDiscountValue,
      couponRevenue,
      couponUsageByCode,
      totalCoupons,
      activeCoupons,
      rewardsIssued,
      rewardsRedeemed,
      rewardRedemptionRate,
    ] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: since }, couponCode: { $exists: true, $ne: '' } }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: since }, couponCode: { $exists: true, $ne: '' } } },
        { $group: { _id: null, value: { $sum: { $ifNull: ['$discountAmount', 0] } } } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: since }, couponCode: { $exists: true, $ne: '' } } },
        { $group: { _id: null, value: { $sum: { $ifNull: ['$finalAmount', '$totalAmount'] } } } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: since }, couponCode: { $exists: true, $ne: '' } } },
        { $group: { _id: '$couponCode', bookings: { $sum: 1 }, discount: { $sum: { $ifNull: ['$discountAmount', 0] } }, revenue: { $sum: { $ifNull: ['$finalAmount', '$totalAmount'] } } } },
        { $sort: { bookings: -1 } },
        { $limit: 10 },
      ]),
      Coupon.countDocuments(),
      Coupon.countDocuments({ active: true }),
      ReferralReward.countDocuments({ createdAt: { $gte: since } }),
      ReferralReward.countDocuments({ createdAt: { $gte: since }, status: 'redeemed' }),
      ReferralReward.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            redeemed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'redeemed'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            value: {
              $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$redeemed', '$total'] }, 100] }, 0],
            },
          },
        },
      ]),
    ]);

    return response.status(200).json({
      marketing: {
        periodDays: 90,
        bookingsWithCoupon,
        couponDiscountValue: couponDiscountValue[0]?.value || 0,
        couponRevenue: couponRevenue[0]?.value || 0,
        totalCoupons,
        activeCoupons,
        rewardsIssued,
        rewardsRedeemed,
        rewardRedemptionRate: rewardRedemptionRate[0]?.value || 0,
        topCampaigns: couponUsageByCode.map((row) => ({
          code: row._id,
          bookings: row.bookings,
          discount: row.discount,
          revenue: row.revenue,
        })),
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch marketing analytics' });
  }
});

router.get('/users', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_ADMIN_USERS), async (_request, response) => {
  try {
    const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 });
    return response.status(200).json({ users });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch admin users' });
  }
});

router.post('/users', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_ADMIN_USERS), async (request, response) => {
  try {
    const { username, password, role = 'manager', active = true, permissions = [] } = request.body;

    if (!username || !password) {
      return response.status(400).json({ message: 'username and password are required' });
    }

    const exists = await AdminUser.findOne({ username: username.toLowerCase() });
    if (exists) {
      return response.status(409).json({ message: 'Admin username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await AdminUser.create({
      username: username.toLowerCase(),
      passwordHash,
      role,
      active,
      permissions: normalizePermissions(permissions, role),
    });

    await createAuditLog({
      admin: request.admin,
      action: 'admin_user_create',
      entityType: 'AdminUser',
      entityId: user._id,
      details: { username: user.username, role: user.role, active: user.active, permissions: user.permissions },
      ip: request.ip,
    });

    return response.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        active: user.active,
        permissions: normalizePermissions(user.permissions, user.role),
      },
    });
  } catch {
    return response.status(400).json({ message: 'Failed to create admin user' });
  }
});

router.patch('/users/:id', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_ADMIN_USERS), async (request, response) => {
  try {
    const { role, active, password, permissions } = request.body;
    const updates = {};
    if (role) updates.role = role;
    if (typeof active === 'boolean') updates.active = active;
    if (password) updates.passwordHash = await bcrypt.hash(password, 12);
    if (Array.isArray(permissions)) updates.permissions = normalizePermissions(permissions, role || 'manager');

    const user = await AdminUser.findByIdAndUpdate(request.params.id, updates, { new: true });
    if (!user) {
      return response.status(404).json({ message: 'Admin user not found' });
    }

    await createAuditLog({
      admin: request.admin,
      action: 'admin_user_update',
      entityType: 'AdminUser',
      entityId: user._id,
      details: { role: user.role, active: user.active, permissions: user.permissions },
      ip: request.ip,
    });

    return response.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        active: user.active,
        permissions: normalizePermissions(user.permissions, user.role),
      },
    });
  } catch {
    return response.status(400).json({ message: 'Failed to update admin user' });
  }
});

router.get('/trips', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_TRIPS), async (_request, response) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    return response.status(200).json({ trips });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch trips' });
  }
});

router.post('/trips', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_TRIPS), async (request, response) => {
  try {
    const trip = await Trip.create(request.body);

    await createAuditLog({
      admin: request.admin,
      action: 'trip_create',
      entityType: 'Trip',
      entityId: trip._id,
      details: { name: trip.name, slug: trip.slug },
      ip: request.ip,
    });

    return response.status(201).json({ trip });
  } catch {
    return response.status(400).json({ message: 'Failed to create trip. Check required fields.' });
  }
});

router.patch('/trips/:id', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_TRIPS), async (request, response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    await createAuditLog({
      admin: request.admin,
      action: 'trip_update',
      entityType: 'Trip',
      entityId: trip._id,
      details: request.body,
      ip: request.ip,
    });

    return response.status(200).json({ trip });
  } catch {
    return response.status(400).json({ message: 'Failed to update trip' });
  }
});

router.delete('/trips/:id', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_TRIPS), async (request, response) => {
  try {
    const trip = await Trip.findByIdAndDelete(request.params.id);
    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    await createAuditLog({
      admin: request.admin,
      action: 'trip_delete',
      entityType: 'Trip',
      entityId: trip._id,
      details: { name: trip.name, slug: trip.slug },
      ip: request.ip,
    });

    return response.status(200).json({ message: 'Trip deleted' });
  } catch {
    return response.status(400).json({ message: 'Failed to delete trip' });
  }
});

router.get('/inquiries', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (_request, response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return response.status(200).json({ inquiries });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch inquiries' });
  }
});

router.patch('/inquiries/:id', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (request, response) => {
  try {
    const previous = await Inquiry.findById(request.params.id);
    if (!previous) {
      return response.status(404).json({ message: 'Inquiry not found' });
    }

    const updates = { ...request.body };
    if ('followUpAt' in updates && !updates.followUpAt) {
      updates.followUpAt = null;
    }

    const inquiry = await Inquiry.findByIdAndUpdate(request.params.id, updates, { new: true });
    if (!inquiry) {
      return response.status(404).json({ message: 'Inquiry not found' });
    }
    const changes = getTimelineDiff(previous.toObject(), updates, inquiryTimelineFields);

    await createAuditLog({
      admin: request.admin,
      action: 'inquiry_update',
      entityType: 'Inquiry',
      entityId: inquiry._id,
      details: { updates, changes },
      ip: request.ip,
    });

    return response.status(200).json({ inquiry });
  } catch {
    return response.status(400).json({ message: 'Failed to update inquiry' });
  }
});

router.get('/bookings', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (_request, response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return response.status(200).json({ bookings });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

router.patch('/bookings/:id', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (request, response) => {
  try {
    const previous = await Booking.findById(request.params.id);
    if (!previous) {
      return response.status(404).json({ message: 'Booking not found' });
    }

    const updates = { ...request.body };
    if ('followUpAt' in updates && !updates.followUpAt) {
      updates.followUpAt = null;
    }

    const booking = await Booking.findByIdAndUpdate(request.params.id, updates, { new: true });
    if (!booking) {
      return response.status(404).json({ message: 'Booking not found' });
    }
    const changes = getTimelineDiff(previous.toObject(), updates, bookingTimelineFields);

    await createAuditLog({
      admin: request.admin,
      action: 'booking_update',
      entityType: 'Booking',
      entityId: booking._id,
      details: { updates, changes },
      ip: request.ip,
    });

    return response.status(200).json({ booking });
  } catch {
    return response.status(400).json({ message: 'Failed to update booking' });
  }
});

router.get('/payments', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_PAYMENTS), async (_request, response) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    return response.status(200).json({ payments });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch payments' });
  }
});

router.post('/payments/:id/refund', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.ISSUE_REFUNDS), async (request, response) => {
  try {
    const payment = await Payment.findById(request.params.id);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    if (!['paid', 'partially_refunded'].includes(payment.status)) {
      return response.status(400).json({ message: 'Only paid or partially refunded payments can be refunded' });
    }

    const alreadyRefunded = Number(payment.refundedAmount || 0);
    const refundable = payment.amount - alreadyRefunded;
    if (refundable <= 0) {
      return response.status(400).json({ message: 'No refundable amount left' });
    }

    const requestedAmount = Number(request.body.amount || refundable);
    if (Number.isNaN(requestedAmount) || requestedAmount <= 0) {
      return response.status(400).json({ message: 'Refund amount must be greater than zero' });
    }

    const safeAmount = Math.min(requestedAmount, refundable);
    const nextRefundedAmount = alreadyRefunded + safeAmount;

    if (payment.gateway === 'stripe' && isStripeConfigured()) {
      if (!payment.gatewayPaymentId) {
        return response.status(400).json({ message: 'Stripe payment intent id missing for refund' });
      }

      const refund = await createStripeRefund({
        paymentIntentId: payment.gatewayPaymentId,
        amount: safeAmount,
      });

      payment.gatewayRefundId = refund.id;
      payment.refundedAmount = nextRefundedAmount;
      payment.refundedAt = new Date();
      payment.refundReason = request.body.reason || '';
      payment.status = nextRefundedAmount >= payment.amount ? 'refunded' : 'partially_refunded';
      await payment.save();

      await Refund.create({
        payment: payment._id,
        booking: payment.booking,
        amount: safeAmount,
        currency: payment.currency,
        reason: request.body.reason || '',
        status: 'processed',
        gateway: 'stripe',
        gatewayRefundId: refund.id,
        adminId: request.admin.adminId,
        adminUsername: request.admin.username,
      });
    } else if (payment.gateway === 'razorpay' && isRazorpayConfigured()) {
      if (!payment.gatewayPaymentId) {
        return response.status(400).json({ message: 'Razorpay payment id missing for refund' });
      }

      const refund = await createRazorpayRefund({
        paymentId: payment.gatewayPaymentId,
        amount: Math.round(safeAmount * 100),
      });

      payment.gatewayRefundId = refund.id;
      payment.refundedAmount = nextRefundedAmount;
      payment.refundedAt = new Date();
      payment.refundReason = request.body.reason || '';
      payment.status = nextRefundedAmount >= payment.amount ? 'refunded' : 'partially_refunded';
      await payment.save();

      await Refund.create({
        payment: payment._id,
        booking: payment.booking,
        amount: safeAmount,
        currency: payment.currency,
        reason: request.body.reason || '',
        status: 'processed',
        gateway: 'razorpay',
        gatewayRefundId: refund.id,
        adminId: request.admin.adminId,
        adminUsername: request.admin.username,
      });
    } else {
      payment.refundedAmount = nextRefundedAmount;
      payment.refundedAt = new Date();
      payment.refundReason = request.body.reason || '';
      payment.gatewayRefundId = `mock_refund_${payment._id}_${Date.now()}`;
      payment.status = nextRefundedAmount >= payment.amount ? 'refunded' : 'partially_refunded';
      await payment.save();

      await Refund.create({
        payment: payment._id,
        booking: payment.booking,
        amount: safeAmount,
        currency: payment.currency,
        reason: request.body.reason || '',
        status: 'processed',
        gateway: 'mock',
        gatewayRefundId: payment.gatewayRefundId,
        adminId: request.admin.adminId,
        adminUsername: request.admin.username,
      });
    }

    if (payment.booking && payment.status === 'refunded') {
      await Booking.findByIdAndUpdate(payment.booking, { bookingStatus: 'cancelled' });
    }

    await createAuditLog({
      admin: request.admin,
      action: 'payment_refund',
      entityType: 'Payment',
      entityId: payment._id,
      details: { amount: safeAmount, reason: request.body.reason || '' },
      ip: request.ip,
    });

    return response.status(200).json({ message: 'Refund processed successfully', payment });
  } catch (error) {
    return response.status(500).json({ message: error instanceof Error ? error.message : 'Refund failed' });
  }
});

router.get('/crm/reminders', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (_request, response) => {
  try {
    const now = new Date();
    const [dueInquiries, dueBookings] = await Promise.all([
      Inquiry.find({
        followUpAt: { $lte: now },
        status: { $ne: 'closed' },
        crmStage: { $nin: ['won', 'lost', 'closed'] },
      }).sort({ followUpAt: 1 }),
      Booking.find({
        followUpAt: { $lte: now },
        bookingStatus: { $ne: 'cancelled' },
        crmStage: { $nin: ['completed', 'cancelled'] },
      }).sort({ followUpAt: 1 }),
    ]);

    return response.status(200).json({
      reminders: {
        inquiries: dueInquiries,
        bookings: dueBookings,
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch CRM reminders' });
  }
});

router.get('/payments/:id/invoice', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_PAYMENTS), async (request, response) => {
  try {
    const payment = await Payment.findById(request.params.id);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    const [booking, trip, refunds] = await Promise.all([
      payment.booking ? Booking.findById(payment.booking) : Promise.resolve(null),
      payment.trip ? Trip.findById(payment.trip) : Promise.resolve(null),
      Refund.find({ payment: payment._id }).sort({ createdAt: -1 }),
    ]);

    return response.status(200).json({
      invoice: buildInvoiceDocument({ payment, booking, trip, refunds }),
    });
  } catch {
    return response.status(500).json({ message: 'Failed to generate invoice' });
  }
});

router.get('/payments/:id/invoice.pdf', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_PAYMENTS), async (request, response) => {
  try {
    const payment = await Payment.findById(request.params.id);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    const [booking, trip, refunds] = await Promise.all([
      payment.booking ? Booking.findById(payment.booking) : Promise.resolve(null),
      payment.trip ? Trip.findById(payment.trip) : Promise.resolve(null),
      Refund.find({ payment: payment._id }).sort({ createdAt: -1 }),
    ]);

    const invoice = buildInvoiceDocument({ payment, booking, trip, refunds });
    const pdfBuffer = await renderInvoicePdf(invoice);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    return response.status(200).send(pdfBuffer);
  } catch {
    return response.status(500).json({ message: 'Failed to generate invoice PDF' });
  }
});

router.get('/crm/:entityType/:id/timeline', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.MANAGE_CRM), async (request, response) => {
  try {
    const entityType = request.params.entityType === 'inquiry' ? 'Inquiry' : request.params.entityType === 'booking' ? 'Booking' : '';
    if (!entityType) {
      return response.status(400).json({ message: 'entityType must be inquiry or booking' });
    }

    const logs = await AuditLog.find({ entityType, entityId: request.params.id }).sort({ createdAt: -1 }).limit(200);
    return response.status(200).json({ logs });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch CRM timeline' });
  }
});

router.post('/crm/notify-due', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.TRIGGER_CRM_NOTIFICATIONS), async (request, response) => {
  try {
    const result = await processDueFollowUps();

    await createAuditLog({
      admin: request.admin,
      action: 'crm_notify_due',
      entityType: 'CRM',
      details: result,
      ip: request.ip,
    });

    return response.status(200).json({ message: 'CRM reminder processing completed', result });
  } catch {
    return response.status(500).json({ message: 'Failed to process CRM reminders' });
  }
});

router.post('/crm/retry-failed-webhooks', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.TRIGGER_CRM_NOTIFICATIONS), async (request, response) => {
  try {
    const retried = await retryFailedDeliveries(Number(request.body.limit || 100));
    await createAuditLog({
      admin: request.admin,
      action: 'crm_retry_failed_webhooks',
      entityType: 'CRM',
      details: { retried },
      ip: request.ip,
    });
    return response.status(200).json({ message: 'Failed webhooks queued for retry', retried });
  } catch {
    return response.status(500).json({ message: 'Failed to retry failed webhooks' });
  }
});

router.get('/refunds', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_PAYMENTS), async (_request, response) => {
  try {
    const refunds = await Refund.find().sort({ createdAt: -1 }).limit(500);
    return response.status(200).json({ refunds });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch refunds' });
  }
});

router.get('/audit-logs', requireAdminAuth, requireAdminPermission(ADMIN_PERMISSIONS.VIEW_AUDIT_LOGS), async (_request, response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    return response.status(200).json({ logs });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

export default router;
