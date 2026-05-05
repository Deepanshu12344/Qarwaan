import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import TripsSection from '../components/TripsSection';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';
import { monthNames } from '../data/monthPlaces';
import { useTrips } from '../data/useTrips';

const heroImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80';

const introParagraphs = (month: string) => [
  `With the new year comes a new dawn. ${month} is about kicking things off and setting the pace for the months to come. Dreams, possibilities, horizons. The whole world is at your disposal. And these luxury trips are ripe for the taking, meaning you can be on the beach (or the mountainside, or the jungle) in the blink of an eye. Now is the perfect moment to set the mood for the year ahead.`,
  `We've hand-picked the ideas below to get your mind racing about your options for where to travel in ${month}. As ever, our luxury travel experts are on hand to give you detailed guidance and suggestions in choosing your trip.`,
];

const featuredDestination = (month: string) => ({
  title: 'Okinawa, Japan',
  description: `Okinawa promises life at a gentler pace. This string of 160 islands is pleasantly warm in ${month} and, if you're very lucky, you may see the first of the cherry blossom. But ssh, that's our little secret.`,
});

const destinations = (month: string) => [
  {
    title: 'Australia',
    description:
      'For over 15 years, we have been perfecting our Australian cocktail of experience. And ' +
      `${month} brings the summer weather to enjoy it. Blend your own wines under the expert guidance of a Chief Winemaker or walk alongside indigenous wildlife from Adelaide to Tasmania.`,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Tanzania',
    description:
      'The Great Migration is a visual and sonic feast. Of six million hooves thunderously crossing the wild open plains - with more than 200,000 zebras, 300,000 gazelles and over a million wildebeests relocating for fresh grazing. Now that\'s a show.',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Argentina',
    description:
      'Argentina is somewhere to get excellently lost in. Wine-tasting on salt flats, a world-first expedition trek through the Mitre Peninsula - simply put, it\'s stunning. ' +
      `${month} brings the warm weather, all you have to do is bring your adventurous spirit.`,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'India',
    description:
      'Through the vibrant cities of Rajasthan and high into the Himalayas. We\'ll take you beyond the buzzing tuk tuks and introduce you to the lives of the locals we\'ve connected with over the years. Dive in.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cambodia',
    description:
      "Ideal for a winter escape in the sun, Cambodia is Southeast Asia's most enchanting gem. Traverse the deep jungles of Cardamom National Park or explore secret beaches few travellers ever experience. It's impossible to resist.",
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Egypt',
    description:
      'A new country to uncover is always exciting - but when that new country is, in fact, an ancient one with a history that reaches back thousands of years? You can guarantee we\'ll be there in a heartbeat. Come discover Egypt with us.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Finland',
    description:
      "No matter how bitter the cold or how deep the snow, this is a place to commit to the great outdoors. Whether you're in pursuit of the Northern Lights and a snowy adventure by the lake, Finland has it all.",
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Antarctica',
    description:
      "A frozen land that was previously the preserve of explorers on years-long expeditions, it may not be a world-first but it'll certainly be a personal first. It's time to join the Seven Continents Club.",
    image:
      'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Vietnam',
    description:
      "A passage through one of South East Asia's most beguiling countries - bustling cities, ancient monuments and quiet beaches happily rub shoulders, content to vie for your attention.",
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
];

const restOfYearImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
];

const testimonials = [
  {
    quote:
      'Arin and the entire team was wonderful with their communication. They made our trip seamless.',
    author: 'Yvette Bjork',
  },
  {
    quote:
      'I would like to express my heartfelt thanks to Arin and the entire Black Tomato team for organizing such a wonderful journey for us to...',
    author: 'Avi Gindi',
  },
  {
    quote:
      'Black Tomato helped plan a trip to Portugal and it was perfect. Very easy process and the entire trip was thoughtful, seamless and stress-free. I\'ll...',
    author: 'Braedan',
  },
  {
    quote:
      'This is our third trip organised with Black Tomato and from the original conversation of what we were looking for on our first trip to...',
    author: 'Caron moore',
  },
];

