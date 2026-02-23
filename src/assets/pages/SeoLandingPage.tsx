import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTrips } from '../../lib/api';
import { getGuide } from '../../data/guides';
import type { Trip } from '../../types/trip';

export default function SeoLandingPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const data = getGuide(type || '', slug || '');
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (!data) return;
    getTrips({ search: data.relatedTripSearch })
      .then((items) => setRelatedTrips(items.slice(0, 6)))
      .catch(() => setRelatedTrips([]));
  }, [data]);

  const schema = useMemo(() => {
    if (!data) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      keywords: data.bestFor.join(', '),
      mainEntity: data.faq.map((item) => ({
        '@type': 'Question',
        name: item,
        acceptedAnswer: { '@type': 'Answer', text: item },
      })),
    };
  }, [data]);

  if (!data) {
    return <main className="p-8 text-rose-600">Landing page not found.</main>;
  }

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
      <div className="relative overflow-hidden bg-[#112211] pb-16">
        <Header />
        <div className="container mx-auto px-5 pt-36 text-white md:px-8">
          <h1 className="text-4xl font-extrabold">{data.title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{data.description}</p>
          <p className="mt-2 text-sm text-white/70">{data.readTimeMinutes} min read</p>
        </div>
      </div>
      <main className="container mx-auto px-5 py-10 md:px-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm lg:col-span-2">
            <img src={data.heroImage} alt={data.title} className="mb-5 h-64 w-full rounded-xl object-cover" />
            <h2 className="text-2xl font-bold text-[#112211]">Guide Highlights</h2>
            <ul className="mt-3 space-y-2 text-gray-700">
              {data.highlights.map((item) => <li key={item}>- {item}</li>)}
            </ul>
            <h3 className="mt-6 text-xl font-bold text-[#112211]">Who This Is Best For</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.bestFor.map((item) => (
                <span key={item} className="rounded-full bg-[#f1f9f6] px-3 py-1 text-xs font-semibold text-[#22483d]">{item}</span>
              ))}
            </div>
          </article>
          <aside className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#112211]">Quick FAQ</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {data.faq.map((item) => <li key={item}>- {item}</li>)}
            </ul>
            <Link to="/guides" className="mt-5 inline-block text-sm font-semibold text-[#112211] underline">
              Explore all guides
            </Link>
          </aside>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#112211]">Related Packages</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {relatedTrips.length === 0 ? <p className="text-sm text-gray-600">No matching packages found currently.</p> : relatedTrips.map((trip) => (
              <Link key={trip._id} to={`/trips/${trip.slug}`} className="rounded-lg border p-3 transition hover:bg-[#f8fcfa]">
                <p className="font-semibold text-[#112211]">{trip.name}</p>
                <p className="text-sm text-gray-600">{trip.location}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#112211]">Need a Tailored Plan?</h2>
          <p className="mt-2 text-gray-700">Share your dates and preferences, and we will build a custom itinerary around this guide.</p>
          <Link to="/contact" className="mt-3 inline-block rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white">
            Talk to Travel Desk
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
