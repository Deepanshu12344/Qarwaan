import mongoose from 'mongoose';

const referralRewardSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referralCode: { type: String, trim: true, required: true, index: true },
    rewardType: { type: String, enum: ['coupon'], default: 'coupon' },
    couponCode: { type: String, trim: true, required: true },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    rewardValue: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ['issued', 'redeemed', 'expired'], default: 'issued', index: true },
    redeemedAt: { type: Date },
    redeemedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    redeemedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const ReferralReward = mongoose.model('ReferralReward', referralRewardSchema);
