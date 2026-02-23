import { Plane, Hotel } from 'lucide-react';
import { Compass, Phone } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useSitePreferences } from '../../context/useSitePreferences';

export default function Header() {
  const { user } = useAuth();
  const { t, language, currency, setLanguage, setCurrency } = useSitePreferences();

  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <nav className="container mx-auto flex items-center justify-between px-5 py-6 md:px-8">
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/trips"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-white/15"
          >
            <Plane className="w-4 h-4" />
            <span className="text-sm font-medium">{t('packages')}</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-white/15"
          >
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-medium">{t('custom_days')}</span>
          </Link>
          <Link
            to="/itinerary-builder"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-white/15"
          >
            <span className="text-sm font-medium">{t('builder')}</span>
          </Link>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <Compass className="h-5 w-5 text-[#8DD3BB]" />
          <h1 className="text-2xl font-bold tracking-wider text-white">Qarwaan</h1>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink to="/" className="text-sm font-medium text-white/90 hover:text-white">
            {t('home')}
          </NavLink>
          <NavLink to="/trips" className="text-sm font-medium text-white/90 hover:text-white">
            {t('trips')}
          </NavLink>
          <NavLink to="/contact" className="text-sm font-medium text-white/90 hover:text-white">
            {t('contact')}
          </NavLink>
          <NavLink to="/guides" className="text-sm font-medium text-white/90 hover:text-white">
            {t('guides')}
          </NavLink>
          {user ? (
            <NavLink to="/account" className="text-sm font-medium text-white/90 hover:text-white">
              {t('account')}
            </NavLink>
          ) : (
            <NavLink to="/login" className="text-sm font-medium text-white/90 hover:text-white">
              {t('login')}
            </NavLink>
          )}
          <div className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1">
            <select value={language} onChange={(e) => setLanguage((e.target.value as 'en' | 'hi'))} className="bg-transparent text-xs text-white outline-none">
              <option value="en" className="text-black">EN</option>
              <option value="hi" className="text-black">HI</option>
            </select>
            <select value={currency} onChange={(e) => setCurrency((e.target.value as 'INR' | 'USD' | 'EUR'))} className="bg-transparent text-xs text-white outline-none">
              <option value="INR" className="text-black">INR</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
            </select>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#8DD3BB] px-4 py-2 text-sm font-semibold text-[#112211] transition hover:bg-[#7ec6ac]"
          >
            <Phone className="h-4 w-4" />
            {t('plan_my_trip')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
