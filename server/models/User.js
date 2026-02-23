import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    preferredCurrency: { type: String, default: 'INR', trim: true },
    preferredLanguage: { type: String, default: 'en', trim: true },
    referralCode: { type: String, trim: true },
    referredByCode: { type: String, trim: true },
    referralCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
