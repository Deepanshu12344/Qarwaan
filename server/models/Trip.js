import mongoose from 'mongoose';

const itineraryCardSchema = new mongoose.Schema(
  {
    day: String,
    title: String,
    description: String,
    image: String,
    images: [String],
    keyAttractions: [String],
    hiddenGems: [String],
    activities: [String],
    localFood: [String],
    localExperience: [String],
    festivals: [String],
    stayType: String,
    accessibility: String,
    themes: [String],
  },
  { _id: false },
);

const itinerarySectionSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    intro: String,
    daysLabel: String,
    cards: [itineraryCardSchema],
  },
  { _id: false },
);

const restItemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    image: String,
    ctaLabel: String,
  },
  { _id: false },
);

const keyExperienceSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
  },
  { _id: false },
);

const keyExperienceDetailSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    images: [String],
  },
  { _id: false },
);

const tripSchema = new mongoose.Schema(
  {
    slug: { type: String, index: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    nights: String,
    location: String,
    featured: Boolean,
    hero: {
      title: String,
      subtitle: String,
      image: String,
    },
    overview: String,
    stats: {
      when: String,
      price: String,
      duration: String,
    },
    tripFacts: {
      packageName: String,
      duration: String,
      citiesCovered: [String],
      startPoint: String,
      endPoint: String,
      bestSeason: String,
      idealFor: [String],
      tripType: String,
      whyThisTrip: [String],
      keyExperienceDetails: [keyExperienceDetailSchema],
      keyExperiences: [keyExperienceSchema],
    },
    itinerary: [itinerarySectionSchema],
    midCarousel: [String],
    restYourHead: {
      title: String,
      items: [restItemSchema],
      ctaLabel: String,
    },
    introGallery: {
      bigSquare: String,
      wideRect: String,
      stackedTop: String,
      stackedBottom: String,
    },
    similarTrips: [String],
  },
  { timestamps: true },
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

export default Trip;
