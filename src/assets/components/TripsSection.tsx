const tripCards = [
  {
    title: 'Japan',
    description: 'Temple towns, alpine hot springs, and modern edge.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Italy',
    description: 'Lake stays, vineyard tables, and art-filled mornings.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Morocco',
    description: 'Riads, desert light, and aromatic markets.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Peru',
    description: 'Sacred valleys, rail journeys, and rare landscapes.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Iceland',
    description: 'Volcanic coasts, glacial lagoons, and northern light.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Greece',
    description: 'Cycladic cliffs, island tastings, and blue-white calm.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Thailand',
    description: 'Hidden coves, spice markets, and temple mornings.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  },
];

export default function TripsSection() {
  return (
    <section id="trips" className="bg-black py-12 md:py-16">
      <div className="w-full">
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          <article className="min-w-[320px] max-w-[320px] flex-shrink-0 snap-start px-4 md:px-10">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Explore Our Trips</h2>
            <p className="mt-4 text-sm text-white/70">
              Curated destinations for travelers who want a story worth telling.
            </p>
          </article>
          {tripCards.map((trip) => (
            <article
              key={trip.title}
              className="group relative min-w-[320px] max-w-[320px] flex-shrink-0 snap-start overflow-hidden bg-black"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700"
                style={{ backgroundImage: `url(${trip.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90 group-hover:via-black/50" />
              <div className="relative flex h-[500px] flex-col justify-between p-6 text-white">
                <div className="flex justify-end">
                  <span className="border border-white/60 bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
                    8 Nights
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold transition-transform duration-300 group-hover:-translate-y-2">
                    {trip.title}
                  </h3>
                  <p className="max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
                    {trip.description}
                  </p>
                  <button className="mt-2 border border-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-white hover:text-black">
                    View Package
                  </button>
                </div>
              </div>
            </article>
          ))}
          <div className="min-w-[24px] flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
