import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VideoSection() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section id="video" className="relative min-h-[50vh] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
      >
        <source src="/main-bg-video.mp4" type="video/mp4" />
      </video>
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
      <button
        type="button"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        onClick={() => setIsMuted((prev) => !prev)}
        className="absolute bottom-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/40 text-white transition hover:bg-white hover:text-black"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </section>
  );
}
