import { Link } from 'react-router-dom';
import type { Trip } from '../../types/trip';
import TripCard from './TripCard';

type DestinationsProps = {
  trips: Trip[];
  loading: boolean;
  error: string;
};

export default function Destinations({ trips, loading, error }: DestinationsProps) {
  return (
    <section className="container mx-auto px-5 py-16 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[#112211]">Featured Planned Trips</h2>
          <p className="text-gray-600">Curated trip bundles with complete day-wise planning.</p>
        </div>
        <Link
          to="/trips"
          className="rounded-lg border border-[#8DD3BB] px-6 py-2 text-sm font-medium text-[#112211] transition hover:bg-[#f1f9f6]"
        >
          View all packages
        </Link>
      </div>

      {loading ? <p className="text-gray-600">Loading packages...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
