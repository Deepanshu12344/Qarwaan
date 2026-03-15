export default function VideoSection() {
  return (
    <section id="video" className="relative min-h-[50vh] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative mx-auto flex min-h-[50vh] max-w-[1200px] flex-col items-center justify-center px-4 text-center text-white">
        <h2 className="text-5xl font-semibold tracking-[0.18em] md:text-6xl">THIS IS BORING</h2>
        <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
          Luxury travel should not feel predictable.
        </p>
        <div className="mt-8">
          <a
            href="#pursuit"
            className="q-button !border-transparent !text-white hover:!border-white hover:!bg-transparent hover:!text-white"
          >
            Discover More
          </a>
        </div>
      </div>
    </section>
  );
}
