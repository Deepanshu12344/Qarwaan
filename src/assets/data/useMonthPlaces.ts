import { useEffect, useMemo, useState } from 'react';
import type { MonthPlacesData } from './monthPlaces';

export type MonthPlacesState = {
  months: MonthPlacesData[];
  loading: boolean;
  error: string | null;
};

export const fetchMonthPlaces = async () => {
  const response = await fetch('/api/month-places');
  if (!response.ok) {
    throw new Error('Failed to load month guides');
  }
  return (await response.json()) as MonthPlacesData[];
};

export const fetchMonthPlace = async (slug: string) => {
  const response = await fetch(`/api/month-places/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to load month guide');
  }
  return (await response.json()) as MonthPlacesData;
};

export const useMonthPlaces = (): MonthPlacesState => {
  const [months, setMonths] = useState<MonthPlacesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMonthPlaces()
      .then((data) => {
        if (active) {
          setMonths(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load month guides');
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

  return useMemo(() => ({ months, loading, error }), [months, loading, error]);
};
