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
    quote: "A real sense of community, nurtured",
    description: "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for helping me always, even when I was out of the country. And always available when needed.",
    author: "Olga",
    source: "Weave Studios – Kai Tak",
    rating: 5,
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 2,
    quote: "The facilities are superb. Clean, slick, bright.",
    description: "A real sense of community, nurtured really appreciate the help and support from the staff during these tough times.",
    author: "Thomas",
    source: "Weave Studios – Olympic",
    rating: 5,
    image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 3,
    quote: "A real sense of community, nurtured",
    description: "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for helping me always, even when I was out of the country. And always available when needed.",
    author: "Eliot",
    source: "Weave Studios – Kai Tak",
    rating: 5,
    image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function Reviews() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Reviews</h2>
          <p className="text-gray-600">What people says about Gorlobe facilities</p>
        </div>
        <button className="px-6 py-2 border border-[#8DD3BB] rounded-lg hover:bg-gray-50 transition">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-4">{review.quote}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{review.description}</p>
            <button className="text-sm font-medium mb-6 hover:underline">View more</button>

            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <div className="mb-4">
              <p className="font-semibold">{review.author}</p>
              <p className="text-sm text-gray-600">{review.source}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              Google
            </div>

            <img
              src={review.image}
              alt={review.author}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
