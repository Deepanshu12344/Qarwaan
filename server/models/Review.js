import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, trim: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    moderationNote: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
