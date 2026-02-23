import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    tripName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    travelers: { type: Number, required: true, min: 1 },
    travelDate: { type: String, required: true, trim: true },
    specialRequest: { type: String, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    couponCode: { type: String, trim: true },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, min: 0 },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    crmStage: {
      type: String,
      enum: ['new', 'follow_up', 'docs_pending', 'payment_pending', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    assignedAgent: { type: String, trim: true },
    followUpAt: { type: Date },
    followUpNote: { type: String, trim: true },
    followUpQueuedAt: { type: Date },
    followUpNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
