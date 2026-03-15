import { useState } from 'react';

const journeyCards = [
  {
    title: 'Adventure',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Culture',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Food & Wine',
    image:
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Wildlife & Nature',
    image:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Mountains',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
];

export default function JourneyGrid() {
  const tabs = ['By Traveller', 'Most Popular', 'By Month', 'In The Spotlight'];
  const [activeTab, setActiveTab] = useState(0);

  const mostPopular = journeyCards.slice(0, 3);
  const spotlight = journeyCards.slice(2, 5);
  const monthImages = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <section
      id="journey"
      className="bg-[#f2f2f2] py-20 md:py-[100px]"
    >
      <div className="mx-auto max-w-[1200px] px-0">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold uppercase tracking-[0.18em] md:text-4xl">
            START YOUR JOURNEY
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-10">
            {tabs.map((tab, index) => {
              const isActive = index === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`group relative pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 ${
                    isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {tab}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] bg-pink-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-5">
            {journeyCards.map((card) => (
              <article key={card.title} className="group relative h-[340px] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                    {card.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-6">
            {months.map((month, index) => (
              <article key={month} className="group relative h-[260px] overflow-hidden">
                <img
                  src={monthImages[index % monthImages.length]}
                  alt={month}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
                    {month}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab !== 0 && activeTab !== 2 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {(activeTab === 1 ? mostPopular : spotlight).map((card) => (
                <article key={card.title} className="group relative h-[360px] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                      {card.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button className="q-button">View More</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
