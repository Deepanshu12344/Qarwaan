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
    <section className="container mx-auto px-5 py-16 md:px-8">
      <div className="bg-[#CDEAE1] rounded-3xl p-12 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Subscribe<br />Newsletter
            </h2>
            <div className="mb-6">
              <p className="text-2xl font-bold mb-2">The Travel</p>
              <p className="text-gray-700">Get inspired! Receive travel discounts, tips and behind the scenes stories.</p>
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#112211]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#112211] cursor-pointer text-white px-8 py-4 rounded-lg font-medium transition disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-medium text-emerald-800">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
          </div>

          <div className="relative h-64 overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1100"
              alt="Tropical travel inspiration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#112211]/60 to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">Weekly custom trip ideas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
