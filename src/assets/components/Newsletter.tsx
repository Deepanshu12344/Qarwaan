import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-[#CDEAE1] rounded-3xl p-12 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Subscribe<br />Newsletter
            </h2>
            <div className="mb-6">
              <p className="text-2xl font-bold mb-2">The Travel</p>
              <p className="text-gray-700">Get inspired! Receive travel discounts, tips and behind the scenes stories.</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#112211]"
                />
              </div>
              <button className="bg-[#112211] cursor-pointer text-white px-8 py-4 rounded-lg font-medium transition">
                Subscribe
              </button>
            </div>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl transform rotate-12"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-rose-400 to-orange-500 rounded-3xl transform -rotate-6"></div>
                <div className="absolute bottom-0 left-8 w-32 h-24 bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
