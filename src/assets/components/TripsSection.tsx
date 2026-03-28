import { Link } from 'react-router-dom';
import type { TripCard } from '../data/tripTypes';
import { tripSlug } from '../../lib/slug';

type TripsSectionProps = {
  title?: string;
  tagline?: string;
  trips?: TripCard[];
  showViewMore?: boolean;
  viewMoreHref?: string;
};

export default function TripsSection({
  title = 'Explore Our Trips',
  tagline = 'Curated destinations for travelers who want a story worth telling.',
  trips = [],
  showViewMore = true,
  viewMoreHref = '/trip-finder',
}: TripsSectionProps) {
  return (
    <section id="trips" className="bg-black py-12 md:py-16">
      <div className="w-full">
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          <article className="min-w-[320px] max-w-[320px] flex-shrink-0 snap-start px-4 md:px-10">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{title}</h2>
            <p className="mt-4 text-sm text-white/70">{tagline}</p>
          </article>
          {trips.map((trip) => (
            <article
              key={`${trip.title}-${trip.location ?? 'featured'}`}
              className="group relative min-w-[320px] max-w-[320px] flex-shrink-0 snap-start overflow-hidden bg-black"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700"
                style={{ backgroundImage: `url(${trip.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90 group-hover:via-black/50" />
              <div className="relative flex h-[500px] flex-col justify-between p-6 text-white">
                <div className="flex justify-end">
                  <span className="border border-white/60 bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
                    8 Nights
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold transition-transform duration-300 group-hover:-translate-y-2">
                    {trip.title}
                  </h3>
                  <p className="max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
                    {trip.description}
                  </p>
                  <Link
                    to={`/trip-finder/${trip.slug ?? tripSlug(trip.title, trip.location)}`}
                    className="mt-2 inline-flex border border-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-white hover:text-black"
                  >
                    View Package
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {showViewMore ? (
            <article className="min-w-[320px] max-w-[320px] flex-shrink-0 snap-start px-4 md:px-10">
              <div className="flex h-[500px] items-center justify-center">
                <a href={viewMoreHref} className="q-button q-button-outline-light">
                  View More
                </a>
              </div>
            </article>
          ) : null}
          <div className="min-w-[24px] flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
