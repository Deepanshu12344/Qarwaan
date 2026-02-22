import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#8DD3BB] py-12">
      <div className="container mx-auto px-4">
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
              <li><a href="#" className="hover:underline">Canada</a></li>
              <li><a href="#" className="hover:underline">Alaska</a></li>
              <li><a href="#" className="hover:underline">France</a></li>
              <li><a href="#" className="hover:underline">Iceland</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Activities</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Northern Lights</a></li>
              <li><a href="#" className="hover:underline">Cruising & sailing</a></li>
              <li><a href="#" className="hover:underline">Multi-activities</a></li>
              <li><a href="#" className="hover:underline">Kayaking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Travel Blogs</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Bali Travel Guide</a></li>
              <li><a href="#" className="hover:underline">Sri Lanks Travel Guide</a></li>
              <li><a href="#" className="hover:underline">Peru Travel Guide</a></li>
              <li><a href="#" className="hover:underline">Bali Travel Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Our Story</a></li>
              <li><a href="#" className="hover:underline">Work with us</a></li>
            </ul>
            <h4 className="font-semibold mb-4 mt-6">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Our Story</a></li>
              <li><a href="#" className="hover:underline">Work with us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
