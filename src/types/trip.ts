export type Trip = {
  _id: string;
  name: string;
  slug: string;
  location: string;
  durationDays: number;
  nights: number;
  category: 'Domestic' | 'International';
  groupType: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviewCount: number;
  heroImage: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  availableMonths: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  featured: boolean;
};

export type TripsQuery = {
  days?: number;
  category?: 'Domestic' | 'International';
  featured?: boolean;
  search?: string;
  sort?: 'priceLow' | 'priceHigh' | 'rating';
};

export type InquiryPayload = {
  tripSlug?: string;
  tripName?: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  travelMonth?: string;
  durationDays?: number;
  travelers: number;
  budget?: number;
  notes?: string;
};

export type BookingPayload = {
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  specialRequest?: string;
};
