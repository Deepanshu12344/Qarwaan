import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';
import { tripSlug } from '../../lib/slug';
import type { TripData } from '../data/tripTypes';
import { useTrips } from '../data/useTrips';

const filterGroups = ['Feeling', 'Destination', 'When', 'Who', 'Duration', 'Experience'];
const BATCH_SIZE = 9;

function TripFinderCard({ trip }: { trip: TripData }) {
  const slug = trip.slug ?? tripSlug(trip.title, trip.location);
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
            {trip.nights ?? ''}
          </span>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/70">
            {trip.location ?? 'Destination'}
          </p>
          <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] transition-transform duration-300 group-hover:-translate-y-2">
            {trip.title}
          </h3>
          <p className="max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
            {trip.description}
          </p>
          <Link
            to={`/trip-finder/${slug}`}
            className="mt-3 inline-flex border border-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-white hover:text-black"
          >
            Explore Trip
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TripFinderPage() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'>('price-asc');
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { trips, loading: tripsLoading } = useTrips();

  const parseNumber = (value?: string) => {
    if (!value) {
      return 0;
    }
    const match = value.replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? Number.parseFloat(match[0]) : 0;
  };

  const getDuration = (trip: TripData) => parseNumber(trip.nights);
  const getPrice = (trip: TripData) => parseNumber(trip.stats?.price);

  const sortedTrips = useMemo(() => {
    const items = [...trips];
    items.sort((a, b) => {
      if (sortBy === 'duration-asc') {
        return getDuration(a) - getDuration(b);
      }
      if (sortBy === 'duration-desc') {
        return getDuration(b) - getDuration(a);
      }
      if (sortBy === 'price-desc') {
        return getPrice(b) - getPrice(a);
      }
      return getPrice(a) - getPrice(b);
    });
    return items;
  }, [sortBy, trips]);

  const visibleTrips = useMemo(() => sortedTrips.slice(0, visibleCount), [sortedTrips, visibleCount]);
  const hasMore = visibleCount < sortedTrips.length;

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
            setVisibleCount((count) => Math.min(count + BATCH_SIZE, trips.length));
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
  }, [hasMore, trips.length]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [sortBy, trips.length]);

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
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                >
                  <option value="price-asc">Price (ASC)</option>
                  <option value="price-desc">Price (DESC)</option>
                  <option value="duration-asc">Duration (ASC)</option>
                  <option value="duration-desc">Duration (DESC)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/70" />
              </div>
            </div>
            <button
              type="button"
              className="ml-auto text-black/85"
              onClick={() => {
                setSortBy('price-asc');
                setVisibleCount(BATCH_SIZE);
              }}
            >
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
                  <TripFinderCard key={`${trip.title}-${trip.location ?? 'trip'}`} trip={trip} />
                ))}
              </div>

              <div ref={sentinelRef} className="py-10 text-center text-sm uppercase tracking-[0.25em] text-black/50">
                {tripsLoading || loading ? 'Loading...' : hasMore ? '' : 'All trips loaded'}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
