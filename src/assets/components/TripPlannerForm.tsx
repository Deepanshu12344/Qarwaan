import { CalendarDays, PhoneCall, Users } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { submitInquiry } from '../../lib/api';

export default function SearchForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [travelMonth, setTravelMonth] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [travelers, setTravelers] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
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
        durationDays: Number(durationDays),
        travelers: Number(travelers),
      });
      setMessage(response.message);
      setFullName('');
      setEmail('');
      setPhone('');
      setCity('');
      setTravelMonth('');
      setTravelers('');
      setDurationDays('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-20 -mt-24 px-5 md:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#e6d9ca] bg-white/95 p-10 shadow-[0_30px_70px_rgba(31,26,23,0.12)]">
        <div className="mb-8 text-center">
          <p className="bt-kicker text-[#8c7c72]">Made For You</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#1f1a17]">
            Travel design with an editor’s eye and a storyteller’s heart.
          </h3>
          <p className="mt-3 text-sm text-[#6b5f57]">
            Share a few details and we will shape a tailor-made itinerary for your dates.
          </p>
        </div>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="border-b border-[#d9cbbb] bg-transparent px-2 py-3 text-sm outline-none focus:border-[#1f1a17] md:col-span-2"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-b border-[#d9cbbb] bg-transparent px-2 py-3 text-sm outline-none focus:border-[#1f1a17] md:col-span-2"
            required
          />
          <div className="relative md:col-span-2">
            <PhoneCall className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b7a79a]" />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full border-b border-[#d9cbbb] bg-transparent py-3 pl-7 pr-2 text-sm outline-none focus:border-[#1f1a17]"
              required
            />
          </div>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="border-b border-[#d9cbbb] bg-transparent px-2 py-3 text-sm outline-none focus:border-[#1f1a17] md:col-span-2"
          />
          <div className="relative md:col-span-2">
            <CalendarDays className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b7a79a]" />
            <input
              type="text"
              placeholder="Preferred month"
              value={travelMonth}
              onChange={(event) => setTravelMonth(event.target.value)}
              className="w-full border-b border-[#d9cbbb] bg-transparent py-3 pl-7 pr-2 text-sm outline-none focus:border-[#1f1a17]"
            />
          </div>
          <div className="relative md:col-span-1">
            <Users className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b7a79a]" />
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(event) => setTravelers(event.target.value)}
              className="w-full border-b border-[#d9cbbb] bg-transparent py-3 pl-7 pr-2 text-sm outline-none focus:border-[#1f1a17]"
              placeholder="Travelers"
              required
            />
          </div>
          <input
            type="number"
            min={1}
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            className="border-b border-[#d9cbbb] bg-transparent px-2 py-3 text-sm outline-none focus:border-[#1f1a17] md:col-span-1"
            placeholder="Trip days"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-6 bt-button mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Request A Callback'}
          </button>
        </form>

        {message ? <p className="mt-4 text-center text-sm font-medium text-[#2f5a3f]">{message}</p> : null}
        {error ? <p className="mt-4 text-center text-sm font-medium text-[#9c3d2a]">{error}</p> : null}
      </div>
    </section>
  );
}
