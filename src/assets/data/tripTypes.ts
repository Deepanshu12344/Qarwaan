export type ItineraryCard = {
  day: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  keyAttractions?: string[];
  hiddenGems?: string[];
  activities?: string[];
  localFood?: string[];
  localExperience?: string[];
  festivals?: string[];
  stayType?: string;
  accessibility?: string;
  themes?: string[];
};

export type ItinerarySection = {
  id: string;
  label: string;
  intro: string;
  daysLabel: string;
  cards: ItineraryCard[];
};

export type RestItem = {
  name: string;
  description: string;
  image: string;
  ctaLabel: string;
};

export type KeyExperience = {
  title: string;
  image?: string;
};

export type TripFacts = {
  keyExperienceDetails?: Array<{
    title: string;
    description: string;
    images: string[];
  }>;
  packageName?: string;
  duration?: string;
  citiesCovered?: string[];
  startPoint?: string;
  endPoint?: string;
  bestSeason?: string;
  idealFor?: string[];
  tripType?: string;
  whyThisTrip?: string[];
  keyExperiences?: Array<string | KeyExperience>;
};

export type TripData = {
  slug?: string;
  title: string;
  description: string;
  image: string;
  nights?: string;
  location?: string;
  featured?: boolean;
  hero?: {
    title?: string;
    subtitle?: string;
    image?: string;
  };
  overview?: string;
  stats?: {
    when?: string;
    price?: string;
    duration?: string;
  };
  tripFacts?: TripFacts;
  itinerary?: ItinerarySection[];
  midCarousel?: string[];
  restYourHead?: {
    title: string;
    items: RestItem[];
    ctaLabel: string;
  };
  introGallery?: {
    bigSquare: string;
    wideRect: string;
    stackedTop: string;
    stackedBottom: string;
  };
  similarTrips?: string[];
};

export type TripCard = Pick<TripData, 'title' | 'description' | 'image' | 'location' | 'slug'>;
