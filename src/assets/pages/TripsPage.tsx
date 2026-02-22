import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TripCard from '../components/TripCard';
import { getTrips } from '../../lib/api';
import type { Trip } from '../../types/trip';

type DaysFilter = string;
type CategoryFilter = 'Domestic' | 'International' | '';

export default function TripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const days = (searchParams.get('days') as DaysFilter) || '';
  const category = (searchParams.get('category') as CategoryFilter) || '';
  const sort = searchParams.get('sort') || 'rating';

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getTrips({
          days: days && Number(days) > 0 ? Number(days) : undefined,
          category: category || undefined,
          search: searchParams.get('search') || undefined,
          sort: sort as 'priceLow' | 'priceHigh' | 'rating',
        });
        setTrips(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [days, category, sort, searchParams]);

  const heading = useMemo(() => {
    if (days) return `${days} Day Planned Trips`;
    return 'All Planned Trips';
  }, [days]);

  const updateParams = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateParams('search', search.trim());
  };

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative overflow-hidden bg-[#112211] pb-24">
        <Header />
        <div className="container mx-auto px-5 pt-36 md:px-8">
          <h1 className="text-4xl font-extrabold text-white">{heading}</h1>
          <p className="mt-2 text-white/85">Browse, compare and book complete itinerary packages.</p>
        </div>
      </div>

      <main className="container mx-auto -mt-10 px-5 pb-20 md:px-8">
        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_8px_24px_rgba(17,34,17,0.05)]">
            <div className="flex items-center gap-4">
              <img
                src="/carousel1.png"
                alt=""
                aria-hidden="true"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Durations</p>
                <p className="mt-1 text-xl font-bold text-[#112211]">Any custom days</p>
              </div>
            </div>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_8px_24px_rgba(17,34,17,0.05)]">
            <div className="flex items-center gap-4">
              <img
                src="/Gemini_Generated_Image_no3aglno3aglno3a 1.png"
                alt=""
                aria-hidden="true"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Packages</p>
                <p className="mt-1 text-xl font-bold text-[#112211]">{loading ? '...' : `${trips.length} options`}</p>
              </div>
            </div>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_8px_24px_rgba(17,34,17,0.05)]">
            <div className="flex items-center gap-4">
              <img
                src="/carousel1.png"
                alt=""
                aria-hidden="true"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Customization</p>
                <p className="mt-1 text-xl font-bold text-[#112211]">Fully assisted</p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_18px_40px_rgba(17,34,17,0.08)]">
          <form className="grid grid-cols-1 gap-3 md:grid-cols-5" onSubmit={onSearchSubmit}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by location or package"
              className="rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none md:col-span-2"
            />
            <input
              type="number"
              min={1}
              value={days}
              onChange={(event) => updateParams('days', event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
              placeholder="Days (optional)"
            />
            <select
              value={category}
              onChange={(event) => updateParams('category', event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            >
              <option value="">All categories</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(event) => updateParams('sort', event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
              >
                <option value="rating">Top rated</option>
                <option value="priceLow">Price low to high</option>
                <option value="priceHigh">Price high to low</option>
              </select>
              <button className="rounded-lg bg-[#8DD3BB] px-4 py-2.5 font-semibold text-[#112211] hover:bg-[#7ec6ac]">
                Go
              </button>
            </div>
          </form>
        </section>

        {loading ? <p className="mt-8 text-gray-600">Loading trips...</p> : null}
        {error ? <p className="mt-8 text-rose-600">{error}</p> : null}
        {!loading && !error && trips.length === 0 ? (
          <p className="mt-8 text-gray-600">No trips matched your filters.</p>
        ) : null}

        {!loading && !error && trips.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </section>
        ) : null}

        <section className="mt-12 overflow-hidden rounded-3xl bg-[#112211] text-white md:flex md:items-center md:justify-between">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Need a custom route instead?</h2>
            <p className="mt-2 text-white/80">Share your dates and preferences. We will tailor a full itinerary for you.</p>
          </div>
          <Link
            to="/contact"
            className="mx-6 mb-6 inline-block rounded-lg bg-[#8DD3BB] px-5 py-3 font-semibold text-[#112211] md:mb-0"
          >
            Request Custom Plan
          </Link>
          <img
            src="/Gemini_Generated_Image_no3aglno3aglno3a 1.png"
            alt=""
            aria-hidden="true"
            className="h-44 w-full object-cover md:h-52 md:w-72"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
