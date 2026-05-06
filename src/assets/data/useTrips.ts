import { useEffect, useMemo, useState } from 'react';
import type { TripData } from './tripTypes';
import { FALLBACK_TRIPS } from '../../data/tripCatalog';

export type TripsState = {
  trips: TripData[];
  loading: boolean;
  error: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function mapFallbackTripToTripData(trip: (typeof FALLBACK_TRIPS)[number]): TripData {
  return {
    slug: trip.slug,
    title: trip.name,
    description: trip.overview,
    image: trip.heroImage,
    nights: `${trip.nights} Nights`,
    location: trip.location,
    featured: trip.featured,
    overview: trip.overview,
    stats: {
      duration: `${trip.durationDays} Days`,
      price: `INR ${trip.discountedPrice || trip.price}`,
    },
    itinerary: [],
  };
}

const FALLBACK_TRIP_DATA: TripData[] = FALLBACK_TRIPS.map(mapFallbackTripToTripData);

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
          setTrips(FALLBACK_TRIP_DATA);
          setError(null);
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
