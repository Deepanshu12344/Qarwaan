import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    payerName: { type: String, required: true, trim: true },
    payerEmail: { type: String, required: true, trim: true, lowercase: true },
    payerPhone: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR', trim: true },
    gateway: { type: String, enum: ['stripe', 'razorpay', 'mock'], default: 'mock' },
    gatewayOrderId: { type: String, trim: true },
    gatewayPaymentId: { type: String, trim: true },
    gatewaySignature: { type: String, trim: true },
    status: {
      type: String,
      enum: ['created', 'paid', 'partially_refunded', 'failed', 'refunded'],
      default: 'created',
    },
    paidAt: { type: Date },
    invoiceNumber: { type: String, trim: true, unique: true, sparse: true },
    refundedAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date },
    refundReason: { type: String, trim: true },
    gatewayRefundId: { type: String, trim: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
