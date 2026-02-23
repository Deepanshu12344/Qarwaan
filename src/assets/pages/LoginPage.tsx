import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/account');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf8] px-5 py-20 md:px-8">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_40px_rgba(17,34,17,0.1)]">
        <h1 className="text-3xl font-bold text-[#112211]">Traveler Login</h1>
        <p className="mt-2 text-sm text-gray-600">Access saved trips, booking history and reviews.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none" />
          <button disabled={loading} className="w-full rounded-lg bg-[#112211] px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <p className="mt-5 text-sm text-gray-700">
          New here? <Link to="/register" className="font-semibold text-[#112211] underline">Create account</Link>
        </p>
      </section>
    </main>
  );
}
