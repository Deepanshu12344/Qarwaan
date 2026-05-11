import { useEffect, useMemo, useState } from 'react';
import type { TripData } from './tripTypes';

export type TripsState = {
  trips: TripData[];
  loading: boolean;
  error: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function normalizeTripsResponse(payload: unknown): TripData[] {
  if (Array.isArray(payload)) {
    return payload as TripData[];
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'trips' in payload &&
    Array.isArray((payload as { trips?: unknown }).trips)
  ) {
    return (payload as { trips: TripData[] }).trips;
  }

  throw new Error('Invalid trips response');
}

export const fetchTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/trips`);
  if (!response.ok) {
    throw new Error('Failed to load trips');
  }

  return normalizeTripsResponse(await response.json());
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
      .catch(() => {
        if (active) {
          setTrips([]);
          setError('Failed to load trips');
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
