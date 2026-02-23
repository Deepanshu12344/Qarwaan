import { createContext } from 'react';

export type AppLanguage = 'en' | 'hi';
export type AppCurrency = 'INR' | 'USD' | 'EUR';

export type SitePreferencesContextValue = {
  language: AppLanguage;
  currency: AppCurrency;
  setLanguage: (value: AppLanguage) => void;
  setCurrency: (value: AppCurrency) => void;
  t: (key: string) => string;
  formatMoney: (inrAmount: number) => string;
};

export const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);
