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
    <section className="bg-[#f4efe7] py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="bt-kicker text-[#8c7c72]">Client Feedback</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1f1a17] md:text-4xl">The trips that linger</h2>
            <p className="mt-2 text-sm text-[#6b5f57]">Short notes from travelers who found their perfect story.</p>
          </div>
          <button className="bt-button bt-button-outline text-[#1f1a17]">See All</button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[26px] border border-[#e0d3c5] bg-white p-6">
              <img src={review.image} alt={review.author} loading="lazy" className="mb-6 h-44 w-full rounded-[18px] object-cover" />
              <p className="bt-kicker text-[#b38f6b]">Review</p>
              <h3 className="mb-3 mt-3 text-xl font-semibold text-[#1f1a17]">{review.quote}</h3>
              <p className="mb-6 text-sm leading-relaxed text-[#6b5f57]">{review.description}</p>

              <div className="mb-4 flex gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={`${review.id}-${index}`} className="h-4 w-4 fill-[#b38f6b] text-[#b38f6b]" />
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1f1a17]">{review.author}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8c7c72]">{review.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
