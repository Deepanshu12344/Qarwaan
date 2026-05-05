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
  tagline = 'Curated destinations designed for unforgettable experiences.',
  trips = [],
  showViewMore = true,
  viewMoreHref = '/trip-finder',
}: TripsSectionProps) {
  return (
    <section id="trips" className="py-12 md:py-16" style={{ backgroundColor: '#004643' }}>
      <div className="w-full">
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          <article className="min-w-[320px] max-w-[320px] flex-shrink-0 snap-start px-4 md:px-10">
            <h2 className="text-3xl font-semibold text-[#ffffff] md:text-4xl">{title}</h2>
            <p className="mt-4 text-sm text-[#ffffff]/70">{tagline}</p>
          </article>
          {trips.map((trip) => (
            <article
              key={`${trip.title}-${trip.location ?? 'featured'}`}
              className="group relative min-w-[320px] max-w-[320px] flex-shrink-0 snap-start overflow-hidden"
              style={{ backgroundColor: '#000000' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700"
                style={{ backgroundImage: `url(${trip.image})` }}
              />
              <div
                className="absolute inset-0 transition duration-300"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.35), rgba(0,0,0,0.1))',
                }}
              />
              <div className="relative flex h-[500px] flex-col justify-between p-6 text-[#ffffff]">
                <div className="flex justify-end">
                  <span
                    className="px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      border: '1px solid rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  >
                    8 Nights
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold transition-transform duration-300 group-hover:-translate-y-2">
                    {trip.title}
                  </h3>
                  <p className="max-h-0 overflow-hidden text-sm text-[#ffffff]/80 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
                    {trip.description}
                  </p>
                  <Link
                    to={`/trip-finder/${trip.slug ?? tripSlug(trip.title, trip.location)}`}
                    className="mt-2 inline-flex px-4 py-2 text-xs uppercase tracking-[0.25em] transition duration-300"
                    style={{
                      border: '1px solid rgba(255,255,255,0.7)',
                      color: '#ffffff',
                    }}
                  >
                    Travel Here
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
