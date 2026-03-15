import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';

type TripFinderCard = {
  title: string;
  description: string;
  image: string;
  nights: string;
  location: string;
};

const allTrips: TripFinderCard[] = [
  {
    title: 'Rome, Florence & Puglia',
    description: 'A luxury family Italy holiday with artisan stays.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    nights: '8 Nights',
    location: 'Italy',
  },
  {
    title: 'Athens, Mykonos & Crete',
    description: 'A luxury family discovery in Greece.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    nights: '7 Nights',
    location: 'Greece',
  },
  {
    title: 'Australia Ultimate Family Adventure',
    description: 'Coastal drives, reef moments, and outback horizons.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
    nights: '10 Nights',
    location: 'Australia',
  },
  {
    title: 'Cambodia & Laos Discovery',
    description: 'A journey across temples, rivers, and markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    nights: '9 Nights',
    location: 'Cambodia',
  },
  {
    title: 'A Journey into Greece',
    description: 'Island light, ancient streets, and blue dawns.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '9 Nights',
    location: 'Greece',
  },
  {
    title: 'Pacuare to Papagayo',
    description: 'Luxury conservation adventure in Costa Rica.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    nights: '9 Nights',
    location: 'Costa Rica',
  },
  {
    title: 'Wyoming: Yellowstone & Grand Teton',
    description: 'Ranch stays, waterfalls, and wide-open skies.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    nights: '6 Nights',
    location: 'USA',
  },
  {
    title: 'Lofoten Islands',
    description: 'Ski and sail beneath the northern lights.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60',
    nights: '7 Nights',
    location: 'Norway',
  },
  {
    title: 'Portugal Coastal Hideaway',
    description: 'Surf towns, vineyards, and Atlantic light.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    nights: '5 Nights',
    location: 'Portugal',
  },
  {
    title: 'Sicily Slow Journey',
    description: 'Markets, sea breezes, and culinary streets.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    nights: '8 Nights',
    location: 'Italy',
  },
  {
    title: 'Japan: Kyoto to Naoshima',
    description: 'Temple mornings and contemporary art islands.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '10 Nights',
    location: 'Japan',
  },
  {
    title: 'Morocco Desert & Atlas',
    description: 'Riads, rose valleys, and desert stargazing.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    nights: '7 Nights',
    location: 'Morocco',
  },
  {
    title: 'Peru Sacred Valley',
    description: 'Rail journeys, mountain lodges, and Inca light.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    nights: '9 Nights',
    location: 'Peru',
  },
  {
    title: 'Iceland Coastal Circuit',
    description: 'Glacial lagoons and volcanic coastlines.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    nights: '6 Nights',
    location: 'Iceland',
  },
  {
    title: 'Thailand Islands & Temples',
    description: 'Hidden coves and temple mornings.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Thailand',
  },
  {
    title: 'South Africa Safari',
    description: 'Wildlife lodges and vineyard afternoons.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    nights: '9 Nights',
    location: 'South Africa',
  },
  {
    title: 'Patagonia Edge',
    description: 'Wind-swept hikes and glacier viewpoints.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Chile',
  },
  {
    title: 'Canadian Rockies',
    description: 'Lakeside lodges and mountain rail journeys.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Canada',
  },
  {
    title: 'Bali Culture & Coast',
    description: 'Temple trails and cliffside pools.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Indonesia',
  },
  {
    title: 'Amalfi & Capri Escape',
    description: 'Terraced lemon groves and sea-view villas.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    nights: '5 Nights',
    location: 'Italy',
  },
  {
    title: 'California Coastline',
    description: 'Big Sur drives and coastal hideaways.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    nights: '6 Nights',
    location: 'USA',
  },
  {
    title: 'Dubai to Oman',
    description: 'City lights to desert canyons.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'UAE',
  },
  {
    title: 'Sri Lanka Tea Trails',
    description: 'Hill country estates and coastal villas.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '9 Nights',
    location: 'Sri Lanka',
  },
  {
    title: 'New Zealand North to South',
    description: 'Fiords, vineyards, and alpine escapes.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '12 Nights',
    location: 'New Zealand',
  },
  {
    title: 'Swiss Alps Retreat',
    description: 'Mountain railways and lakeside walks.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Switzerland',
  },
  {
    title: 'Egypt Nile Voyage',
    description: 'Temple dawns and river sunsets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Egypt',
  },
  {
    title: 'Spain: Andalusian Circuit',
    description: 'Courtyards, flamenco, and coastal retreats.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Spain',
  },
  {
    title: 'Vietnam Heritage Route',
    description: 'Lantern towns, limestone bays, and street markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Vietnam',
  },
  {
    title: 'Turkey Aegean Coast',
    description: 'Bodrum bays, whitewashed villages, and ruins.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Turkey',
  },
  {
    title: 'Brazil Atlantic Escape',
    description: 'Rainforest hikes and beachside hideaways.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Brazil',
  },
  {
    title: 'India Rajasthan Circuit',
    description: 'Palaces, desert forts, and market lanes.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '9 Nights',
    location: 'India',
  },
  {
    title: 'Jordan Petra & Wadi Rum',
    description: 'Canyon light and desert nights.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Jordan',
  },
  {
    title: 'Tanzania Safari',
    description: 'Serengeti plains and crater lodges.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Tanzania',
  },
  {
    title: 'Mexico Yucatan',
    description: 'Cenotes, haciendas, and coastal stays.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Mexico',
  },
  {
    title: 'Scotland Highlands',
    description: 'Lochs, whisky lodges, and castle stays.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Scotland',
  },
  {
    title: 'Croatia Island Hop',
    description: 'Stone towns and Adriatic coves.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Croatia',
  },
  {
    title: 'Austria Alpine Summer',
    description: 'Mountain lakes and chalet walks.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Austria',
  },
  {
    title: 'Kenya Coast & Safari',
    description: 'Savannah mornings and Swahili coast.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Kenya',
  },
  {
    title: 'Portugal Douro Valley',
    description: 'River cruises and vineyard estates.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Portugal',
  },
  {
    title: 'Argentina Wine Trails',
    description: 'Andes-backed vineyards and city stays.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Argentina',
  },
  {
    title: 'Maldives Overwater',
    description: 'Turquoise lagoons and quiet mornings.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Maldives',
  },
  {
    title: 'Nepal Himalaya',
    description: 'Mountain lodges and valley temples.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Nepal',
  },
  {
    title: 'Greece Ionian Coast',
    description: 'Clifftop villas and island paths.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Greece',
  },
  {
    title: 'USA New England',
    description: 'Seaside towns and autumn drives.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'USA',
  },
  {
    title: 'Chile Atacama',
    description: 'Salt flats, stargazing, and desert dawns.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Chile',
  },
  {
    title: 'Indonesia Komodo',
    description: 'Island sailing and coral reefs.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Indonesia',
  },
  {
    title: 'France Provence',
    description: 'Lavender fields and countryside markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'France',
  },
  {
    title: 'Ireland Coastal Trail',
    description: 'Clifftop walks and historic villages.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Ireland',
  },
  {
    title: 'Norway Fjord Route',
    description: 'Waterfall valleys and scenic rail.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Norway',
  },
  {
    title: 'Bhutan Cultural Escape',
    description: 'Monasteries, mountain paths, and valleys.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Bhutan',
  },
  {
    title: 'Zanzibar Beach Week',
    description: 'Spice markets and ocean villas.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Tanzania',
  },
  {
    title: 'Japan Hokkaido',
    description: 'Snow towns and hot spring stays.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Japan',
  },
  {
    title: 'USA Desert Southwest',
    description: 'Canyon hikes and desert resorts.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'USA',
  },
  {
    title: 'Greece Peloponnese',
    description: 'Olive groves and seaside villages.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Lake District',
    description: 'Lakeside villas and alpine drives.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Italy',
  },
  {
    title: 'Morocco Atlantic Coast',
    description: 'Seafront riads and medina lanes.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Morocco',
  },
  {
    title: 'Croatia Dubrovnik',
    description: 'Stone walls and Adriatic sunsets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Croatia',
  },
  {
    title: 'Mexico Pacific Coast',
    description: 'Surf retreats and beachfront stays.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Mexico',
  },
  {
    title: 'South Korea Seoul & Coast',
    description: 'City energy and coastal calm.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'South Korea',
  },
  {
    title: 'Oman Desert & Coast',
    description: 'Canyons, dunes, and calm bays.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Oman',
  },
  {
    title: 'Philippines Island Escape',
    description: 'Lagoon cruises and white sand coves.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Philippines',
  },
  {
    title: 'France Riviera',
    description: 'Coastal glamour and harbor towns.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'France',
  },
  {
    title: 'USA Pacific Northwest',
    description: 'Forest lodges and coastal trails.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'USA',
  },
  {
    title: 'Greece Santorini',
    description: 'Cliffside suites and sunset cruises.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Tuscany',
    description: 'Vineyard estates and countryside markets.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Italy',
  },
  {
    title: 'Morocco Marrakech',
    description: 'Palaces, spice routes, and desert dusk.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Morocco',
  },
  {
    title: 'Portugal Lisbon & Coast',
    description: 'City streets and seaside stays.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Portugal',
  },
  {
    title: 'Norway Arctic Circle',
    description: 'Aurora nights and fjord cruises.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '8 Nights',
    location: 'Norway',
  },
  {
    title: 'Australia Great Barrier',
    description: 'Reef lagoons and coastal islands.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Australia',
  },
  {
    title: 'Canada East Coast',
    description: 'Harbor towns and rugged cliffs.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Canada',
  },
  {
    title: 'Iceland Northern Ring',
    description: 'Glacial drives and geothermal pools.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Iceland',
  },
  {
    title: 'Sweden Archipelago',
    description: 'Island hopping and coastal cabins.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Sweden',
  },
  {
    title: 'Greece Crete',
    description: 'Mountain villages and seaside tavernas.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Amalfi Drive',
    description: 'Coastal roads and cliffside stays.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Italy',
  },
  {
    title: 'Thailand Chiang Mai',
    description: 'Mountain temples and slow markets.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Thailand',
  },
  {
    title: 'Peru Amazon Lodge',
    description: 'River stays and rainforest trails.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Peru',
  },
  {
    title: 'Japan Okinawa',
    description: 'Island beaches and coral lagoons.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Japan',
  },
  {
    title: 'USA Florida Keys',
    description: 'Island drives and coral reefs.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'USA',
  },
  {
    title: 'Morocco Sahara',
    description: 'Dune camps and desert dawns.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Morocco',
  },
  {
    title: 'France Loire Valley',
    description: 'Chateaux stays and vineyard lanes.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'France',
  },
  {
    title: 'Greece Rhodes',
    description: 'Medieval lanes and coastal bays.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Sicily Coast',
    description: 'Volcanic shores and ancient towns.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Italy',
  },
  {
    title: 'Iceland South Coast',
    description: 'Black sands and waterfall trails.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Iceland',
  },
  {
    title: 'India Kerala Backwaters',
    description: 'Houseboats and palm-lined canals.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'India',
  },
  {
    title: 'Spain Mallorca',
    description: 'Island coves and village stays.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Spain',
  },
  {
    title: 'Japan Hakone',
    description: 'Lake views and onsen mornings.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Japan',
  },
  {
    title: 'USA Napa Valley',
    description: 'Vineyard tastings and boutique stays.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'USA',
  },
  {
    title: 'Portugal Azores',
    description: 'Volcanic islands and coastal hikes.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Portugal',
  },
  {
    title: 'Canada Pacific Coast',
    description: 'Rainforest lodges and harbor towns.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Canada',
  },
  {
    title: 'Greece Paros',
    description: 'Cycladic lanes and harbor sunsets.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Cinque Terre',
    description: 'Coastal trails and seaside inns.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Italy',
  },
  {
    title: 'Iceland Golden Circle',
    description: 'Geothermal sites and glacier views.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Iceland',
  },
  {
    title: 'Spain Barcelona',
    description: 'Architecture walks and coastal nights.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Spain',
  },
  {
    title: 'Thailand Phuket',
    description: 'Beachfront resorts and island tours.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Thailand',
  },
  {
    title: 'Peru Lake Titicaca',
    description: 'Highland villages and lake cruises.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Peru',
  },
  {
    title: 'Morocco Essaouira',
    description: 'Coastal winds and artisan markets.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Morocco',
  },
  {
    title: 'Japan Tokyo & Alps',
    description: 'City energy and mountain escapes.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '7 Nights',
    location: 'Japan',
  },
  {
    title: 'USA Colorado Peaks',
    description: 'Highland trails and lodge stays.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'USA',
  },
  {
    title: 'Italy Dolomites',
    description: 'Alpine lakes and scenic drives.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Italy',
  },
  {
    title: 'Greece Naxos',
    description: 'Island villages and beach coves.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Greece',
  },
  {
    title: 'Spain Seville & Cordoba',
    description: 'Courtyards, orange blossoms, and tapas.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Spain',
  },
  {
    title: 'France Bordeaux',
    description: 'Wine estates and riverside towns.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'France',
  },
  {
    title: 'Thailand Krabi',
    description: 'Limestone bays and beach villas.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Thailand',
  },
  {
    title: 'Peru Cusco & Sacred Valley',
    description: 'Inca trails and mountain lodges.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Peru',
  },
  {
    title: 'Morocco Atlas & Kasbahs',
    description: 'Valley hikes and kasbah stays.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Morocco',
  },
  {
    title: 'Portugal Algarve',
    description: 'Cliffside beaches and coastal towns.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Portugal',
  },
  {
    title: 'Iceland Westfjords',
    description: 'Remote fjords and coastal trails.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Iceland',
  },
  {
    title: 'Canada Rockies East',
    description: 'Mountain lakes and alpine rail.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Canada',
  },
  {
    title: 'USA Utah Parks',
    description: 'Red rock canyons and desert skies.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'USA',
  },
  {
    title: 'Japan Kanazawa',
    description: 'Samurai districts and gardens.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Japan',
  },
  {
    title: 'Greece Milos',
    description: 'White coves and island light.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Umbria',
    description: 'Hill towns and olive estates.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Italy',
  },
  {
    title: 'Spain Valencia',
    description: 'City markets and coastal walks.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Spain',
  },
  {
    title: 'France Normandy',
    description: 'Coastal villages and countryside inns.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'France',
  },
  {
    title: 'Thailand Koh Samui',
    description: 'Island calm and beach retreats.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Thailand',
  },
  {
    title: 'Peru Colca Canyon',
    description: 'Highland valleys and lodge stays.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Peru',
  },
  {
    title: 'Morocco Fez & Chefchaouen',
    description: 'Old medinas and blue lanes.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Morocco',
  },
  {
    title: 'Portugal Madeira',
    description: 'Levada walks and ocean views.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Portugal',
  },
  {
    title: 'Iceland Highlands',
    description: 'Remote tracks and geothermal valleys.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '6 Nights',
    location: 'Iceland',
  },
  {
    title: 'Canada Jasper',
    description: 'Pine forests and glacier lakes.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'Canada',
  },
  {
    title: 'USA Arizona',
    description: 'Desert resorts and canyon light.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'USA',
  },
  {
    title: 'Japan Nikko',
    description: 'Shrines, lakes, and forested trails.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Japan',
  },
  {
    title: 'Greece Corfu',
    description: 'Emerald coves and harbor towns.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Venice & Lagoons',
    description: 'Canals, islands, and art walks.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Italy',
  },
  {
    title: 'Spain Madrid & Toledo',
    description: 'Royal streets and historic lanes.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Spain',
  },
  {
    title: 'France Lyon & Alps',
    description: 'Gastronomy and alpine villages.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '5 Nights',
    location: 'France',
  },
  {
    title: 'Thailand Bangkok & River',
    description: 'Riverside stays and market lanes.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Thailand',
  },
  {
    title: 'Peru Lima & Coast',
    description: 'Coastal drives and city stays.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Peru',
  },
  {
    title: 'Morocco Tangier',
    description: 'Port city and coastal cafes.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Morocco',
  },
  {
    title: 'Portugal Porto',
    description: 'Riverside stays and tiled streets.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Portugal',
  },
  {
    title: 'Iceland Reykjavik',
    description: 'City stays and geothermal escapes.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Iceland',
  },
  {
    title: 'Canada Banff',
    description: 'Mountain towns and lake views.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Canada',
  },
  {
    title: 'USA Chicago',
    description: 'City skyline and lakeside walks.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'USA',
  },
  {
    title: 'Japan Osaka',
    description: 'Food streets and castle parks.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Japan',
  },
  {
    title: 'Greece Thessaloniki',
    description: 'Waterfront strolls and heritage sites.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Greece',
  },
  {
    title: 'Italy Milan & Lakes',
    description: 'City style and lake retreats.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70',
    nights: '4 Nights',
    location: 'Italy',
  },
];

