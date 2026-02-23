import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin(username, password);
      navigate('/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf8] px-5 py-20 md:px-8">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_40px_rgba(17,34,17,0.1)]">
        <h1 className="text-3xl font-bold text-[#112211]">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to manage trips, CRM and payments.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-[#8DD3BB] focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#112211] px-4 py-3 font-semibold text-white transition hover:bg-[#0a130a] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </section>
    </main>
  );
}
