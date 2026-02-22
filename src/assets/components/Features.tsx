import { Plane, Hotel } from 'lucide-react';

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 rounded-2xl overflow-hidden group">
          <img
            src="https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Flights"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-4xl font-bold mb-2">Flights</h3>
              <p className="text-sm mb-6 opacity-90">Search Flights & Places Hire to our most popular destinations</p>
              <button className="bg-[#8DD3BB] hover:bg-emerald-600 text-black px-6 py-3 rounded-lg font-medium transition flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Show Flights
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-96 rounded-2xl overflow-hidden group">
          <img
            src="https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Hotels"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-4xl font-bold mb-2">Hotels</h3>
              <p className="text-sm mb-6 opacity-90">Search hotels & Places Hire to our most popular destinations</p>
              <button className="bg-[#8DD3BB] hover:bg-emerald-600 text-black px-6 py-3 rounded-lg font-medium transition flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Show Hotels
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
