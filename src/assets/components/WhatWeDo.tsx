export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="bg-white pt-10 md:pt-[50px]">
      <div className="grid w-full grid-cols-1 items-center gap-10 px-0 md:grid-cols-2">
        <div className="mx-auto w-full max-w-[600px] px-4">
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Journeys designed with intention</h2>
          <p className="mt-4 text-base text-gray-600">
            Every trip we create is built around you — your pace, your preferences, your idea of a perfect escape.
No rushed schedules. No unnecessary stops. Just meaningful experiences.

          </p>
          <div className="mt-8">
            <a href="#guide" className="q-button">
              About Our Philosophy
            </a>
          </div>
        </div>
        <div className="h-[520px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury travel moment"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
