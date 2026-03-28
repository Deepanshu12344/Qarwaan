export type ItineraryCard = {
  day: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
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
