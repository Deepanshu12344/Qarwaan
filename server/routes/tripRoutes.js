import express from 'express';
import jwt from 'jsonwebtoken';
import { Booking } from '../models/Booking.js';
import { Coupon } from '../models/Coupon.js';
import { Inquiry } from '../models/Inquiry.js';
import { ReferralReward } from '../models/ReferralReward.js';
import { Trip } from '../models/Trip.js';
import { createAuditLog } from '../services/auditLogService.js';

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/', async (request, response) => {
  try {
    const { days, category, featured, search, sort } = request.query;
    const filters = {};

    if (days) {
      const parsedDays = Number(days);
      if (!Number.isNaN(parsedDays) && parsedDays > 0) {
        filters.durationDays = parsedDays;
      }
    }

    if (category) {
      filters.category = category;
    }

    if (featured === 'true') {
      filters.featured = true;
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortBy = { createdAt: -1 };
    if (sort === 'priceLow') sortBy = { discountedPrice: 1, price: 1 };
    if (sort === 'priceHigh') sortBy = { discountedPrice: -1, price: -1 };
    if (sort === 'rating') sortBy = { rating: -1, reviewCount: -1 };

    const trips = await Trip.find(filters).sort(sortBy);
    return response.status(200).json({ trips });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to fetch trips' });
  }
});

router.get('/:slug', async (request, response) => {
  try {
    const { slug } = request.params;
    const trip = await Trip.findOne({ slug });

    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    return response.status(200).json({ trip });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to fetch trip details' });
  }
});

router.post('/inquiries', async (request, response) => {
  try {
    const {
      tripSlug,
      tripName,
      fullName,
      email,
      phone,
      city,
      travelMonth,
      durationDays,
      travelers,
      budget,
      notes,
    } = request.body;

    if (!fullName || !email || !phone || !travelers) {
      return response.status(400).json({
        message: 'fullName, email, phone, and travelers are required',
      });
    }

    if (!isValidEmail(email)) {
      return response.status(400).json({ message: 'Please provide a valid email address' });
    }

    let tripId;
    let resolvedTripName = tripName;

    if (tripSlug) {
      const trip = await Trip.findOne({ slug: tripSlug });
      if (trip) {
        tripId = trip._id;
        resolvedTripName = trip.name;
      }
    }

    const inquiry = await Inquiry.create({
      trip: tripId,
      tripName: resolvedTripName,
      fullName,
      email,
      phone,
      city,
      travelMonth,
      durationDays,
      travelers,
      budget,
      notes,
    });

    await createAuditLog({
      action: 'inquiry_created',
      entityType: 'Inquiry',
      entityId: inquiry._id,
      details: {
        fullName: inquiry.fullName,
        email: inquiry.email,
        travelers: inquiry.travelers,
        tripName: inquiry.tripName || '',
      },
      ip: request.ip,
    });

    return response.status(201).json({
      message: 'Inquiry submitted. Our team will contact you shortly.',
      inquiryId: inquiry._id,
    });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to submit inquiry' });
  }
});

router.post('/:slug/bookings', async (request, response) => {
  try {
    const { slug } = request.params;
    const { fullName, email, phone, travelers, travelDate, specialRequest, couponCode } = request.body;

    if (!fullName || !email || !phone || !travelers || !travelDate) {
      return response.status(400).json({
        message: 'fullName, email, phone, travelers, and travelDate are required',
      });
    }

    if (!isValidEmail(email)) {
      return response.status(400).json({ message: 'Please provide a valid email address' });
    }

    const trip = await Trip.findOne({ slug });

    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    const effectivePrice = trip.discountedPrice || trip.price;
    const totalAmount = effectivePrice * Number(travelers);
    let discountAmount = 0;
    let finalAmount = totalAmount;
    let normalizedCouponCode = '';
    let couponApplied = false;

    if (couponCode) {
      normalizedCouponCode = String(couponCode).toUpperCase().trim();
      const coupon = await Coupon.findOne({ code: normalizedCouponCode, active: true });
      if (coupon) {
        const now = new Date();
        const inValidWindow =
          (!coupon.validFrom || now >= coupon.validFrom) &&
          (!coupon.validTill || now <= coupon.validTill) &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);
        if (inValidWindow && totalAmount >= coupon.minOrderAmount) {
          discountAmount = coupon.discountType === 'percent'
            ? (totalAmount * coupon.discountValue) / 100
            : coupon.discountValue;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
          finalAmount = Math.max(0, totalAmount - discountAmount);
          coupon.usedCount += 1;
          await coupon.save();
          couponApplied = true;
        }
      }
    }

    let userId;
    const authHeader = request.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
        userId = payload.userId;
      } catch {
        // continue without binding user
      }
    }

    const booking = await Booking.create({
      user: userId,
      trip: trip._id,
      tripName: trip.name,
      fullName,
      email,
      phone,
      travelers,
      travelDate,
      specialRequest,
      totalAmount,
      couponCode: normalizedCouponCode || undefined,
      discountAmount,
      finalAmount,
    });

    if (couponApplied && normalizedCouponCode) {
      const reward = await ReferralReward.findOne({
        couponCode: normalizedCouponCode,
        status: 'issued',
      }).sort({ createdAt: 1 });

      if (reward) {
        reward.status = 'redeemed';
        reward.redeemedAt = new Date();
        reward.redeemedBooking = booking._id;
        if (userId) reward.redeemedByUser = userId;
        await reward.save();
      }
    }

    await createAuditLog({
      action: 'booking_created',
      entityType: 'Booking',
      entityId: booking._id,
      details: {
        fullName: booking.fullName,
        email: booking.email,
        travelers: booking.travelers,
        tripName: booking.tripName,
        totalAmount: booking.totalAmount,
        discountAmount: booking.discountAmount,
        finalAmount: booking.finalAmount,
      },
      ip: request.ip,
    });

    return response.status(201).json({
      message: 'Booking request submitted. We will confirm shortly.',
      bookingId: booking._id,
      totalAmount: finalAmount,
      rawTotalAmount: totalAmount,
      discountAmount,
    });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to create booking' });
  }
});

export default router;
