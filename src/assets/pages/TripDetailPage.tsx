import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Clock3, MapPin, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getTripDetails, submitBooking } from '../../lib/api';
import type { Trip } from '../../types/trip';

type BookingState = {
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  specialRequest: string;
};

const initialBooking: BookingState = {
  fullName: '',
  email: '',
  phone: '',
  travelers: 2,
  travelDate: '',
  specialRequest: '',
};

export default function TripDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(initialBooking);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!slug) return;

      setLoading(true);
      setError('');
      try {
        const data = await getTripDetails(slug);
        setTrip(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Could not fetch trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [slug]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!slug) return;

    setSubmitting(true);
    setBookingMessage('');
    setBookingError('');

    try {
      const response = await submitBooking(slug, {
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        travelers: booking.travelers,
        travelDate: booking.travelDate,
        specialRequest: booking.specialRequest,
      });
      setBookingMessage(`${response.message} Estimated total: INR ${response.totalAmount.toLocaleString()}`);
      setBooking(initialBooking);
    } catch (submitError) {
      setBookingError(submitError instanceof Error ? submitError.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading trip details...</div>;
  }

  if (error || !trip) {
    return (
      <div className="p-8">
        <p className="text-rose-600">{error || 'Trip not found'}</p>
        <Link to="/trips" className="mt-3 inline-block text-[#112211] hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  const effectivePrice = trip.discountedPrice || trip.price;

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative h-[520px] overflow-hidden">
        <img src={trip.heroImage} alt={trip.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112211] via-black/40 to-black/20" />
        <Header />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-5 text-white md:px-8">
            <p className="text-sm font-medium text-[#8DD3BB]">{trip.category} Package</p>
            <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{trip.name}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#8DD3BB]" />
                {trip.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4 text-[#8DD3BB]" />
                {trip.durationDays} Days / {trip.nights} Nights
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {trip.rating} ({trip.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto grid grid-cols-1 gap-8 px-5 py-12 md:px-8 lg:grid-cols-3">
        <section className="space-y-8 lg:col-span-2">
          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-3 text-2xl font-bold text-[#112211]">Overview</h2>
            <p className="leading-7 text-gray-700">{trip.overview}</p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Highlights</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {trip.highlights.map((item) => (
                <p key={item} className="rounded-lg bg-[#f1f9f6] px-4 py-3 text-sm font-medium text-[#24443b]">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Day Wise Itinerary</h2>
            <div className="space-y-4">
              {trip.itinerary.map((item) => (
                <div key={item.day} className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#3e7d69]">Day {item.day}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#112211]">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[#112211]">Inclusions</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {trip.inclusions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[#112211]">Exclusions</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {trip.exclusions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_18px_40px_rgba(17,34,17,0.08)]">
          <p className="text-sm text-gray-500">Starting from</p>
          {trip.discountedPrice ? (
            <p className="text-sm text-gray-400 line-through">INR {trip.price.toLocaleString()}</p>
          ) : null}
          <p className="text-3xl font-extrabold text-[#112211]">INR {effectivePrice.toLocaleString()}</p>
          <p className="mb-6 text-sm text-gray-500">per traveler</p>

          <h3 className="mb-3 text-lg font-bold text-[#112211]">Book This Package</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={booking.fullName}
              onChange={(event) => setBooking((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Full name"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="email"
              value={booking.email}
              onChange={(event) => setBooking((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="text"
              value={booking.phone}
              onChange={(event) => setBooking((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="date"
              value={booking.travelDate}
              onChange={(event) => setBooking((prev) => ({ ...prev, travelDate: event.target.value }))}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={booking.travelers}
              onChange={(event) => setBooking((prev) => ({ ...prev, travelers: Number(event.target.value) }))}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <textarea
              value={booking.specialRequest}
              onChange={(event) => setBooking((prev) => ({ ...prev, specialRequest: event.target.value }))}
              placeholder="Special request"
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#112211] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#081208] disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Request Booking'}
            </button>
          </form>

          {bookingMessage ? <p className="mt-3 text-sm text-emerald-700">{bookingMessage}</p> : null}
          {bookingError ? <p className="mt-3 text-sm text-rose-600">{bookingError}</p> : null}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
