const monthNames = [
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

const heroImages = [
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
];

const destinationPool = [
  {
    title: 'Jaipur',
    region: 'Rajasthan',
    description: 'Pink-hued palaces, artisan bazaars, and soft winter light.',
    image:
      'https://images.unsplash.com/photo-1529253355930-8d2f2c9fdc3b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Udaipur',
    region: 'Rajasthan',
    description: 'Lakeside stays and heritage walks with cool evening breezes.',
    image:
      'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Rann of Kutch',
    region: 'Gujarat',
    description: 'Salt flats, starry skies, and craft villages in full bloom.',
    image:
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Goa Hinterlands',
    region: 'Goa',
    description: 'Quiet beaches, river trails, and spice-plantation picnics.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Alleppey',
    region: 'Kerala',
    description: 'Backwater houseboats and slow mornings on the canals.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Coorg',
    region: 'Karnataka',
    description: 'Coffee estates, misty hills, and waterfall hikes.',
    image:
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Leh',
    region: 'Ladakh',
    description: 'High-altitude silence and crisp Himalayan vistas.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Valley of Flowers',
    region: 'Uttarakhand',
    description: 'Alpine blooms, glacier streams, and serene meadows.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Andaman Islands',
    region: 'Andaman',
    description: 'Crystal coves, reef dives, and unhurried island time.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Spiti Valley',
    region: 'Himachal',
    description: 'Monasteries, mountain roads, and deep blue skies.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Meghalaya',
    region: 'Northeast',
    description: 'Living root bridges and lush, rain-kissed trails.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Varanasi',
    region: 'Uttar Pradesh',
    description: 'River rituals, dawn boat rides, and lantern-lit evenings.',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
  },
];

const highlightPool = [
  {
    title: 'Desert Sunrises',
    label: 'Signature Moments',
    description: 'Golden dunes, camel safaris, and boutique desert camps.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Slow Coastlines',
    label: 'Signature Moments',
    description: 'Beachside cafes, hidden coves, and sunset paddles.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Mountain Calm',
    label: 'Signature Moments',
    description: 'Crackling fires, alpine walks, and quiet lodges.',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Forest Escapes',
    label: 'Signature Moments',
    description: 'Canopy trails, bird calls, and soft monsoon light.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Heritage Trails',
    label: 'Signature Moments',
    description: 'Courtyard stays, craft walks, and slow heritage dining.',
    image:
      'https://images.unsplash.com/photo-1529253355930-8d2f2c9fdc3b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'River Journeys',
    label: 'Signature Moments',
    description: 'Houseboats, fishing villages, and dusk cruises.',
    image:
      'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=80',
  },
];

const experiencePool = [
  {
    title: 'Ultimate Wildlife & Culture',
    subtitle: 'Savannahs, markets, and curated stays.',
    nights: '12 Nights',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Frozen Frontiers',
    subtitle: 'Ice-bound landscapes and polar light.',
    nights: '14 Nights',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Coastal Cities & Isles',
    subtitle: 'Clifftops, harbours, and coastal drives.',
    nights: '9 Nights',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
];

const galleryPool = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529253355930-8d2f2c9fdc3b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=900&q=80',
];

const weatherNotes = [
  'Crisp mornings, sunny days.',
  'Cool evenings, warm afternoons.',
  'Pleasant warmth and clear skies.',
  'Springtime light with soft winds.',
  'Golden afternoons and dry days.',
  'Early monsoon greens, humid nights.',
  'Monsoon drama and lush valleys.',
  'Misty mornings and rain-kissed trails.',
  'Clear air with balanced warmth.',
  'Dry days and festival-ready evenings.',
  'Cooler nights and golden light.',
  'Chill in the air, festive glow.',
];

const vibeNotes = [
  'Quiet starts, desert glow, hill retreats.',
  'Romantic coastlines and calm heritage stays.',
  'Shoulder-season calm with open skies.',
  'City breaks with floral trails.',
  'Long days, slow beaches, cool hills.',
  'Waterfalls, wild greens, and spice routes.',
  'Highland monsoon, quiet escapes.',
  'Lush forests, slow rivers, misty peaks.',
  'Transitional light and open trails.',
  'Heritage circuits and clear horizons.',
  'Soft winter sun and cultural trails.',
  'Festive warmth and cozy retreats.',
];

const idealForNotes = [
  'Culture, deserts, and gentle hikes.',
  'Romance, coast, and boutique stays.',
  'Wildlife, offbeat routes, and food trails.',
  'Family escapes and relaxed road trips.',
  'Beach time and hill getaways.',
  'Wellness, forest stays, and slow travel.',
  'Waterfalls, monsoon romance, and tea trails.',
  'Nature lovers and quiet hideouts.',
  'City breaks, crafts, and food.',
  'Festival lovers and heritage walks.',
  'Mountain air and cultural immersion.',
  'Festive markets and year-end retreats.',
];

const rotate = (items, start, count) =>
  Array.from({ length: count }, (_, idx) => items[(start + idx) % items.length]);

export const monthPlaces = monthNames.map((month, index) => ({
  month,
  slug: month.toLowerCase(),
  order: index + 1,
  heroImage: heroImages[index % heroImages.length],
  tagline: `Curated journeys and seasonal escapes for ${month}.`,
  introTitle: `WHERE TO TRAVEL IN ${month.toUpperCase()}`,
  introBody:
    `From soulful heritage cities to quiet coastlines, ${month} is perfect for slow, immersive travel. ` +
    'Our planners pick destinations that balance climate, culture, and crowd levels.',
  introHeadline: `BEST PLACES TO VISIT IN ${month.toUpperCase()}`,
  introParagraphs: [
    `With the new year comes a new dawn. ${month} is about kicking things off and setting the pace for the months to come.`,
    'We have hand-picked the ideas below to get your mind racing about your options and to help you choose your trip.',
  ],
  introCtaLabel: 'Get In Touch',
  stats: [
    { label: 'Weather', value: weatherNotes[index] },
    { label: 'Vibe', value: vibeNotes[index] },
    { label: 'Ideal For', value: idealForNotes[index] },
  ],
  featuredDestination: {
    title: 'Okinawa, Japan',
    description:
      'A string of islands with warm seas, quiet villages, and a gentler pace for the start of the year.',
    ctaLabel: 'Take Me There',
  },
  destinations: rotate(destinationPool, index, 10).map((item, itemIndex) => ({
    ...item,
    image: itemIndex % 4 === 2 ? '' : item.image,
    ctaLabel: 'Take Me There',
  })),
  highlights: rotate(highlightPool, index, 3),
  ctaBand: {
    title: 'LOOKING FOR A LAST-MINUTE ESCAPE?',
    body:
      "Last minute availability is easy to find. The right availability — properties worth your time, " +
      "experiences that haven't been diluted, itineraries that actually breathe — is another matter. " +
      "We know where to look, and we move fast. Tell us what you're after and we'll show you what's possible.",
    ctaLabel: 'Enquire Now',
  },
  experiencesIntro: {
    title: `OUR TOP ${month.toUpperCase()} EXPERIENCES`,
    body: `Our hand-picked recommendations for what to do and where to go in ${month}.`,
  },
  experiences: rotate(experiencePool, index, 3).map((item) => ({
    ...item,
    ctaLabel: 'Explore Trip',
  })),
  gallery: rotate(galleryPool, index, 12),
}));
