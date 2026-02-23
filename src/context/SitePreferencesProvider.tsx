import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  SitePreferencesContext,
  type AppCurrency,
  type AppLanguage,
  type SitePreferencesContextValue,
} from './site-preferences-context';
import { getFxRates } from '../lib/api';

const LABELS: Record<AppLanguage, Record<string, string>> = {
  en: {
    home: 'Home',
    trips: 'Trips',
    contact: 'Contact',
    guides: 'Guides',
    account: 'Account',
    login: 'Login',
    packages: 'Packages',
    custom_days: 'Custom Days',
    builder: 'Builder',
    plan_my_trip: 'Plan My Trip',
    booking_history: 'Booking History',
    saved_trips: 'Saved Trips',
    preferences: 'Preferences',
    save_preferences: 'Save Preferences',
    logout: 'Logout',
    per_traveler: 'per traveler',
  },
  hi: {
    home: 'होम',
    trips: 'ट्रिप्स',
    contact: 'संपर्क',
    guides: 'गाइड्स',
    account: 'अकाउंट',
    login: 'लॉगिन',
    packages: 'पैकेज',
    custom_days: 'कस्टम डेज',
    builder: 'बिल्डर',
    plan_my_trip: 'मेरी ट्रिप प्लान करें',
    booking_history: 'बुकिंग इतिहास',
    saved_trips: 'सेव्ड ट्रिप्स',
    preferences: 'प्रेफरेंसेस',
    save_preferences: 'प्रेफरेंसेस सेव करें',
    logout: 'लॉगआउट',
    per_traveler: 'प्रति यात्री',
  },
};

const FALLBACK_RATES: Record<AppCurrency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
};

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') return 'en';
    const value = localStorage.getItem('qarwaan_language');
    return value === 'hi' ? 'hi' : 'en';
  });
  const [currency, setCurrency] = useState<AppCurrency>(() => {
    if (typeof window === 'undefined') return 'INR';
    const value = localStorage.getItem('qarwaan_currency');
    return value === 'USD' || value === 'EUR' ? value : 'INR';
  });
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);

  useEffect(() => {
    let cancelled = false;
    getFxRates('INR')
      .then((data) => {
        if (cancelled) return;
        setRates((prev) => ({
          ...prev,
          ...(data.rates || {}),
          INR: 1,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setRates((prev) => ({
          ...FALLBACK_RATES,
          ...prev,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      language,
      currency,
      setLanguage: (next) => {
        setLanguage(next);
        if (typeof window !== 'undefined') localStorage.setItem('qarwaan_language', next);
      },
      setCurrency: (next) => {
        setCurrency(next);
        if (typeof window !== 'undefined') localStorage.setItem('qarwaan_currency', next);
      },
      t: (key: string) => LABELS[language][key] || key,
      formatMoney: (inrAmount: number) => {
        const converted = inrAmount * (rates[currency] || FALLBACK_RATES[currency] || 1);
        const formatter = new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: currency === 'INR' ? 0 : 2,
        });
        return formatter.format(converted);
      },
    }),
    [currency, language, rates]
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}
