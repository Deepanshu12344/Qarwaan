import { useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import JourneyGrid from '../components/JourneyGrid';
import TripsSection from '../components/TripsSection';
import MediaLogos from '../components/MediaLogos';
import VideoSection from '../components/VideoSection';
import WhatWeDo from '../components/WhatWeDo';
import PursuitSection from '../components/PursuitSection';
import GuideSection from '../components/GuideSection';
import WhyQarwaan from '../components/WhyQarwaan';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';
import { useTrips } from '../data/useTrips';

export const HomePage = () => {
  const { trips } = useTrips();
  const featuredTrips = useMemo(() => trips.filter((trip) => trip.featured), [trips]);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useSeo({
    title: 'Custom Trip Packages and Itinerary Planning',
    description:
      'Discover curated domestic and international packages, custom itinerary planning, and instant travel support with Qarwaan.',
    path: '/',
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="reveal">
        <Intro />
      </div>
      <div className="reveal">
        <JourneyGrid />
      </div>
      <div className="reveal">
        <TripsSection trips={featuredTrips} />
      </div>
      <div className="reveal">
        <MediaLogos />
      </div>
      <div className="reveal">
        <VideoSection />
      </div>
      <div className="reveal">
        <WhatWeDo />
      </div>
      <div className="reveal">
        <PursuitSection />
      </div>
      <div className="reveal">
        <GuideSection />
      </div>
      <div className="reveal">
        <WhyQarwaan />
      </div>
      <div className="reveal">
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