export default function MonthPlacesPage() {
  const { month } = useParams();
  const { trips } = useTrips();
  const featuredTrips = useMemo(() => trips.filter((trip) => trip.featured), [trips]);
  const monthName = month
    ? `${month.charAt(0).toUpperCase()}${month.slice(1)}`
    : 'January';

  useSeo({
    title: `Places to Visit in ${monthName}`,
    description: `Explore curated destinations, seasonal highlights, and travel ideas for ${monthName}.`,
    path: month ? `/places-for/${month.toLowerCase()}` : '/places-for/january',
    image: heroImage,
  });

  const destinationList = destinations(monthName);
  const feature = featuredDestination(monthName);
  const intro = introParagraphs(monthName);

  return (
    <div className="min-h-screen bg-white">
      <Navbar heroOffset={520} />
      <main>
        <section className="relative min-h-[65vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          <div className="relative mx-auto flex min-h-[65vh] max-w-[1200px] flex-col items-center justify-center px-4 pt-24 text-center text-white">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] md:text-5xl">
              WHERE TO TRAVEL IN {monthName.toUpperCase()}
            </h1>
            <p className="mt-8 text-xs uppercase tracking-[0.5em] text-white/70">Scroll</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[900px] px-4 py-16 text-center">
            <h2 className="text-xl font-semibold uppercase tracking-[0.28em] text-black">
              BEST PLACES TO VISIT IN {monthName.toUpperCase()}
            </h2>
            <div className="mx-auto mt-6 max-w-[780px] space-y-6 text-sm text-black/70">
              {intro.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/enquire" className="q-button">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white pb-6">
          <div className="mx-auto max-w-[1200px] px-4">
            <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.2em] text-black">
              Our Favourite Destinations
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.2fr]">
              <div className="hidden md:block" />
              <article className="bg-[#f6f4f1] p-10">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-black">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm text-black/70">{feature.description}</p>
                <Link
                  to="/trip-finder"
                  className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.25em] text-black"
                >
                  Take Me There
                </Link>
              </article>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {destinationList.map((place) => (
                <article
                  key={place.title}
                  className="bg-white"
                >
                  <div
                    className="h-[320px] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${place.image})` }}
                  />
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-black">
                      {place.title}
                    </h3>
                    <p className="mt-3 text-sm text-black/70">{place.description}</p>
                    <Link
                      to="/trip-finder"
                      className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.25em] text-black"
                    >
                      Take Me There
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#c95a2a] py-12 text-white">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold uppercase tracking-[0.18em] text-white">
                Looking For A Last-Minute Escape?
              </h2>
              <p className="mt-4 text-sm text-white/90">
                Last minute availability is easy to find. The right availability - properties worth your time,
                experiences that haven't been diluted, itineraries that actually breathe - is another matter.
                We know where to look, and we move fast. Tell us what you're after and we'll show you what's
                possible.
              </p>
            </div>
            <Link to="/enquire" className="q-button q-button-outline-light text-bg-hover">
              Enquire Now
            </Link>
          </div>
        </section>

        <TripsSection
          title={`Our Top ${monthName.toUpperCase()} Experiences`}
          tagline={`Our hand-picked recommendations for what to do and where to go in ${monthName}.`}
          trips={featuredTrips}
          showViewMore={false}
        />

        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1200px] px-4">
            <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.2em] text-black">
              The Rest Of The Year
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-6">
              {monthNames.map((item, index) => (
                <Link
                  key={item}
                  to={`/places-for/${item.toLowerCase()}`}
                  className="group relative h-[160px] overflow-hidden"
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${restOfYearImages[index % restOfYearImages.length]})` }}
                  />
                  <div className="absolute inset-0 bg-true-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      {item}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#004643] py-16 text-white">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:grid-cols-4">
            {testimonials.map((item) => (
              <div key={item.author} className="text-center text-sm text-white/90">
                <p className="text-3xl leading-none text-white/40">"</p>
                <p className="mt-3 uppercase tracking-[0.16em]">{item.quote}</p>
                <p className="mt-4 text-sm italic text-white/70">{item.author}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className="inline-flex h-3 w-3 items-center justify-center border border-white/40 text-[0.55rem]">
                  *
                </span>
              ))}
            </div>
            <span>Trustpilot</span>
          </div>
        </section>

        <section className="bg-[#1f1f1f] py-10 text-white">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-10 px-4 text-xs uppercase tracking-[0.3em] text-white/60">
            <span>IATA</span>
            <span>Virtuoso Member</span>
            <span>ABTA</span>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
