import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboardPage from './assets/pages/AdminDashboardPage';
import AdminLoginPage from './assets/pages/AdminLoginPage';
import AccountPage from './assets/pages/AccountPage';
import ContactPage from './assets/pages/ContactPage';
import { HomePage } from './assets/pages/HomePage';
import InvoicePage from './assets/pages/InvoicePage';
import ItineraryBuilderPage from './assets/pages/ItineraryBuilderPage';
import LegalPage from './assets/pages/LegalPage';
import LoginPage from './assets/pages/LoginPage';
import RegisterPage from './assets/pages/RegisterPage';
import GuidesPage from './assets/pages/GuidesPage';
import SeoLandingPage from './assets/pages/SeoLandingPage';
import TripDetailPage from './assets/pages/TripDetailPage';
import TripsPage from './assets/pages/TripsPage';
import { AuthProvider } from './context/AuthContext';
import { SitePreferencesProvider } from './context/SitePreferencesProvider';
import { trackPageView } from './lib/analytics';

function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <SitePreferencesProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsRouteTracker />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/trips' element={<TripsPage />} />
            <Route path='/trips/:slug' element={<TripDetailPage />} />
            <Route path='/invoice/:paymentId' element={<InvoicePage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/itinerary-builder' element={<ItineraryBuilderPage />} />
            <Route path='/guides' element={<GuidesPage />} />
            <Route path='/discover/:type/:slug' element={<SeoLandingPage />} />
            <Route path='/legal/:slug' element={<LegalPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/admin/login' element={<AdminLoginPage />} />
            <Route path='/admin' element={<AdminDashboardPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SitePreferencesProvider>
  );
}

export default App;
