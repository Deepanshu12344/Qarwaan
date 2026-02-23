export type ItineraryCategory = 'hotel' | 'activity' | 'transfer' | 'addon';
export type PricingModel = 'per_person' | 'per_booking' | 'per_night_room';

export type ItineraryCatalogItem = {
  id: string;
  title: string;
  category: ItineraryCategory;
  pricingModel: PricingModel;
  baseAdultPrice: number;
  childPriceFactor?: number;
  weekendSurcharge?: number;
  seasonalMultipliers?: Partial<Record<number, number>>;
  notes?: string;
};

export const ITINERARY_CATALOG: ItineraryCatalogItem[] = [
  {
    id: 'htl4',
    title: '4-star city hotel stay',
    category: 'hotel',
    pricingModel: 'per_night_room',
    baseAdultPrice: 5200,
    seasonalMultipliers: { 10: 1.2, 11: 1.25, 0: 1.3 },
    notes: 'Price per room-night. Room occupancy assumed double sharing.',
  },
  {
    id: 'htl5',
    title: '5-star premium hotel stay',
    category: 'hotel',
    pricingModel: 'per_night_room',
    baseAdultPrice: 9800,
    seasonalMultipliers: { 10: 1.25, 11: 1.3, 0: 1.35 },
    notes: 'Price per room-night. Includes breakfast.',
  },
  {
    id: 'act_city',
    title: 'Guided city tour',
    category: 'activity',
    pricingModel: 'per_person',
    baseAdultPrice: 2200,
    childPriceFactor: 0.75,
    weekendSurcharge: 250,
  },
  {
    id: 'act_desert',
    title: 'Desert safari with dinner',
    category: 'activity',
    pricingModel: 'per_person',
    baseAdultPrice: 3400,
    childPriceFactor: 0.65,
    weekendSurcharge: 300,
  },
  {
    id: 'trf_airport',
    title: 'Airport transfer (private)',
    category: 'transfer',
    pricingModel: 'per_booking',
    baseAdultPrice: 1800,
    weekendSurcharge: 200,
  },
  {
    id: 'trf_intercity',
    title: 'Intercity transfer (private cab)',
    category: 'transfer',
    pricingModel: 'per_booking',
    baseAdultPrice: 4200,
  },
  {
    id: 'add_visa',
    title: 'Visa assistance and documentation',
    category: 'addon',
    pricingModel: 'per_person',
    baseAdultPrice: 1300,
    childPriceFactor: 1,
  },
  {
    id: 'add_insurance',
    title: 'Travel insurance',
    category: 'addon',
    pricingModel: 'per_person',
    baseAdultPrice: 900,
    childPriceFactor: 0.8,
  },
];
