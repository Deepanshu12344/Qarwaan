import { useEffect, useState } from 'react';
import { getTrips } from '../../lib/api';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import TripPlannerForm from '../components/TripPlannerForm';
import type { Trip } from '../../types/trip';

export const HomePage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        const data = await getTrips({ featured: true });
        setTrips(data.slice(0, 6));
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTrips();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TripPlannerForm />
      <Destinations trips={trips} loading={loading} error={error} />
      <Features />
      <Reviews />
      <Newsletter />
      <Footer />
    </div>
  );
};

