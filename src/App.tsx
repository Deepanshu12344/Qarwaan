import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContactPage from './assets/pages/ContactPage';
import { HomePage } from './assets/pages/HomePage';
import TripDetailPage from './assets/pages/TripDetailPage';
import TripsPage from './assets/pages/TripsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/trips' element={<TripsPage />} />
        <Route path='/trips/:slug' element={<TripDetailPage />} />
        <Route path='/contact' element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
