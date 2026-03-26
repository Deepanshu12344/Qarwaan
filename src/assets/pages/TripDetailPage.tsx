import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripsSection from '../components/TripsSection';
import CTASection from '../components/CTASection';
import { useSeo } from '../../lib/seo';
import { tripSlug } from '../../lib/slug';
import { trips } from '../data/trips';
import type { TripData, TripCard } from '../data/trips';

const buildSimilarTrips = (
  items: TripData[],
  excludeKey: string | null,
  limit = 6,
): TripCard[] => {
  const picked = new Map<string, TripCard>();
  for (const item of items) {
    const key = item.location ?? item.title;
    if (excludeKey && key.toLowerCase() === excludeKey.toLowerCase()) {
      continue;
    }
    if (!picked.has(key)) {
      picked.set(key, {
        title: item.title,
        description: item.description,
        image: item.image,
        location: item.location,
      });
    }
    if (picked.size >= limit) {
      break;
    }
  }
  return Array.from(picked.values());
};

export default function TripDetailPage() {
  const { slug } = useParams();
  const [isStuck, setIsStuck] = useState(false);
  const [hideSticky, setHideSticky] = useState(false);
  const navSentinelRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const [navThreshold, setNavThreshold] = useState<number | undefined>(undefined);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [galleryCursor, setGalleryCursor] = useState<{
    x: number;
    y: number;
    dir: 'left' | 'right';
    visible: boolean;
  }>({ x: 0, y: 0, dir: 'right', visible: false });

  const trip = useMemo(() => {
    if (!slug) {
      return null;
    }
    return trips.find((item) => tripSlug(item.title, item.location) === slug) ?? null;
  }, [slug]);

  const similarTrips = useMemo(
    () => buildSimilarTrips(trips, trip?.location ?? trip?.title ?? null),
    [trip],
  );
  const itinerary = trip?.itinerary ?? [];
  const midCarousel = trip?.midCarousel ?? [];
  const restYourHead = trip?.restYourHead ?? { title: '', items: [], ctaLabel: '' };
  const totalDays = useMemo(
    () => itinerary.reduce((acc, section) => acc + section.cards.length, 0),
    [itinerary],
  );
  const breakAfter = useMemo(() => Math.ceil(totalDays / 2), [totalDays]);

  useSeo({
    title: trip ? `${trip.title} | Trip Finder` : 'Trip Not Found | Trip Finder',
    description: trip ? trip.description : 'Discover curated journeys with Qarwaan Trip Finder.',
    path: slug ? `/trip-finder/${slug}` : '/trip-finder',
  });

  useEffect(() => {
    const sentinel = navSentinelRef.current;
    const header = document.getElementById('main-header');
    if (!sentinel || !header) {
      return;
    }

    const updateHeight = () => {
      const sentinelTop = sentinel.getBoundingClientRect().top + window.scrollY;
      const headerHeight = header.getBoundingClientRect().height;
      setNavThreshold(sentinelTop - headerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('load', updateHeight);
    const raf = window.requestAnimationFrame(updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('load', updateHeight);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const sentinel = navSentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;
        setIsStuck(stuck);
        if (!stuck) {
          setHideSticky(false);
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);

    const onScroll = () => {
      const current = window.scrollY;
      const scrollingUp = current < lastScrollY.current;
      if (isStuck) {
        setHideSticky(scrollingUp);
      }
      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [isStuck]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="light" />
        <main className="pt-28">
          <section className="mx-auto max-w-[800px] px-4 py-20 text-center">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.18em] text-black md:text-4xl">
              Trip Not Found
            </h1>
            <p className="mt-4 text-sm text-black/70">
              The trip you are looking for does not exist or has been removed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/trip-finder" className="q-button">
                Back To Trip Finder
              </Link>
              <Link to="/enquire" className="q-button q-button-outline">
                Enquire Now
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar heroOffset={navThreshold} />
      <main>
        <section ref={heroRef} className="relative min-h-[85vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${trip.image})`, backgroundAttachment: 'fixed' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

          <div className="relative mx-auto flex min-h-[85vh] max-w-[1200px] flex-col justify-center px-4 pt-24 text-white">
            <p className="q-kicker text-white/70">{trip.location ?? 'QARWAAN'}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] md:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm text-white/85 md:text-base">
              {trip.description}
            </p>
          </div>
        </section>

        <div ref={navSentinelRef} />
        <section
          className={`sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur transition-transform duration-300 ${
            isStuck && hideSticky ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-6 px-4 py-6 text-[0.7rem] uppercase tracking-[0.3em] text-black/70">
            {['Overview', 'Tokyo', 'Kanazawa', 'Kyoto', 'Tokyo', 'Other Experiences'].map((item, index) => (
              <a
                key={`${item}-${index}`}
                href={item === 'Overview' ? '#overview' : '#itinerary'}
                className="border-b-2 border-transparent pb-1 transition hover:border-black"
              >
                {item}
              </a>
            ))}
          </div>
        </section>

        <section id="overview" className="bg-white">
          <div className="mx-auto max-w-[900px] px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.18em] text-black md:text-3xl">
              {trip.title}
            </h2>
            <p className="mt-6 text-sm text-black/70">
              {(trip.overview ?? trip.description) + ' A journey designed around your pace, refined stays, and cultural immersion. Every detail is custom and curated by our travel experts.'}
            </p>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto grid max-w-[1000px] gap-10 px-4 py-12 text-center md:grid-cols-3">
            {[
              { label: 'When', value: trip?.stats?.when ?? '' },
              { label: 'Price', value: trip?.stats?.price ?? '' },
              { label: 'How Long', value: trip?.stats?.duration ?? trip?.nights ?? '' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.35em] text-black/70">{item.label}</p>
                <p className="mt-3 text-sm text-black/70">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="itinerary" className="bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-16">
            <div className="relative">
              <div className="absolute left-3 top-0 h-full w-px bg-black/10" />

              {(() => {
                let dayCursor = 0;
                return itinerary.map((section) => (
                <div key={section.id} className="relative pl-10">
                  <div className="absolute left-0 top-3 h-3 w-3 rounded-full bg-black" />
                  <div className="mb-8">
                    <h3 className="text-3xl font-semibold uppercase tracking-[0.18em] text-black">
                      {section.label}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm text-black/70">{section.intro}</p>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] text-black/60">
                      {section.daysLabel}
                    </p>
                  </div>

                  <div className="space-y-10 pb-16">
                    {section.cards.map((card, index) => {
                      dayCursor += 1;
                      const reverse = index % 2 !== 0;
                      return (
                        <div key={`${section.id}-${card.day}`}>
                          <article
                            className={`overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] ${
                              reverse ? 'md:flex-row-reverse' : ''
                            } md:flex`}
                          >
                            <div className="md:w-1/2">
                              <div
                                className="h-[440px] w-full bg-cover bg-center md:h-[520px]"
                                style={{ backgroundImage: `url(${card.image})` }}
                              />
                            </div>
                            <div className="flex flex-1 flex-col justify-center p-9 md:p-12">
                              <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                                {card.day}
                              </p>
                              <h4 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em] text-black">
                                {card.title}
                              </h4>
                              <p className="mt-4 text-sm text-black/70">{card.description}</p>
                            </div>
                          </article>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
              })()}
            </div>
          </div>
        </section>
        <section
          className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#1d1d1d] py-10 md:py-16 min-h-[90vh] flex items-center"
          style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
        >
          <div className="w-full">
            <div
              className="relative"
              style={{ cursor: 'none' }}
              onPointerMove={(event) => {
                if (event.pointerType === 'touch') {
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const dir = x < rect.width / 2 ? 'left' : 'right';
                setGalleryCursor({ x, y, dir, visible: true });
              }}
              onPointerLeave={() => {
                setGalleryCursor((prev) => ({ ...prev, visible: false }));
              }}
              onClick={(event) => {
                const container = galleryRef.current;
                if (!container) {
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                const direction = event.clientX - rect.left < rect.width / 2 ? -1 : 1;
                const firstCard = container.querySelector('div[data-card="true"]') as HTMLElement | null;
                const gap = Number.parseFloat(getComputedStyle(container).columnGap || '0');
                const step = firstCard
                  ? firstCard.getBoundingClientRect().width + gap
                  : container.clientWidth * 0.9;
                container.scrollBy({
                  left: direction * step,
                  behavior: 'smooth',
                });
              }}
            >
              <div
                ref={galleryRef}
                className="no-scrollbar flex w-full gap-6 overflow-x-hidden px-0 snap-x snap-mandatory"
                style={{ scrollPaddingLeft: 0, scrollPaddingRight: 0 }}
                onWheel={(event) => event.preventDefault()}
                onTouchMove={(event) => event.preventDefault()}
                onPointerDown={(event) => {
                  if (event.pointerType === 'mouse') {
                    event.preventDefault();
                  }
                }}
              >
                {midCarousel.map((image) => (
                  <div
                    data-card="true"
                    key={image}
                    className="min-w-[360px] max-w-[360px] flex-shrink-0 snap-start bg-black md:min-w-[680px] md:max-w-[680px]"
                  >
                    <div
                      className="h-[360px] w-full bg-cover bg-center md:h-[520px]"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  </div>
                ))}
                <div className="min-w-[24px] flex-shrink-0" />
              </div>
              <div
                className={`pointer-events-none absolute left-0 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-opacity ${
                  galleryCursor.visible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: `translate(${galleryCursor.x}px, ${galleryCursor.y}px)` }}
              >
                {galleryCursor.dir === 'left' ? '<' : '>'}
              </div>
            </div>
          </div>
        </section>


        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-4">
            <h3 className="text-center text-2xl font-semibold uppercase tracking-[0.18em] text-black md:text-3xl">
              {restYourHead.title}
            </h3>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {restYourHead.items.map((item) => (
                <article key={item.name} className="flex flex-col">
                  <div
                    className="h-[380px] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <h4 className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-black">
                    {item.name}
                  </h4>
                  <p className="mt-3 text-sm text-black/70">{item.description}</p>
                  <button className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-black">
                    {item.ctaLabel}
                  </button>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button className="q-button !bg-black !text-white !border-black">{restYourHead.ctaLabel}</button>
            </div>
          </div>
        </section>

        <TripsSection
          title="Similar Experiences"
          tagline="Start your bespoke adventure with us."
          trips={similarTrips}
          showViewMore
          viewMoreHref="/trip-finder"
        />

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
