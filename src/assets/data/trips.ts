export type ItineraryCard = {
  day: string;
  title: string;
  description: string;
  image: string;
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
  similarTrips?: string[];
};

export type TripCard = Pick<TripData, 'title' | 'description' | 'image' | 'location'>;


export const trips: TripData[] = [

  
  {
    title: 'Japan',
    description: 'Temple towns, alpine hot springs, and modern edge.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    nights: '10 Nights',
    location: 'Japan',
    featured: true,
    hero: {
      title: 'A Journey Into Japan',
      subtitle: 'For tea, temples, and lakeside onsens',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
    },
    overview:
      'Japan with its 3,000 tightly packed islands is a study in contrasts. This journey blends high-tech streets with timeless rituals and quiet gardens.',
    stats: {
      when: 'March to May / October to November',
      price: '10000',
      duration: '10 nights ideal length',
    },
    itinerary: [
      {
        id: 'tokyo-1',
        label: 'Tokyo',
        intro:
          'A sleepless metropolis of neighborhoods and hidden lanes. Expect neon, temples, and the quiet corners that locals keep close.',
        daysLabel: 'Days 1-4',
        cards: [
          {
            day: 'Day 1',
            title: 'Amid the Bustle',
            description:
              'Arrive in the capital and settle into a refined stay. Tonight, a private guide introduces the city after dark.',
            image:
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          },
          {
            day: 'Day 2',
            title: 'Of Shrines and Skyscrapers',
            description:
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
            image:
              'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
          },
          {
            day: 'Day 3',
            title: 'A Taste of Tokyo',
            description:
              "Morning markets, chef-led tastings, and the craftsmanship behind Japan's most iconic flavors.",
            image:
              'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
          },
          {
            day: 'Day 4',
            title: 'Sumo and Izakaya',
            description:
              'Behind-the-scenes access and a night of intimate izakaya experiences in Ebisu.',
            image:
              'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
          },
        ],
      },
      {
        id: 'kanazawa',
        label: 'Kanazawa',
        intro:
          'Serene and traditional, Kanazawa blends historic craft with coastal elegance and garden quiet.',
        daysLabel: 'Day 5',
        cards: [
          {
            day: 'Day 5',
            title: 'A Touch of Zen',
            description:
              'Gold leaf workshops, gardens, and a ryokan retreat set the pace for the night.',
            image:
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
          },
        ],
      },
      {
        id: 'kyoto',
        label: 'Kyoto',
        intro:
          'The city of temples and tea houses. A tranquil chapter filled with gardens, ceremonies, and lantern-lit streets.',
        daysLabel: 'Days 6-9',
        cards: [
          {
            day: 'Day 6',
            title: 'Old Streets, New Stories',
            description:
              'Begin with heritage lanes, followed by curated cultural encounters and evening walks.',
            image:
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 7',
            title: 'Time for Tea',
            description:
              "A private tea ceremony introduces the etiquette and art behind Kyoto's traditions.",
            image:
              'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 8',
            title: 'Eat Till You Drop',
            description:
              'Nishiki Market, hidden eateries, and an evening of bold flavors across the city.',
            image:
              'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 9',
            title: 'Mountains and Rice',
            description:
              'A gentle countryside escape with farm-to-table moments and panoramic viewpoints.',
            image:
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
          },
        ],
      },
      {
        id: 'tokyo-2',
        label: 'Tokyo',
        intro: 'Return for a final chapter of city lights and a graceful farewell.',
        daysLabel: 'Days 10-11',
        cards: [
          {
            day: 'Day 10',
            title: 'All Roads Lead to Ramen',
            description:
              'A final night in the capital, defined by a curated ramen crawl and skyline views.',
            image:
              'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 11',
            title: 'Farewell, For Now',
            description:
              'Depart with time to linger and a closing taste of Tokyo before the journey home.',
            image:
              'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
          },
        ],
      },
    ],
    midCarousel: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=70',
    ],
    restYourHead: {
      title: 'Where To Rest Your Head',
      items: [
        {
          name: 'Palazzo Venart, Venice',
          description:
            'Refined and noble, Palazzo Venart is everything a stay in Venice should be, with landscaped gardens and canal views.',
          image:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          ctaLabel: 'View Hotel',
        },
        {
          name: 'Hotel Lungarno, Florence',
          description:
            'Classical elegance, art-filled interiors, and Arno River views from a chic city base.',
          image:
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
          ctaLabel: 'View Hotel',
        },
        {
          name: 'Villa Spalletti Trivelli, Rome',
          description:
            'A historic residence in the heart of the Eternal City with serene terraces and refined suites.',
          image:
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
          ctaLabel: 'View Hotel',
        },
      ],
      ctaLabel: 'View All',
    },
  },
  {
    title: 'Italy',
    description: 'Lake stays, vineyard tables, and art-filled mornings.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    nights: '8 Nights',
    location: 'Italy',
    featured: true,
    stats: {
      price: '8000',
    },
  },
  {
    title: 'Morocco',
    description: 'Riads, desert light, and aromatic markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    nights: '7 Nights',
    location: 'Morocco',
    featured: true,
    stats: {
      price: '7000',
    },
  },
  {
    title: 'Peru',
    description: 'Sacred valleys, rail journeys, and rare landscapes.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=900&q=80',
    nights: '9 Nights',
    location: 'Peru',
    featured: true,
    stats: {
      price: '9000',
    },
  },
  {
    title: 'Iceland',
    description: 'Volcanic coasts, glacial lagoons, and northern light.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    nights: '6 Nights',
    location: 'Iceland',
    featured: true,
    stats: {
      price: '6000',
    },
  },
  {
    title: 'Greece',
    description: 'Cycladic cliffs, island tastings, and blue-white calm.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    nights: '7 Nights',
    location: 'Greece',
    featured: true,
    stats: {
      price: '7000',
    },
  },
  {
    title: 'Thailand',
    description: 'Hidden coves, spice markets, and temple mornings.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    nights: '8 Nights',
    location: 'Thailand',
    featured: true,
    stats: {
      price: '8000',
    },
  },

  {
    title: 'Rome, Florence & Puglia',
    description: 'A luxury family Italy holiday with artisan stays.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    nights: '8 Nights',
    location: 'Italy',
    stats: {
      price: '8000',
    },
  },
  {
    title: 'Athens, Mykonos & Crete',
    description: 'A luxury family discovery in Greece.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    nights: '7 Nights',
    location: 'Greece',
    stats: {
      price: '7000',
    },
  },
  {
    title: 'Australia Ultimate Family Adventure',
    description: 'Coastal drives, reef moments, and outback horizons.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
    nights: '10 Nights',
    location: 'Australia',
    stats: {
      price: '10000',
    },
  },
  {
    title: 'Cambodia & Laos Discovery',
    description: 'A journey across temples, rivers, and markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    nights: '9 Nights',
    location: 'Cambodia',
    stats: {
      price: '9000',
    },
  }];
