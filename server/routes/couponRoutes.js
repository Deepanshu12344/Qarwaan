import express from 'express';
import { Coupon } from '../models/Coupon.js';
import { requireAdminAuth, requireAdminPermission } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/validate', async (request, response) => {
  try {
    const { code, orderAmount } = request.body;
    if (!code || !orderAmount) {
      return response.status(400).json({ message: 'code and orderAmount are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return response.status(404).json({ message: 'Coupon not found or inactive' });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return response.status(400).json({ message: 'Coupon is not active yet' });
    }
    if (coupon.validTill && now > coupon.validTill) {
      return response.status(400).json({ message: 'Coupon expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return response.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (orderAmount < coupon.minOrderAmount) {
      return response.status(400).json({ message: `Minimum order amount is ${coupon.minOrderAmount}` });
    }

    let discount = coupon.discountType === 'percent'
      ? (Number(orderAmount) * coupon.discountValue) / 100
      : coupon.discountValue;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    const finalAmount = Math.max(0, Number(orderAmount) - discount);

    return response.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
      finalAmount,
    });
  } catch {
    return response.status(500).json({ message: 'Failed to validate coupon' });
  }
});

router.get('/admin', requireAdminAuth, requireAdminPermission('manage_trips'), async (_request, response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return response.status(200).json({ coupons });
});

router.post('/admin', requireAdminAuth, requireAdminPermission('manage_trips'), async (request, response) => {
  try {
    const coupon = await Coupon.create(request.body);
    return response.status(201).json({ coupon });
  } catch {
    return response.status(400).json({ message: 'Failed to create coupon' });
  }
});

router.patch('/admin/:id', requireAdminAuth, requireAdminPermission('manage_trips'), async (request, response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!coupon) {
      return response.status(404).json({ message: 'Coupon not found' });
    }
    return response.status(200).json({ coupon });
  } catch {
    return response.status(400).json({ message: 'Failed to update coupon' });
  }
});

export default router;
