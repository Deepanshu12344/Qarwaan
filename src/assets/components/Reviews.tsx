import { Star } from 'lucide-react';

interface Review {
  id: number;
  quote: string;
  description: string;
  author: string;
  source: string;
  rating: number;
  image: string;
}

const reviews: Review[] = [
  {
    id: 1,
    quote: 'Everything was mapped perfectly day by day',
    description:
      'We booked a 5-day Dubai plan and did not have to chase vendors once. The coordinator handled transfers, tickets and timing perfectly.',
    author: 'Ritika S.',
    source: 'Dubai Weekend Plus',
    rating: 5,
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    quote: 'Great for family travel with seniors',
    description:
      'Our Kashmir itinerary had rest windows, easy-paced sightseeing and smooth local transport. Exactly the kind of planning we wanted.',
    author: 'Amit D.',
    source: 'Kashmir Valley Escape',
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    quote: 'They converted our 7-day trip into 4-day quickly',
    description:
      'We had a schedule change before departure, and the team replanned our Thailand package within hours with clear pricing differences.',
    author: 'Neha P.',
    source: 'Thailand Island Trails',
    rating: 5,
    image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function Reviews() {
  return (
    <section className="container mx-auto px-5 py-16 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[#112211]">Client Feedback</h2>
          <p className="text-gray-600">What travelers say about our planned package experience.</p>
        </div>
        <button className="rounded-lg border border-[#8DD3BB] px-6 py-2 text-[#112211] transition hover:bg-gray-50">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-[#112211]">{review.quote}</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">{review.description}</p>
            <button className="mb-6 text-sm font-medium text-[#112211] hover:underline">View more</button>

            <div className="mb-4 flex gap-1">
              {[...Array(review.rating)].map((_, index) => (
                <Star key={`${review.id}-${index}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <div className="mb-4">
              <p className="font-semibold text-[#112211]">{review.author}</p>
              <p className="text-sm text-gray-600">{review.source}</p>
            </div>

            <p className="mb-4 text-sm text-gray-500">Google Reviews</p>

            <img src={review.image} alt={review.author} className="h-48 w-full rounded-xl object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
