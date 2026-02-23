import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    seasons: { type: [String], default: [] },
    durationDays: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 1 },
    category: { type: String, required: true, enum: ['Domestic', 'International'] },
    groupType: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 4.6 },
    reviewCount: { type: Number, required: true, min: 0, default: 10 },
    heroImage: { type: String, required: true, trim: true },
    gallery: { type: [String], default: [] },
    overview: { type: String, required: true, trim: true },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    availableMonths: { type: [String], default: [] },
    availability: {
      type: [
        {
          date: { type: String, trim: true },
          seatsLeft: { type: Number, min: 0, default: 0 },
          status: { type: String, enum: ['open', 'waitlist', 'closed'], default: 'open' },
        },
      ],
      default: [],
    },
    blackoutDates: { type: [String], default: [] },
    itinerary: { type: [itinerarySchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Trip = mongoose.model('Trip', tripSchema);
