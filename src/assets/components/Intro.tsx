export default function Intro() {
  return (
    <section id="intro" className="bg-white py-20 md:py-[100px]">
      <div className="mx-auto max-w-[1200px] px-4 text-center">
        <p className="q-kicker text-gray-500">Travel Philosophy</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          Travel should feel like a beautifully written story, with every chapter crafted around you.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base text-gray-600">
          QARWAAN designs immersive journeys that balance discovery and indulgence. We craft each itinerary with
          editorial care, a global network of specialists, and the kind of surprise that turns a trip into a memory.
        </p>
        <div className="mt-8">
          <a href="/enquire" className="q-button">
            Let Us Design Your Journey
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            'Bespoke travel experiences',
            'Completely unique journeys',
            'A global network of specialists',
            'Award-winning service',
          ].map((item) => (
            <div key={item} className="flex flex-col items-center gap-3 text-sm text-gray-700">
              <span className="h-10 w-10 rounded-full border border-black/10" />
              <p className="max-w-[200px] text-center">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
