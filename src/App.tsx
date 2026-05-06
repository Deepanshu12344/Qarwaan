import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import EnquirePage from './assets/pages/EnquirePage';
import { HomePage } from './assets/pages/HomePage';
import TripFinderPage from './assets/pages/TripFinderPage';
import TripDetailPage from './assets/pages/TripDetailPage';
import MonthPlacesPage from './assets/pages/MonthPlacesPage';
import PrivacyPolicyPage from './assets/pages/PrivacyPolicyPage';
import PlaneCursor from './assets/components/PlaneCursor';
import NormalCursor from './assets/components/NormalCursor';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  const usePlaneCursor = false;
  useEffect(() => {
    document.body.dataset.theme = 'light';
  }, []);
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <ScrollToTop />
        {usePlaneCursor ? <PlaneCursor /> : <NormalCursor />}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/enquire" element={<EnquirePage />} />
            <Route path="/trip-finder" element={<TripFinderPage />} />
            <Route path="/trip-finder/:slug" element={<TripDetailPage />} />
            <Route path="/places-for/:month" element={<MonthPlacesPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
