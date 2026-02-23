import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#8DD3BB] py-12">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Qarwaan</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Destinations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Kashmir</a></li>
              <li><a href="#" className="hover:underline">Kerala</a></li>
              <li><a href="#" className="hover:underline">Dubai</a></li>
              <li><a href="#" className="hover:underline">Thailand</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Trip Planning</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/trips" className="hover:underline">All Packages</Link></li>
              <li><Link to="/trips?sort=rating" className="hover:underline">Top Rated Trips</Link></li>
              <li><Link to="/trips?category=Domestic" className="hover:underline">Domestic Tours</Link></li>
              <li><Link to="/contact" className="hover:underline">Custom Duration</Link></li>
              <li><Link to="/guides" className="hover:underline">Travel Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Travel Styles</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Family Holidays</a></li>
              <li><a href="#" className="hover:underline">Honeymoon Trips</a></li>
              <li><a href="#" className="hover:underline">Friends Group Tours</a></li>
              <li><a href="#" className="hover:underline">Senior-friendly Trips</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/" className="hover:underline">Our Story</Link></li>
              <li><a href="#" className="hover:underline">Work with us</a></li>
              <li><Link to="/legal/terms" className="hover:underline">Terms</Link></li>
              <li><Link to="/legal/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link to="/legal/cancellation" className="hover:underline">Cancellation</Link></li>
              <li><Link to="/legal/visa" className="hover:underline">Visa Disclaimer</Link></li>
            </ul>
            <h4 className="font-semibold mb-4 mt-6">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="tel:+919999999999" className="hover:underline">+91 99999 99999</a></li>
              <li><a href="mailto:hello@qarwaan.com" className="hover:underline">hello@qarwaan.com</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
