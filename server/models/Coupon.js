import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ['flat', 'percent'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    minOrderAmount: { type: Number, min: 0, default: 0 },
    active: { type: Boolean, default: true },
    validFrom: { type: Date },
    validTill: { type: Date },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
