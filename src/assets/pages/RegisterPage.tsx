import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useSitePreferences } from '../../context/useSitePreferences';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setLanguage, setCurrency } = useSitePreferences();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, preferredLanguage, preferredCurrency, referralCode: referralCode.trim() || undefined });
      setLanguage(preferredLanguage === 'hi' ? 'hi' : 'en');
      setCurrency(preferredCurrency === 'USD' || preferredCurrency === 'EUR' ? preferredCurrency : 'INR');
      navigate('/account');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf8] px-5 py-20 md:px-8">
      <section className="mx-auto w-full max-w-lg rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_40px_rgba(17,34,17,0.1)]">
        <h1 className="text-3xl font-bold text-[#112211]">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">Personalize language/currency and manage bookings.</p>
        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Password (min 6)" className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2" />
          <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral code (optional)" className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none md:col-span-2" />
          <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <select value={preferredCurrency} onChange={(e) => setPreferredCurrency(e.target.value)} className="rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none">
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button disabled={loading} className="rounded-lg bg-[#112211] px-4 py-3 font-semibold text-white disabled:opacity-60 md:col-span-2">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <p className="mt-5 text-sm text-gray-700">
          Already have an account? <Link to="/login" className="font-semibold text-[#112211] underline">Login</Link>
        </p>
      </section>
    </main>
  );
}
