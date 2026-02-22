import { Trip } from '../models/Trip.js';

const TRIP_SEED = [
  {
    name: 'Kashmir Valley Escape',
    slug: 'kashmir-valley-escape',
    location: 'Srinagar, Gulmarg, Pahalgam',
    durationDays: 4,
    nights: 3,
    category: 'Domestic',
    groupType: 'Family Friendly',
    price: 32999,
    discountedPrice: 29999,
    rating: 4.8,
    reviewCount: 186,
    heroImage:
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    overview:
      'A 4-day scenic escape through Kashmir with shikara rides, mountain viewpoints, and curated local food experiences.',
    highlights: ['Dal Lake sunset ride', 'Gondola in Gulmarg', 'Guided old-city walk'],
    inclusions: ['Airport transfers', '3 nights stay', 'Breakfast + dinner', 'Local guide'],
    exclusions: ['Flight/train tickets', 'Personal shopping', 'Adventure add-ons'],
    availableMonths: ['March', 'April', 'May', 'June', 'September', 'October'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Srinagar Local',
        description: 'Pickup, check-in, evening shikara ride and lakeside dinner.',
      },
      {
        day: 2,
        title: 'Gulmarg Day Tour',
        description: 'Cable car experience, meadow walks, return to Srinagar.',
      },
      {
        day: 3,
        title: 'Pahalgam Excursion',
        description: 'Valley drive, riverside picnic spots, local market time.',
      },
      {
        day: 4,
        title: 'Breakfast and Departure',
        description: 'Morning free time, assisted checkout, airport drop.',
      },
    ],
    featured: true,
  },
  {
    name: 'Dubai Weekend Plus',
    slug: 'dubai-weekend-plus',
    location: 'Dubai, UAE',
    durationDays: 5,
    nights: 4,
    category: 'International',
    groupType: 'Couples and Friends',
    price: 58999,
    discountedPrice: 54999,
    rating: 4.7,
    reviewCount: 142,
    heroImage:
      'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    overview:
      'A 5-day high-energy city trip with desert safari, marina cruise, iconic skyline visits, and curated shopping stops.',
    highlights: ['Desert safari', 'Burj Khalifa entry', 'Dhow cruise dinner'],
    inclusions: ['Visa assistance', '4 nights stay', 'Airport transfer', 'Daily breakfast'],
    exclusions: ['Flight tickets', 'Travel insurance', 'Personal expenses'],
    availableMonths: ['October', 'November', 'December', 'January', 'February'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Marina Walk',
        description: 'Airport pickup, check-in, guided evening walk around marina.',
      },
      {
        day: 2,
        title: 'City Landmarks',
        description: 'Museum of the Future, Dubai Mall, Burj Khalifa.',
      },
      {
        day: 3,
        title: 'Desert Safari',
        description: 'Dune bashing, camp dinner and cultural performances.',
      },
      {
        day: 4,
        title: 'Leisure and Shopping',
        description: 'Flexible day for beach or shopping with coordinator support.',
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Breakfast and transfer for return travel.',
      },
    ],
    featured: true,
  },
  {
    name: 'Thailand Island Trails',
    slug: 'thailand-island-trails',
    location: 'Phuket, Krabi, Phi Phi',
    durationDays: 7,
    nights: 6,
    category: 'International',
    groupType: 'Young Travelers',
    price: 79999,
    discountedPrice: 73999,
    rating: 4.9,
    reviewCount: 224,
    heroImage:
      'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    overview:
      'A 7-day tropical circuit across Thailand islands with speedboat tours, nightlife options, and free beach days.',
    highlights: ['Phi Phi speedboat tour', 'Krabi four-island hop', 'Night market food walk'],
    inclusions: ['Internal transfers', '6 nights stay', 'Breakfast', 'Island tour tickets'],
    exclusions: ['International flights', 'Snorkeling gear rentals', 'Visa fees'],
    availableMonths: ['November', 'December', 'January', 'February', 'March'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Phuket',
        description: 'Hotel check-in and evening old town orientation.',
      },
      {
        day: 2,
        title: 'Phi Phi Islands',
        description: 'Full-day boat tour with lunch and snorkeling halts.',
      },
      {
        day: 3,
        title: 'Transfer to Krabi',
        description: 'Road transfer and evening leisure in Ao Nang.',
      },
      {
        day: 4,
        title: 'Krabi Island Tour',
        description: 'Visit key islands and beach activities.',
      },
      {
        day: 5,
        title: 'Free Exploration',
        description: 'Optional excursions and local cafes.',
      },
      {
        day: 6,
        title: 'Return to Phuket',
        description: 'Transfer back and final shopping time.',
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Checkout and airport transfer support.',
      },
    ],
    featured: true,
  },
  {
    name: 'Rajasthan Royal Circuit',
    slug: 'rajasthan-royal-circuit',
    location: 'Jaipur, Jodhpur, Udaipur',
    durationDays: 5,
    nights: 4,
    category: 'Domestic',
    groupType: 'Culture Lovers',
    price: 38999,
    discountedPrice: 35999,
    rating: 4.6,
    reviewCount: 108,
    heroImage:
      'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/2413613/pexels-photo-2413613.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/10580198/pexels-photo-10580198.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    overview:
      'A heritage-rich 5-day Rajasthan itinerary combining forts, palaces, local cuisine, and curated cultural evenings.',
    highlights: ['Amber Fort tour', 'Blue city walk', 'Lake Pichola boat ride'],
    inclusions: ['AC transfers', '4 nights stay', 'Breakfast', 'Monument tickets'],
    exclusions: ['Airfare', 'Lunch and dinner', 'Personal purchases'],
    availableMonths: ['September', 'October', 'November', 'December', 'January', 'February'],
    itinerary: [
      { day: 1, title: 'Jaipur Arrival', description: 'Check-in and local bazaar exploration.' },
      { day: 2, title: 'Jaipur Heritage Tour', description: 'Forts, city palace and local cuisine.' },
      { day: 3, title: 'Transfer to Jodhpur', description: 'Road journey and evening stepwell visit.' },
      { day: 4, title: 'Udaipur Exploration', description: 'Transfer to Udaipur and sunset boating.' },
      { day: 5, title: 'Departure', description: 'Breakfast and return transfer.' },
    ],
    featured: false,
  },
  {
    name: 'Kerala Backwater Calm',
    slug: 'kerala-backwater-calm',
    location: 'Cochin, Munnar, Alleppey',
    durationDays: 7,
    nights: 6,
    category: 'Domestic',
    groupType: 'Honeymoon and Family',
    price: 46999,
    discountedPrice: 42999,
    rating: 4.8,
    reviewCount: 156,
    heroImage:
      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1631665/pexels-photo-1631665.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    overview:
      'A balanced 7-day Kerala journey with hill stations, tea gardens, and a serene houseboat overnight experience.',
    highlights: ['Munnar tea estate visit', 'Alleppey houseboat', 'Kathakali evening show'],
    inclusions: ['Private car', '6 nights stay', 'Daily breakfast', 'Houseboat dinner'],
    exclusions: ['Airfare', 'Extra adventure activities', 'Insurance'],
    availableMonths: ['August', 'September', 'October', 'November', 'December', 'January'],
    itinerary: [
      { day: 1, title: 'Arrive Cochin', description: 'Airport pickup and city check-in.' },
      { day: 2, title: 'Drive to Munnar', description: 'Scenic transfer via waterfalls and spice gardens.' },
      { day: 3, title: 'Munnar Full Day', description: 'Tea museum and viewpoints.' },
      { day: 4, title: 'Transfer to Thekkady', description: 'Wildlife and spice trail exploration.' },
      { day: 5, title: 'Move to Alleppey', description: 'Houseboat check-in and backwater cruise.' },
      { day: 6, title: 'Leisure Day', description: 'Village walk and beach sunset.' },
      { day: 7, title: 'Departure', description: 'Return transfer and checkout.' },
    ],
    featured: true,
  },
];

export async function seedTripsIfNeeded() {
  const tripCount = await Trip.countDocuments();

  if (tripCount > 0) {
    return;
  }

  await Trip.insertMany(TRIP_SEED);
  console.log('Seeded trips data');
}
