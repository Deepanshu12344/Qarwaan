import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getMyBookings, getMyReferrals, getMySavedTrips, updateMyProfile } from '../../lib/api';
import { useAuth } from '../../context/useAuth';
import { useSitePreferences } from '../../context/useSitePreferences';
import type { BookingRecord } from '../../types/admin';
import type { Trip } from '../../types/trip';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, refresh } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'en');
  const [currency, setCurrency] = useState(user?.preferredCurrency || 'INR');
  const [referral, setReferral] = useState<{
    referralCode: string;
    referralCount: number;
    users: Array<{ _id: string; name: string; email: string; createdAt: string }>;
    rewards: Array<{ _id: string; couponCode: string; rewardValue: number; status: 'issued' | 'redeemed' | 'expired'; createdAt: string }>;
  }>({ referralCode: '', referralCount: 0, users: [], rewards: [] });
  const { t, setLanguage: setSiteLanguage, setCurrency: setSiteCurrency, formatMoney } = useSitePreferences();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [bookingData, savedData, referralData] = await Promise.all([getMyBookings(), getMySavedTrips(), getMyReferrals()]);
        setBookings(bookingData);
        setSavedTrips(savedData);
        setReferral(referralData.referral);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load account');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading, navigate]);

  const savePreferences = async () => {
    setError('');
    setMessage('');
    try {
      await updateMyProfile({ preferredLanguage: language, preferredCurrency: currency });
      await refresh();
      setSiteLanguage(language === 'hi' ? 'hi' : 'en');
      setSiteCurrency(currency === 'USD' || currency === 'EUR' ? currency : 'INR');
      setMessage('Preferences updated');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update preferences');
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-gray-600">Loading account...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative overflow-hidden bg-[#112211] pb-20">
        <Header />
        <div className="container mx-auto px-5 pt-36 text-white md:px-8">
          <h1 className="text-4xl font-extrabold">My Account</h1>
          <p className="mt-2 text-white/85">{user.name} ({user.email})</p>
        </div>
      </div>

      <main className="container mx-auto space-y-6 px-5 py-8 md:px-8 md:py-10">
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#112211]">{t('preferences')}</h2>
          <div className="mt-4 space-y-3">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button onClick={savePreferences} className="w-full rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white">
              {t('save_preferences')}
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full rounded-lg border border-[#112211] px-4 py-2 text-sm font-semibold text-[#112211]">
              {t('logout')}
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#112211]">{t('booking_history')}</h2>
          <div className="mt-4 space-y-3">
            {bookings.length === 0 ? <p className="text-sm text-gray-600">No bookings yet.</p> : bookings.map((item) => (
              <article key={item._id} className="rounded-lg border p-3">
                <p className="font-semibold text-[#112211]">{item.tripName}</p>
                <p className="text-sm text-gray-600">{item.travelers} travelers | {formatMoney(item.totalAmount)} | {item.bookingStatus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#112211]">{t('saved_trips')}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {savedTrips.length === 0 ? <p className="text-sm text-gray-600">No saved trips yet.</p> : savedTrips.map((trip) => (
              <Link key={trip._id} to={`/trips/${trip.slug}`} className="rounded-lg border p-3 transition hover:bg-[#f8fcfa]">
                <p className="font-semibold text-[#112211]">{trip.name}</p>
                <p className="text-sm text-gray-600">{trip.location}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#112211]">Referral Program</h2>
          <p className="mt-2 text-sm text-gray-600">Your referral code: <span className="font-semibold text-[#112211]">{referral.referralCode || user.referralCode || '-'}</span></p>
          <p className="text-sm text-gray-600">Total referrals: {referral.referralCount}</p>
          <p className="text-sm text-gray-600">Reward coupons issued: {referral.rewards.length}</p>
          <div className="mt-3 max-h-64 space-y-2 overflow-auto pr-1">
            {referral.users.length === 0 ? (
              <p className="text-sm text-gray-600">No referrals yet.</p>
            ) : (
              referral.users.map((item) => (
                <div key={item._id} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold text-[#112211]">{item.name}</p>
                  <p className="text-gray-600">{item.email} | Joined {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
            {referral.rewards.length === 0 ? (
              <p className="text-sm text-gray-600">No reward coupons issued yet.</p>
            ) : (
              referral.rewards.map((item) => (
                <div key={item._id} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold text-[#112211]">Coupon: {item.couponCode}</p>
                  <p className="text-gray-600">Reward: {formatMoney(item.rewardValue)} | Status: {item.status}</p>
                  <p className="text-xs text-gray-500">Issued {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
