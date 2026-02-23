export type GuideType = 'destination' | 'city' | 'season';

export type GuideArticle = {
  type: GuideType;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  readTimeMinutes: number;
  bestFor: string[];
  highlights: string[];
  faq: string[];
  relatedTripSearch: string;
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    type: 'destination',
    slug: 'dubai',
    title: 'Dubai Trip Guide',
    description: 'Best months, visa basics, family-friendly experiences and budget split for Dubai.',
    heroImage: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=1400',
    readTimeMinutes: 6,
    bestFor: ['Family', 'Couples', 'First-time international travelers'],
    highlights: ['Desert safari planning', 'Downtown + Marina split itinerary', 'Shopping and dining budget strategy'],
    faq: ['Best season: Nov-Mar', 'Average trip length: 4-6 days', 'Ideal for family and couples'],
    relatedTripSearch: 'dubai',
  },
  {
    type: 'destination',
    slug: 'bali',
    title: 'Bali Trip Guide',
    description: 'Plan beaches, temples and island transfers with realistic day-wise pacing.',
    heroImage: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1400',
    readTimeMinutes: 7,
    bestFor: ['Honeymoon', 'Friends group', 'Leisure travelers'],
    highlights: ['South Bali vs Ubud split', 'Water activity buffers', 'Scooter vs private cab decisions'],
    faq: ['Best season: Apr-Oct', 'Average trip length: 5-7 days', 'Ideal for honeymoon and groups'],
    relatedTripSearch: 'bali',
  },
  {
    type: 'city',
    slug: 'srinagar',
    title: 'Srinagar City Guide',
    description: 'Stay options, local transport and practical weather prep for Srinagar itineraries.',
    heroImage: 'https://images.pexels.com/photos/2174656/pexels-photo-2174656.jpeg?auto=compress&cs=tinysrgb&w=1400',
    readTimeMinutes: 5,
    bestFor: ['Nature lovers', 'Family', 'Photographers'],
    highlights: ['Dal Lake and houseboat planning', 'Day trips around city', 'Cold-weather packing essentials'],
    faq: ['Best season: Apr-Jun', 'Average trip length: 3-5 days', 'Ideal for domestic family breaks'],
    relatedTripSearch: 'kashmir',
  },
  {
    type: 'season',
    slug: 'summer',
    title: 'Summer Travel Guide',
    description: 'Compare domestic hill stations and quick international escapes with seasonal pricing tips.',
    heroImage: 'https://images.pexels.com/photos/343720/pexels-photo-343720.jpeg?auto=compress&cs=tinysrgb&w=1400',
    readTimeMinutes: 4,
    bestFor: ['School holidays', 'Group departures', 'Short breaks'],
    highlights: ['Peak-period booking windows', 'Heat-safe itineraries', 'Best-value flight timing'],
    faq: ['Book 30-45 days early', 'Domestic hills sell out first', 'Flexible dates reduce cost'],
    relatedTripSearch: 'summer',
  },
  {
    type: 'season',
    slug: 'winter',
    title: 'Winter Travel Guide',
    description: 'Snow routes, warm destinations and layered packing strategy for winter departures.',
    heroImage: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1400',
    readTimeMinutes: 5,
    bestFor: ['Snow lovers', 'Year-end vacationers', 'Couples'],
    highlights: ['Snow circuit planning', 'Cancellation buffers in peak weather', 'Warm-country alternatives'],
    faq: ['Book flights early for Dec-Jan', 'Monitor weather advisories', 'Layered clothing is essential'],
    relatedTripSearch: 'winter',
  },
];

export function getGuide(type: string, slug: string) {
  return GUIDE_ARTICLES.find((item) => item.type === type && item.slug === slug);
}
