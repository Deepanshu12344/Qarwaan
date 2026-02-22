import { useState } from 'react';
import type { FormEvent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { submitInquiry } from '../../lib/api';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [travelMonth, setTravelMonth] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await submitInquiry({
        fullName,
        email,
        phone,
        city,
        travelMonth,
        durationDays: durationDays ? Number(durationDays) : undefined,
        travelers: Number(travelers),
        budget: budget ? Number(budget) : undefined,
        notes,
      });
      setMessage(response.message);
      setFullName('');
      setEmail('');
      setPhone('');
      setCity('');
      setTravelMonth('');
      setDurationDays('');
      setTravelers('');
      setBudget('');
      setNotes('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative overflow-visible bg-[#112211] pb-16">
        <Header />
        <div className="container mx-auto px-5 pb-4 pt-36 text-white md:px-8 md:pt-40">
          <h1 className="text-4xl font-extrabold md:text-5xl">Plan A Custom Trip</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Share your rough plan and our travel specialists will craft a complete itinerary for your preferred number of days.
          </p>
        </div>
      </div>

      <main className="container mx-auto grid grid-cols-1 gap-8 px-5 py-10 pb-20 md:px-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_18px_40px_rgba(17,34,17,0.08)] lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Travel consultation"
              className="h-48 w-full object-cover"
            />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-[#112211]">Inquiry Form</h2>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Full name"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
              required
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
              required
            />
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Your city"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              value={travelMonth}
              onChange={(event) => setTravelMonth(event.target.value)}
              placeholder="Preferred travel month"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(event) => setDurationDays(event.target.value)}
              placeholder="Preferred trip days"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(event) => setTravelers(event.target.value)}
              placeholder="Travelers"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
              required
            />
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Approx budget (INR)"
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            />
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Tell us destination ideas or preferences"
              rows={5}
              className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#112211] px-4 py-3 font-semibold text-white transition hover:bg-[#081208] disabled:opacity-60 md:col-span-2"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-[#f1f9f6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3e7d69]">Step 1</p>
              <p className="mt-1 text-sm font-medium text-[#112211]">Free consultation call</p>
            </div>
            <div className="rounded-xl bg-[#f1f9f6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3e7d69]">Step 2</p>
              <p className="mt-1 text-sm font-medium text-[#112211]">Day-wise itinerary draft</p>
            </div>
            <div className="rounded-xl bg-[#f1f9f6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3e7d69]">Step 3</p>
              <p className="mt-1 text-sm font-medium text-[#112211]">Booking and confirmations</p>
            </div>
          </div>
        </section>

        <aside className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_18px_40px_rgba(17,34,17,0.08)]">
          <img
            src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Travel desk support"
            className="mb-4 h-36 w-full rounded-xl object-cover"
          />
          <h3 className="mb-4 text-xl font-bold text-[#112211]">Travel Desk</h3>
          <p className="text-sm text-gray-700">Call us directly for urgent booking support.</p>
          <p className="mt-3 text-lg font-semibold text-[#112211]">+91 99999 99999</p>
          <p className="text-sm text-gray-700">hello@qarwaan.com</p>
          <div className="mt-6 rounded-xl bg-[#f1f9f6] p-4 text-sm text-[#33534a]">
            Working Hours:
            <br />
            Monday - Saturday
            <br />
            9:00 AM - 8:00 PM
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
