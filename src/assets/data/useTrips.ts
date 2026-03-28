import { useEffect, useMemo, useState } from 'react';
import type { TripData } from './tripTypes';

export type TripsState = {
  trips: TripData[];
  loading: boolean;
  error: string | null;
};

export const fetchTrips = async () => {
  const response = await fetch('/api/trips');
  if (!response.ok) {
    throw new Error('Failed to load trips');
  }
  return (await response.json()) as TripData[];
};

export const useTrips = (): TripsState => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchTrips()
      .then((data) => {
        if (active) {
          setTrips(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load trips');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ trips, loading, error }), [trips, loading, error]);
};
