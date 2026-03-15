export default function PursuitSection() {
  return (
    <section id="pursuit" className="bg-white py-0">
      <div className="grid w-full grid-cols-1 items-center gap-10 px-0 md:grid-cols-2">
        <div className="h-[520px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80"
            alt="Pursuit of feeling"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="mx-auto w-full max-w-[600px] px-4">
          <p className="q-kicker text-gray-500">Pursuit</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Pursuit of Feeling</h2>
          <p className="mt-4 text-base text-gray-600">
            We design travel around emotion: the hush of a hidden temple, the glide of a private train, the warmth of a
            table lit by candlelight. Those feelings become the souvenir you keep.
          </p>
          <div className="mt-8">
            <a href="#guide" className="q-button">
              Read More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
