import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import EnquirePage from './assets/pages/EnquirePage';
import { HomePage } from './assets/pages/HomePage';
import TripFinderPage from './assets/pages/TripFinderPage';
import TripDetailPage from './assets/pages/TripDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/enquire" element={<EnquirePage />} />
        <Route path="/trip-finder" element={<TripFinderPage />} />
        <Route path="/trip-finder/:slug" element={<TripDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
