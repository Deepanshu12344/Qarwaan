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
    <section className="bg-[#f4efe7] py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="bt-kicker text-[#8c7c72]">Your Stories</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1f1a17] md:text-4xl">
              Featured planned trips
            </h2>
            <p className="mt-2 text-sm text-[#6b5f57]">
              Curated journey design with a focus on craft, surprise, and storytelling.
            </p>
          </div>
          <Link to="/trips" className="bt-button bt-button-outline text-[#1f1a17]">
            View all trips
          </Link>
        </div>

      {loading ? <p className="text-gray-600">Loading packages...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
