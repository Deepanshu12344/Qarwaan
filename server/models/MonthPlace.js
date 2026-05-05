import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
  },
  { _id: false },
);

const destinationSchema = new mongoose.Schema(
  {
    title: String,
    region: String,
    description: String,
    image: String,
    ctaLabel: String,
  },
  { _id: false },
);

const highlightSchema = new mongoose.Schema(
  {
    title: String,
    label: String,
    description: String,
    image: String,
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    nights: String,
    image: String,
    ctaLabel: String,
  },
  { _id: false },
);

const monthPlaceSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    slug: { type: String, required: true, index: true, unique: true },
    order: { type: Number, required: true },
    heroImage: String,
    tagline: String,
    introTitle: String,
    introBody: String,
    introHeadline: String,
    introParagraphs: [String],
    introCtaLabel: String,
    stats: [statSchema],
    featuredDestination: {
      title: String,
      description: String,
      ctaLabel: String,
    },
    destinations: [destinationSchema],
    highlights: [highlightSchema],
    ctaBand: {
      title: String,
      body: String,
      ctaLabel: String,
    },
    experiencesIntro: {
      title: String,
      body: String,
    },
    experiences: [experienceSchema],
    gallery: [String],
  },
  { timestamps: true },
);

const MonthPlace =
  mongoose.models.MonthPlace || mongoose.model('MonthPlace', monthPlaceSchema);

export default MonthPlace;
