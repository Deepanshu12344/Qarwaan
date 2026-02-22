interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  categories: string[];
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Istanbul',
    country: 'Turkey',
    image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 2,
    name: 'Sydney',
    country: 'Australia',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 3,
    name: 'Baku',
    country: 'Azerbaijan',
    image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 4,
    name: 'Male',
    country: 'Maldives',
    image: 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 5,
    name: 'Paris',
    country: 'France',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 6,
    name: 'New York',
    country: 'US',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 7,
    name: 'London',
    country: 'UK',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 8,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  },
  {
    id: 9,
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['Flights', 'Hotels', 'Resorts']
  }
];

export default function Destinations() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Plan your perfect trip</h2>
          <p className="text-gray-600">Search Flights & Places Hire to our most popular destinations</p>
        </div>
        <button className="px-6 py-2 border border-[#8DD3BB] rounded-lg hover:bg-gray-50 transition">
          See more places
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="flex gap-4 items-center p-4 border border-gray-200 rounded-xl hover:shadow-lg transition">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{destination.name}, {destination.country}</h3>
              <p className="text-sm text-gray-600">{destination.categories.join(' • ')}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
