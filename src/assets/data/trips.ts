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
        images: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        ],
          },
          {
            day: 'Day 2',
            title: 'Of Shrines and Skyscrapers',
            description:
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
        images: [
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
        ],
          },
          {
            day: 'Day 3',
            title: 'A Taste of Tokyo',
            description:
              "Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.",
            image:
              'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
          },
          {
            day: 'Day 4',
            title: 'Sumo and Izakaya',
            description:
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
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
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
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
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
            image:
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 7',
            title: 'Time for Tea',
            description:
              "Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.",
            image:
              'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 8',
            title: 'Eat Till You Drop',
            description:
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
            image:
              'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
          },
          {
            day: 'Day 9',
            title: 'Mountains and Rice',
            description:
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
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
              'Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.Wander through historic districts, then rise above the skyline. A curated tasting closes the evening.',
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
    introGallery: {
      bigSquare:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      wideRect:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80',
      stackedTop:
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      stackedBottom:
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
  title: 'Italy',
  description: 'Renaissance cities, coastal escapes, and timeless cuisine.',
  image:
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=80',
  nights: '10 Nights',
  location: 'Italy',
  featured: true,

  hero: {
    title: 'A Journey Through Italy',
    subtitle: 'For art, wine, and sunlit coastlines',
    image:
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=2000&q=80',
  },

  overview:
    'Italy is a living museum where art, history, and food blend effortlessly. From grand cities to quiet countryside and dramatic coastlines, every moment feels cinematic.',

  stats: {
    when: 'April to June / September to October',
    price: '12000',
    duration: '10 nights ideal length',
  },

  itinerary: [
    {
      id: 'rome',
      label: 'Rome',
      intro:
        'The Eternal City where ancient ruins meet vibrant street life and unforgettable cuisine.',
      daysLabel: 'Days 1-3',
      cards: [
        {
          day: 'Day 1',
          title: 'Arrival in Rome',
          description:
            'Arrive and settle into your hotel. Spend the evening strolling through piazzas and enjoying your first Italian dinner.',
          images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
          ],
        },
        {
          day: 'Day 2',
          title: 'Ancient Wonders',
          description:
            'Explore the Colosseum, Roman Forum, and Palatine Hill. End your day with a guided food walk through Trastevere.',
          images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
          ],
        },
        {
          day: 'Day 3',
          title: 'Vatican & Culture',
          description:
            'Visit the Vatican Museums, Sistine Chapel, and St. Peter’s Basilica before enjoying a relaxed evening.',
          image:
            'https://images.unsplash.com/photo-1508108712903-49b7ef9b1df8?auto=format&fit=crop&w=1200&q=80',
        },
      ],
    },

    {
      id: 'florence',
      label: 'Florence',
      intro:
        'The heart of the Renaissance, filled with art, architecture, and Tuscan charm.',
      daysLabel: 'Days 4-6',
      cards: [
        {
          day: 'Day 4',
          title: 'Into Tuscany',
          description:
            'Travel to Florence and explore the Duomo, historic streets, and riverside views.',
          image:
            'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
        },
        {
          day: 'Day 5',
          title: 'Art & Galleries',
          description:
            'Visit the Uffizi Gallery and Accademia to witness masterpieces of the Renaissance.',
          image:
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        },
        {
          day: 'Day 6',
          title: 'Tuscan Countryside',
          description:
            'Enjoy a day trip through vineyards and rolling hills with wine tastings and local cuisine.',
          image:
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        },
      ],
    },

    {
      id: 'venice',
      label: 'Venice',
      intro:
        'A city of canals, romance, and timeless beauty floating on water.',
      daysLabel: 'Days 7-8',
      cards: [
        {
          day: 'Day 7',
          title: 'Canals & Gondolas',
          description:
            'Arrive in Venice and explore its canals, bridges, and hidden alleys.',
          image:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        },
        {
          day: 'Day 8',
          title: 'Islands of Venice',
          description:
            'Visit Murano and Burano, known for glassmaking and colorful houses.',
          image:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        },
      ],
    },

    {
      id: 'amalfi',
      label: 'Amalfi Coast',
      intro:
        'Cliffside villages, turquoise waters, and breathtaking coastal drives.',
      daysLabel: 'Days 9-10',
      cards: [
        {
          day: 'Day 9',
          title: 'Coastal Escape',
          description:
            'Arrive at the Amalfi Coast and relax with stunning sea views and charming villages.',
          image:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        },
        {
          day: 'Day 10',
          title: 'Positano & Beyond',
          description:
            'Explore Positano and enjoy your final Italian sunset before departure.',
          image:
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
        },
      ],
    },
  ],

  midCarousel: [
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  ],

  restYourHead: {
    title: 'Where To Rest Your Head',
    items: [
      {
        name: 'Hotel Eden, Rome',
        description:
          'Luxury stay with panoramic city views and timeless Italian elegance.',
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'View Hotel',
      },
      {
        name: 'Belmond Hotel Caruso, Amalfi',
        description:
          'Cliffside luxury overlooking the Mediterranean with infinity pool views.',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'View Hotel',
      },
      {
        name: 'Gritti Palace, Venice',
        description:
          'Historic canal-side palace offering a truly Venetian experience.',
        image:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'View Hotel',
      },
    ],
    ctaLabel: 'View All',
  },
  introGallery: {
    bigSquare:
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1400&q=80',
    wideRect:
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1800&q=80',
    stackedTop:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    stackedBottom:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
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
