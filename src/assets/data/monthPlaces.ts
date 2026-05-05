export type MonthPlaceDestination = {
  title: string;
  region: string;
  description: string;
  image?: string;
  ctaLabel?: string;
};

export type MonthPlaceHighlight = {
  title: string;
  label: string;
  description: string;
  image: string;
};

export type MonthPlacesData = {
  month: string;
  slug: string;
  order: number;
  heroImage: string;
  tagline: string;
  introTitle: string;
  introBody: string;
  introHeadline?: string;
  introParagraphs?: string[];
  introCtaLabel?: string;
  stats: { label: string; value: string }[];
  featuredDestination?: {
    title: string;
    description: string;
    ctaLabel?: string;
  };
  destinations: MonthPlaceDestination[];
  highlights: MonthPlaceHighlight[];
  ctaBand?: {
    title: string;
    body: string;
    ctaLabel?: string;
  };
  experiencesIntro?: {
    title: string;
    body: string;
  };
  experiences?: {
    title: string;
    subtitle?: string;
    nights?: string;
    image: string;
    ctaLabel?: string;
  }[];
  gallery: string[];
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
