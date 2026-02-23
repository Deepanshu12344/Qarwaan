import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR', trim: true },
    reason: { type: String, trim: true },
    status: { type: String, enum: ['processed', 'failed'], default: 'processed' },
    gateway: { type: String, enum: ['stripe', 'razorpay', 'mock'], default: 'mock' },
    gatewayRefundId: { type: String, trim: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    adminUsername: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Refund = mongoose.model('Refund', refundSchema);