const filterGroups = ['Feeling', 'Destination', 'When', 'Who', 'Duration', 'Experience'];
const BATCH_SIZE = 9;

function TripFinderCard({ trip }: { trip: TripFinderCard }) {
  return (
    <article className="group relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-700"
        style={{ backgroundImage: `url(${trip.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90 group-hover:via-black/50" />
      <div className="relative flex h-[500px] flex-col justify-between p-6 text-white">
        <div className="flex justify-end">
          <span className="border border-white/60 bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
            {trip.nights}
          </span>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/70">{trip.location}</p>
          <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] transition-transform duration-300 group-hover:-translate-y-2">
            {trip.title}
          </h3>
          <p className="max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
            {trip.description}
          </p>
          <button className="mt-3 border border-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-white hover:text-black">
            Explore Trip
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TripFinderPage() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleTrips = useMemo(() => allTrips.slice(0, visibleCount), [visibleCount]);
  const hasMore = visibleCount < allTrips.length;

  useSeo({
    title: 'Trip Finder | Qarwaan',
    description: 'Discover curated journeys with Qarwaan Trip Finder.',
    path: '/trip-finder',
  });

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    let timeoutId: number | undefined;
    let isFetching = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetching) {
          isFetching = true;
          setLoading(true);
          timeoutId = window.setTimeout(() => {
            setVisibleCount((count) => Math.min(count + BATCH_SIZE, allTrips.length));
            setLoading(false);
            isFetching = false;
          }, 650);
        }
      },
      { rootMargin: '240px', threshold: 0.1 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasMore]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="light" />
      <main className="pt-24">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-16 text-center">
            <h1 className="text-4xl font-semibold uppercase tracking-[0.18em] text-black md:text-6xl">
              Trip Finder
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-black/60">
              We&apos;ve found <span className="font-semibold text-black">376</span> experiences for you
            </p>
          </div>
        </section>

        <section className="border-b border-black/5">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-5 text-[0.65rem] uppercase tracking-[0.25em] text-black/85">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-3 text-black"
            >
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 text-black/85">
              <label htmlFor="sort-by" className="text-[0.6rem] uppercase tracking-[0.3em] text-black/70">
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sort-by"
                  className="appearance-none border border-black/20 bg-white px-4 py-2 pr-10 text-[0.65rem] uppercase tracking-[0.25em] text-black/85"
                  defaultValue="price-asc"
                >
                  <option value="price-asc">Price (ASC)</option>
                  <option value="price-desc">Price (DESC)</option>
                  <option value="duration-asc">Duration (ASC)</option>
                  <option value="duration-desc">Duration (DESC)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/70" />
              </div>
            </div>
            <button type="button" className="ml-auto text-black/85">
              Clear All
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 pb-16 pt-8">
          <div className={`grid gap-8 ${showFilters ? 'lg:grid-cols-[260px_1fr]' : 'grid-cols-1'}`}>
            {showFilters ? (
              <aside className="space-y-3">
                <div className="rounded-sm border border-black/10 bg-white">
                  {filterGroups.map((group, index) => (
                    <button
                      key={group}
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-4 text-[0.65rem] uppercase tracking-[0.25em] text-black/70 ${
                        index !== filterGroups.length - 1 ? 'border-b border-black/5' : ''
                      }`}
                    >
                      <span>{group}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </aside>
            ) : null}

            <div>
              <div
                className={`grid gap-6 ${
                  showFilters ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {visibleTrips.map((trip) => (
                  <TripFinderCard key={`${trip.title}-${trip.location}`} trip={trip} />
                ))}
              </div>

              <div ref={sentinelRef} className="py-10 text-center text-sm uppercase tracking-[0.25em] text-black/50">
                {loading ? 'Loading...' : hasMore ? '' : 'All trips loaded'}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
