import { useContext } from 'react';
import { SitePreferencesContext } from './site-preferences-context';

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);
  if (!context) {
    throw new Error('useSitePreferences must be used inside SitePreferencesProvider');
  }
  return context;
}
