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
      <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_30px_70px_rgba(17,34,17,0.12)] md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#112211]">Plan My Trip in 30 Seconds</h3>
            <p className="text-sm text-gray-600">Tell us your basics including custom trip days and our expert will call you.</p>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-7" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2"
            required
          />
          <div className="relative md:col-span-2">
            <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#8DD3BB] focus:outline-none"
              required
            />
          </div>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2"
          />
          <div className="relative md:col-span-2">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Preferred month (e.g. June)"
              value={travelMonth}
              onChange={(event) => setTravelMonth(event.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#8DD3BB] focus:outline-none"
            />
          </div>
          <div className="relative md:col-span-1">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(event) => setTravelers(event.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#8DD3BB] focus:outline-none"
              placeholder="Travelers"
              required
            />
          </div>
          <input
            type="number"
            min={1}
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-1"
            placeholder="Trip days"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#112211] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a130a] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-1"
          >
            {loading ? 'Submitting...' : 'Get Callback'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
