import Header from '../components/Header';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SearchForm from '../components/Searchform';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SearchForm />
      <Destinations />
      <Features />
      <Reviews />
      <Newsletter />
      <Footer />
    </div>
  )
}

