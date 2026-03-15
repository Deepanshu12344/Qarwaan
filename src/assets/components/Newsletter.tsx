import { Mail } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { subscribeNewsletter } from '../../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await subscribeNewsletter(email);
      setMessage(response.message);
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to subscribe right now');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#d86b4a] py-20 text-white">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <p className="bt-kicker text-white/80">Newsletter</p>
            <h2 className="mt-4 text-4xl font-semibold">So, ready to start?</h2>
            <p className="mt-4 text-sm text-white/80">
              Get inspired with handcrafted itineraries, insider access, and the journeys we are dreaming up.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-full bg-white/15 px-12 py-4 text-sm text-white placeholder:text-white/70 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f1a17] transition disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-medium text-white">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-medium text-white">{error}</p> : null}
          </div>

          <div className="relative h-72 overflow-hidden rounded-[28px] border border-white/30">
            <img
              src="https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Tropical travel inspiration"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.25em] text-white">Weekly ideas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
