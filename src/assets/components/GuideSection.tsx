export default function GuideSection() {
  return (
    <section id="guide" className="bg-white py-0">
      <div className="grid w-full grid-cols-1 items-center gap-10 px-0 md:grid-cols-2">
        <div className="mx-auto w-full max-w-[600px] px-4">
          <p className="q-kicker text-gray-500">Guide</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Our Guide to Luxury Travel</h2>
          <p className="mt-4 text-base text-gray-600">
            Learn how we blend discretion, storytelling, and design to craft unforgettable experiences. Our guide is a
            window into the details that make QARWAAN different.
          </p>
          <div className="mt-8">
            <a href="#cta" className="q-button">
              Discover More
            </a>
          </div>
        </div>
        <div className="h-[520px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury guide"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
