import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EnquirePage from './assets/pages/EnquirePage';
import { HomePage } from './assets/pages/HomePage';
import TripFinderPage from './assets/pages/TripFinderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/enquire" element={<EnquirePage />} />
        <Route path="/trip-finder" element={<TripFinderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
