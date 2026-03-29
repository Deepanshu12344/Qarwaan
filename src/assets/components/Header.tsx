import { Phone } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useSitePreferences } from '../../context/useSitePreferences';

type HeaderProps = {
  variant?: 'light' | 'dark';
};

export default function Header({ variant = 'dark' }: HeaderProps) {
  const { user } = useAuth();
  const { t, language, currency, setLanguage, setCurrency } = useSitePreferences();
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#1f1a17]';
  const mutedTextColor = isLight ? 'text-white/80' : 'text-[#6b5f57]';
  const borderColor = isLight ? 'border-white/40' : 'border-[#1f1a17]/20';
  const buttonBorder = isLight ? 'border-white/70' : 'border-[#1f1a17]';
  const buttonHover = isLight ? 'hover:bg-white hover:text-black' : 'hover:bg-[#1f1a17] hover:text-white';

  return (
    <header className={`absolute left-0 right-0 top-0 z-20 ${textColor}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div className="hidden items-center gap-6 text-xs tracking-[0.3em] md:flex">
          <NavLink to="/trips" className={`uppercase ${mutedTextColor} ${isLight ? 'hover:text-white' : 'hover:text-black'}`}>
            {t('trips')}
          </NavLink>
          <NavLink to="/guides" className={`uppercase ${mutedTextColor} ${isLight ? 'hover:text-white' : 'hover:text-black'}`}>
            {t('guides')}
          </NavLink>
          <NavLink to="/contact" className={`uppercase ${mutedTextColor} ${isLight ? 'hover:text-white' : 'hover:text-black'}`}>
            {t('contact')}
          </NavLink>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
          <img
            src={isLight ? '/qarwaan-logo-light.png' : '/qarwaan-logo-dark.png'}
            alt="Qarwaan"
            className="h-8 w-[96px] md:h-10 md:w-[120px]"
            loading="eager"
          />
        </div>

        <div className="hidden items-center gap-4 text-xs tracking-[0.2em] md:flex">
          {user ? (
            <NavLink to="/account" className={`uppercase ${mutedTextColor} ${isLight ? 'hover:text-white' : 'hover:text-black'}`}>
              {t('account')}
            </NavLink>
          ) : (
            <NavLink to="/login" className={`uppercase ${mutedTextColor} ${isLight ? 'hover:text-white' : 'hover:text-black'}`}>
              {t('login')}
            </NavLink>
          )}
          <div className={`flex items-center gap-1 rounded-full border px-2 py-1 ${borderColor}`}>
            <select
              value={language}
              onChange={(e) => setLanguage((e.target.value as 'en' | 'hi'))}
              className={`bg-transparent text-[0.65rem] uppercase outline-none ${isLight ? 'text-white' : 'text-[#1f1a17]'}`}
            >
              <option value="en" className="text-black">EN</option>
              <option value="hi" className="text-black">HI</option>
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency((e.target.value as 'INR' | 'USD' | 'EUR'))}
              className={`bg-transparent text-[0.65rem] uppercase outline-none ${isLight ? 'text-white' : 'text-[#1f1a17]'}`}
            >
              <option value="INR" className="text-black">INR</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
            </select>
          </div>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] transition ${buttonBorder} ${buttonHover}`}
          >
            <Phone className="h-3.5 w-3.5" />
            {t('plan_my_trip')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
