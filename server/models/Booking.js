import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    tripName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    travelers: { type: Number, required: true, min: 1 },
    travelDate: { type: String, required: true, trim: true },
    specialRequest: { type: String, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
