import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Download, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripsSection from '../components/TripsSection';
import CTASection from '../components/CTASection';
import { useSeo } from '../../lib/seo';
import { slugify, tripSlug } from '../../lib/slug';
import type { TripData, TripCard } from '../data/tripTypes';
import { useTrips } from '../data/useTrips';
import { privacyPolicyContent } from '../data/privacyPolicy';

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

const detailSections = [
  { key: 'keyAttractions', label: 'Key Attractions' },
  { key: 'hiddenGems', label: 'Hidden Gems' },
  { key: 'activities', label: 'Activities' },
  { key: 'localFood', label: 'Local Food' },
  { key: 'localExperience', label: 'Local Experience' },
  { key: 'festivals', label: 'Festivals' },
] as const;

const pickFallbackImage = (images: Array<string | undefined>, fallback: string) =>
  images.find((item) => Boolean(item)) ?? fallback;

const getKeyExperienceTitle = (experience: string | { title: string; image?: string }) =>
  typeof experience === 'string' ? experience : experience.title;

const isFaqContent = (
  content: unknown,
): content is { heading: string; items: Array<{ question: string; answer: string }> } =>
  Boolean(
    content &&
      typeof content === 'object' &&
      'heading' in content &&
      'items' in content &&
      Array.isArray((content as { items: unknown }).items),
  );

const getInfoDropdowns = (tripTitle?: string, tripLocation?: string) => {
  const tripText = `${tripTitle ?? ''} ${tripLocation ?? ''}`.toLowerCase();
  const isLadakhTrip = tripText.includes('ladakh') || tripText.includes('leh');

  return [
    {
      key: 'cancellation-policy',
      label: 'Cancellation Policy',
      content: [
        'Key Points',
        'Booking amounts are non-refundable for cancellations.',
        'Trip date changes have specific conditions (see below).',
        'Cancellation Charges',
        '30+ days before: 50% of trip cost',
        '15-30 days before: 75% of trip cost',
        '0-15 days before: 100% of trip cost',
        'Rescheduling',
        'Within 30 days: No date changes allowed',
        'Before 30 days: Free for domestic trips',
        'Force Majeure',
        'No refunds for weather/government issues - alternate activities may be offered.',
      ],
    },
    {
      key: 'privacy-policy',
      label: 'Privacy Policy',
      content: privacyPolicyContent,
    },
    {
      key: 'faqs',
      label: 'FAQs',
      content: isLadakhTrip
        ? {
            heading: 'Frequently Asked Questions',
            items: [
              {
                question: 'Do I need time to acclimatize in Ladakh?',
                answer:
                  'Yes. Ladakh is a high-altitude destination, so it is best to keep the first day in Leh lighter, drink plenty of water, and avoid overexertion while your body adjusts.',
              },
              {
                question: 'What is the best time to do this Ladakh trip?',
                answer:
                  'The most popular travel window is usually from May to September, when road access is better and conditions are generally more comfortable for sightseeing.',
              },
              {
                question: 'Is this trip suitable for families or older travellers?',
                answer:
                  'It can be, if the itinerary pace is adjusted and travellers are comfortable with altitude and long mountain drives. Any health concerns should be discussed before booking.',
              },
              {
                question: 'What kind of stays are included on this route?',
                answer:
                  'This Ladakh journey typically mixes hotel stays in Leh with camp or scenic stays in Nubra and Pangong, depending on the final plan and availability.',
              },
              {
                question: 'How difficult are the road journeys in Ladakh?',
                answer:
                  'Some drives are long and certain stretches can be rough. The scenery is a major part of the experience, but travellers should be prepared for early starts and mountain road conditions.',
              },
              {
                question: 'What should I pack for a Ladakh trip?',
                answer:
                  'Pack warm layers, sun protection, sunglasses, comfortable shoes, essential medicines, and any personal items you may need for a remote high-altitude region.',
              },
            ],
          }
        : {
            heading: 'Frequently Asked Questions',
            items: [
              {
                question: 'Can this trip be customized?',
                answer:
                  'Yes. The itinerary can be adjusted around your travel dates, pace, accommodation preferences, and the kind of experiences you want included.',
              },
              {
                question: 'When should I book?',
                answer:
                  'Booking earlier gives you better access to preferred stays, transport options, and overall route planning, especially during peak travel periods.',
              },
              {
                question: 'What is usually included in the trip cost?',
                answer:
                  'Inclusions depend on the final trip plan, but commonly cover accommodation, transfers, selected experiences, and planning support from the Qarwaan team.',
              },
            ],
          },
    },
  ] as const;
};

const shortenExperienceDescription = (text: string) => {
  const normalized = text.trim();
  if (!normalized) return normalized;
  const halfLength = Math.max(120, Math.floor(normalized.length / 2));
  if (normalized.length <= halfLength) return normalized;

  const trimmed = normalized.slice(0, halfLength);
  const lastSentence = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('! '), trimmed.lastIndexOf('? '));
  if (lastSentence >= 80) {
    return trimmed.slice(0, lastSentence + 1).trim();
  }

  const lastSpace = trimmed.lastIndexOf(' ');
  return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : halfLength).trim()}...`;
};

export default function TripDetailPage() {
  const { slug } = useParams();
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [downloadForm, setDownloadForm] = useState({
    email: '',
    phone: '',
    wantsCallback: false,
  });
  const [downloadState, setDownloadState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
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
  const [itinerarySlide, setItinerarySlide] = useState<Record<string, number>>({});
  const [itineraryCursor, setItineraryCursor] = useState<{
    key: string | null;
    x: number;
    y: number;
    dir: 'left' | 'right';
    visible: boolean;
  }>({ key: null, x: 0, y: 0, dir: 'right', visible: false });
  const [activeExperienceSlide, setActiveExperienceSlide] = useState(0);
  const [activeDetailTab, setActiveDetailTab] = useState<Record<string, string>>({});
  const [openInfoDropdown, setOpenInfoDropdown] = useState<string | null>(null);
  const [openFaqItem, setOpenFaqItem] = useState<string | null>(null);

  const { trips, loading, error } = useTrips();
  const trip = useMemo(() => {
    if (!slug) {
      return null;
    }
    return trips.find((item) => tripSlug(item.title, item.location) === slug) ?? null;
  }, [slug, trips]);
  const isLadakhTrip = useMemo(() => {
    const tripText = `${trip?.title ?? ''} ${trip?.location ?? ''}`.toLowerCase();
    return tripText.includes('ladakh') || tripText.includes('leh');
  }, [trip?.title, trip?.location]);

  const similarTrips = useMemo(
    () => buildSimilarTrips(trips, trip?.location ?? trip?.title ?? null),
    [trip, trips],
  );
  const itinerary = trip?.itinerary ?? [];
  const midCarousel = trip?.midCarousel ?? [];
  const restYourHead = trip?.restYourHead ?? { title: '', items: [], ctaLabel: '' };
  const introGallery = trip
    ? {
        bigSquare: pickFallbackImage(
          [trip.introGallery?.bigSquare, trip.midCarousel?.[0], trip.image],
          trip.image,
        ),
        wideRect: pickFallbackImage(
          [trip.introGallery?.wideRect, trip.midCarousel?.[1], trip.midCarousel?.[0], trip.image],
          trip.image,
        ),
        stackedTop: pickFallbackImage(
          [trip.introGallery?.stackedTop, trip.midCarousel?.[2], trip.midCarousel?.[0], trip.image],
          trip.image,
        ),
        stackedBottom: pickFallbackImage(
          [trip.introGallery?.stackedBottom, trip.midCarousel?.[3], trip.midCarousel?.[1], trip.image],
          trip.image,
        ),
      }
    : null;
  const tripFacts = trip?.tripFacts;
  const keyExperienceSlides = useMemo(() => {
    if (!trip) {
      return [];
    }

    if (tripFacts?.keyExperienceDetails?.length) {
      return tripFacts.keyExperienceDetails.map((experience) => ({
        title: experience.title,
        description: experience.description,
        images: experience.images?.length ? experience.images : [trip.image],
      }));
    }

    const fallbackImages = [
      trip.image,
      ...(trip.introGallery
        ? [
            trip.introGallery.bigSquare,
            trip.introGallery.wideRect,
            trip.introGallery.stackedTop,
            trip.introGallery.stackedBottom,
          ]
        : []),
      ...(trip.midCarousel ?? []),
    ].filter(Boolean) as string[];

    return (tripFacts?.keyExperiences ?? []).map((experience, index) => ({
      title: getKeyExperienceTitle(experience),
      description: trip.description,
      images: [
        (typeof experience === 'object' ? experience.image : undefined) ??
          fallbackImages[index % fallbackImages.length] ??
          trip.image,
      ],
    })).filter((experience) => Boolean(experience.title));
  }, [trip, tripFacts]);
  const tripDuration = trip?.stats?.duration ?? trip?.nights ?? '';
  const infoDropdowns = getInfoDropdowns(trip?.title, trip?.location);
  const overviewMeta = [
    // { label: 'Package', value: tripFacts?.packageName },
    { label: 'Start Point', value: tripFacts?.startPoint },
    { label: 'Cities Covered', value: tripFacts?.citiesCovered?.join(', ') },
    { label: 'End Point', value: tripFacts?.endPoint },
    { label: 'Best Season', value: tripFacts?.bestSeason },
    { label: 'How Long', value: tripDuration }
    // { label: 'Ideal For', value: tripFacts?.idealFor?.join(', ') },
    // { label: 'Trip Type', value: tripFacts?.tripType },
  ].filter((item) => item.value);
  const itineraryCta = {
    title: 'Make This Itinerary Yours',
    body:
      "Each and every Qarwaan trip is tailored exactly to who you are and what you want to do. Tell us about yourself and we'll create something entirely you.",
    ctaLabel: 'Enquire Now',
    background: '#004643',
  };
  const countryParam = (trip?.location ?? trip?.title ?? '').trim().toLowerCase();
  const enquireHref = countryParam
    ? `/enquire?country=${encodeURIComponent(countryParam)}`
    : '/enquire';
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

  useEffect(() => {
    if (!isDownloadPopupOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDownloadPopupOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDownloadPopupOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f4f1]">
        <Navbar variant="light" />
        <main className="px-4 py-24 text-center text-sm uppercase tracking-[0.3em] text-black/60">
          Loading trip...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#f6f4f1]">
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

  const openDownloadPopup = () => {
    setDownloadState({ status: 'idle', message: '' });
    setIsDownloadPopupOpen(true);
  };

  const closeDownloadPopup = () => {
    setIsDownloadPopupOpen(false);
  };

  const handleDownloadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDownloadState({ status: 'submitting', message: '' });

    try {
      const response = await fetch('https://formspree.io/f/mkopnqaw', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _subject: `Itinerary download request: ${trip.title}`,
          trip_name: trip.title,
          destination: trip.location ?? trip.title,
          duration: tripDuration,
          email: downloadForm.email,
          phone: downloadForm.phone,
          callback_requested: downloadForm.wantsCallback ? 'Yes' : 'No',
          request_type: 'itinerary_download',
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setDownloadState({
        status: 'success',
        message: 'Your request has been received. Our team will share the itinerary with you shortly.',
      });
      setDownloadForm({ email: '', phone: '', wantsCallback: false });
    } catch {
      setDownloadState({
        status: 'error',
        message: 'Unable to send your request right now. Please try again in a moment.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f1]">
      <Navbar heroOffset={navThreshold} />
      <main>
        <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${trip.image})`,
              backgroundAttachment: 'fixed',
              backgroundPosition: isLadakhTrip ? 'center 30%' : 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

          {!isLadakhTrip ? (
            <div className="relative mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-4 pt-24 text-white">
            <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.3em] text-white/70">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                />
                <circle cx="12" cy="10" r="2.4" />
              </svg>
              <span>{trip.location ?? 'QARWAAN'}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] md:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm text-white/85 md:text-base">
              {trip.description}
            </p>
            </div>
          ) : null}
        </section>

        <div ref={navSentinelRef} />
        <section
          className={`sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur transition-transform duration-300 ${
            isStuck && hideSticky ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-start gap-6 overflow-x-auto px-4 py-5 text-[0.7rem] uppercase tracking-[0.3em] text-black/70 no-scrollbar">
            <a
              href="#overview"
              className="whitespace-nowrap border-b-2 border-transparent pb-1 transition hover:border-black"
            >
              Overview
            </a>
            {itinerary.map((item, index) => {
              const id = `itinerary-${slugify(item.label)}-${index + 1}`;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="whitespace-nowrap border-b-2 border-transparent pb-1 transition hover:border-black"
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </section>

        <section id="overview" className="bg-white scroll-mt-28">
          <div className="mx-auto max-w-[900px] px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.18em] text-black md:text-3xl">
              {trip.title}
            </h2>
            <p className="mt-6 text-sm text-black/70">
              {(trip.overview ?? trip.description) + ' A journey designed around your pace, refined stays, and cultural immersion. Every detail is custom and curated by our travel experts.'}
            </p>
            {overviewMeta.length ? (
              <div className="mt-10 grid gap-6 border-t border-black/10 pt-8 text-left sm:grid-cols-2 lg:grid-cols-3">
                {overviewMeta.map((item) => (
                  <div key={item.label}>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/45">{item.label}</p>
                    <p className="mt-2 text-sm text-black/75">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {tripFacts?.whyThisTrip?.length ? (
              <div className="mt-10 text-left">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-black/45">Why This Trip</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {tripFacts.whyThisTrip.map((item) => (
                    <span
                      key={item}
                      className="border border-black/10 bg-[#f6f4f1] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {tripFacts?.keyExperiences?.length ? (
              <div className="relative left-1/2 right-1/2 mt-2 w-screen -translate-x-1/2 bg-white text-left">
                {keyExperienceSlides.length ? (
                  <div className="w-full px-4 pt-4 pb-0 md:px-6 md:pt-5 md:pb-0">
                    {(() => {
                      const totalExperiences = keyExperienceSlides.length;
                      const safeIndex = ((activeExperienceSlide % totalExperiences) + totalExperiences) % totalExperiences;
                      const experience = keyExperienceSlides[safeIndex];
                      const index = safeIndex;
                      const image = experience.images?.[0] ?? trip.image;

                      return (
                        <div className="space-y-6">
                          <div>
                            <p className="text-[0.82rem] uppercase tracking-[0.3em] text-black/45">Key Experiences</p>
                          </div>
                          <article
                            key={experience.title}
                            className="grid gap-0 border border-black/10 bg-white md:grid-cols-[1.45fr_0.55fr]"
                          >
                            <div>
                              <div className="relative overflow-hidden bg-black/5">
                                <div
                                  className="h-[290px] w-full bg-cover bg-center transition duration-700 md:h-[500px]"
                                  style={{ backgroundImage: `url(${image})` }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col justify-between bg-[#f6f4f1] px-6 py-7 md:px-8 md:py-10">
                              <div>
                                <p className="text-[0.9rem] font-semibold uppercase tracking-[0.22em] text-black/60 md:text-[1rem]">
                                  {experience.title}
                                </p>
                                <div className="mt-5 h-px w-16 bg-[#004643]/20" />
                                <p className="mt-5 text-sm leading-8 text-black/72 md:text-[0.96rem]">
                                  {shortenExperienceDescription(experience.description)}
                                </p>
                              </div>
                              <div className="mt-8 space-y-5">
                                <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-5">
                                  <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white text-black/60 transition hover:border-black/25 hover:text-black"
                                    onClick={() =>
                                      setActiveExperienceSlide((prev) => (prev - 1 + totalExperiences) % totalExperiences)
                                    }
                                    aria-label="Previous experience"
                                  >
                                    <span className="text-base leading-none">&#8592;</span>
                                  </button>
                                  <div className="flex items-center gap-2">
                                    {keyExperienceSlides.map((_, dotIndex) => (
                                      <button
                                        key={`experience-dot-${dotIndex}`}
                                        type="button"
                                        aria-label={`Go to experience ${dotIndex + 1}`}
                                        className={`h-2.5 w-2.5 rounded-full border border-black/40 transition ${
                                          dotIndex === index ? 'bg-black' : 'bg-transparent hover:bg-black/30'
                                        }`}
                                        onClick={() => setActiveExperienceSlide(dotIndex)}
                                      />
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white text-black/60 transition hover:border-black/25 hover:text-black"
                                    onClick={() => setActiveExperienceSlide((prev) => (prev + 1) % totalExperiences)}
                                    aria-label="Next experience"
                                  >
                                    <span className="text-base leading-none">&#8594;</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
                    <p className="text-sm text-black/70">
                      {tripFacts.keyExperiences.map(getKeyExperienceTitle).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>

        {/* <section className="border-b border-black/10 bg-white">
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
        </section> */}
        <section id="itinerary" className="bg-white">
          <div className="mx-auto max-w-[1200px] px-1 pt-4 pb-16 md:px-2">
            {introGallery ? (
              <div className="relative left-1/2 right-1/2 mb-10 w-screen -translate-x-1/2 px-4 md:px-6">
                <div className="grid gap-4 md:grid-cols-[1.2fr_1.8fr_1fr]">
                  <div
                    className="h-[320px] w-full bg-cover bg-center md:h-[480px]"
                    style={{ backgroundImage: `url(${introGallery.bigSquare})` }}
                  />
                  <div
                    className="h-[260px] w-full bg-cover bg-center md:h-[480px]"
                    style={{ backgroundImage: `url(${introGallery.wideRect})` }}
                  />
                  <div className="grid gap-4">
                    <div
                      className="h-[170px] w-full bg-cover bg-center md:h-[230px]"
                      style={{ backgroundImage: `url(${introGallery.stackedTop})` }}
                    />
                    <div
                      className="h-[170px] w-full bg-cover bg-center md:h-[230px]"
                      style={{ backgroundImage: `url(${introGallery.stackedBottom})` }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="relative">
              <div className="absolute left-3 top-0 h-full w-px bg-black/10" />

              {(() => {
                const totalLabels = itinerary.length;
                const insertAfterIndex = Math.max(0, Math.floor(totalLabels / 2) - 1);
                const renderCta = () => (
                  <div className="pl-5 pb-10 md:pl-6">
                    <section className="bg-[#c95a2a] py-12 text-white">
                      <div className="flex flex-col gap-6 px-3 md:flex-row md:items-center md:justify-between md:px-5">
                        <div className="max-w-3xl">
                          <h2 className="text-3xl font-semibold uppercase tracking-[0.04em] text-white">
                            {itineraryCta.title}
                          </h2>
                          <p className="mt-4 text-sm text-white/90">{itineraryCta.body}</p>
                        </div>
                        <a href={enquireHref} className="q-button q-button-outline-light text-bg-hover">
                          {itineraryCta.ctaLabel}
                        </a>
                      </div>
                    </section>
                  </div>
                );
                return (
                  <>
                    {totalLabels === 0 ? renderCta() : null}
                    {itinerary.map((section, sectionIndex) => {
                      const sectionKey = `${section.id}-${sectionIndex}`;
                      return (
                        <div key={sectionKey}>
                          <div
                            id={`itinerary-${slugify(section.label)}-${sectionIndex + 1}`}
                            className="relative pl-5 scroll-mt-28 md:pl-6"
                          >
                        <div className="absolute left-3 top-1.5 -translate-x-1/2 text-black">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                            />
                            <circle cx="12" cy="10" r="2.4" />
                          </svg>
                        </div>
                        <div className="mb-8">
                          <h3 className="text-3xl font-semibold uppercase tracking-[0.18em] text-black">
                            {section.label}
                          </h3>
                          <p className="mt-3 max-w-3xl text-sm text-black/70">{section.intro}</p>
                        </div>

                        <div className="space-y-6 pb-10">
                          {section.cards.map((card, index) => {
                            const reverse = (sectionIndex + index) % 2 !== 0;
                            return (
                              <div key={`${section.id}-${card.day}`}>
                                <article
                                  className={`overflow-hidden bg-transparent shadow-[0_10px_24px_rgba(0,0,0,0.08)] ${
                                    reverse ? 'md:flex-row-reverse' : ''
                                  } md:flex`}
                                >
                                  <div className="md:w-[45%]">
                                    {(() => {
                                      const fallbackDayImages = [
                                        card.image,
                                        trip.image,
                                        trip.hero?.image,
                                        midCarousel[index % Math.max(midCarousel.length, 1)],
                                        midCarousel[(sectionIndex + index) % Math.max(midCarousel.length, 1)],
                                      ].filter(Boolean) as string[];
                                      const images = card.images?.length
                                        ? card.images
                                        : fallbackDayImages.length
                                          ? fallbackDayImages
                                          : [trip.image];
                                      const key = `${section.id}-${card.day}`;
                                      const current = itinerarySlide[key] ?? 0;
                                      if (images.length <= 1) {
                                        return (
                                          <div
                                            className="h-[280px] w-full bg-cover bg-center md:h-full md:min-h-[420px]"
                                            style={{ backgroundImage: `url(${images[0] ?? ''})` }}
                                          />
                                        );
                                      }
                                      return (
                                        <div
                                          className="relative h-[280px] w-full bg-cover bg-center md:h-full md:min-h-[420px]"
                                          style={{ backgroundImage: `url(${images[current]})`, cursor: 'none' }}
                                          onPointerMove={(event) => {
                                            if (event.pointerType === 'touch') {
                                              return;
                                            }
                                            const rect = event.currentTarget.getBoundingClientRect();
                                            const x = event.clientX - rect.left;
                                            const y = event.clientY - rect.top;
                                            const dir = x < rect.width / 2 ? 'left' : 'right';
                                            setItineraryCursor({ key, x, y, dir, visible: true });
                                          }}
                                          onPointerLeave={() => {
                                            setItineraryCursor((prev) => ({ ...prev, visible: false }));
                                          }}
                                          onClick={(event) => {
                                            const rect = event.currentTarget.getBoundingClientRect();
                                            const dir = event.clientX - rect.left < rect.width / 2 ? -1 : 1;
                                            setItinerarySlide((prev) => {
                                              const next = (prev[key] ?? 0) + dir;
                                              const wrapped = (next + images.length) % images.length;
                                              return { ...prev, [key]: wrapped };
                                            });
                                          }}
                                        >
                                          <div
                                            className={`pointer-events-none absolute left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-opacity ${
                                              itineraryCursor.visible && itineraryCursor.key === key
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            }`}
                                            style={{
                                              transform: `translate(${itineraryCursor.x}px, ${itineraryCursor.y}px)`,
                                            }}
                                          >
                                            {itineraryCursor.dir === 'left' ? '<' : '>'}
                                          </div>
                                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                                            {images.map((_, idx) => (
                                              <span
                                                key={`${key}-dot-${idx}`}
                                                className={`h-2 w-2 rounded-full border border-white/70 ${
                                                  idx === current ? 'bg-white' : 'bg-white/20'
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                  <div className="flex flex-1 flex-col justify-center px-3 py-7 md:px-5 md:py-10">
                                    <div className="flex items-start justify-between gap-4">
                                      <h4 className="text-xl font-semibold uppercase tracking-[0.12em] text-black">
                                        {card.title}
                                      </h4>
                                      <p className="flex-shrink-0 text-base font-semibold uppercase tracking-[0.18em] text-[#004643]">
                                        {card.day}
                                      </p>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-black/72">{card.description}</p>
                                    {card.themes?.length ? (
                                      <div className="mt-5 flex flex-wrap gap-2">
                                        {card.themes.map((theme) => (
                                          <span
                                            key={theme}
                                            className="border border-[#004643] bg-[#004643] px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-white"
                                          >
                                            {theme}
                                          </span>
                                        ))}
                                      </div>
                                    ) : null}
                                    {detailSections.some(({ key }) => Boolean(card[key]?.length)) ? (
                                      <div className="mt-7">
                                        {(() => {
                                          const availableTabs = detailSections.filter(({ key }) => Boolean(card[key]?.length));
                                          const tabKey = `${section.id}-${card.day}`;
                                          const selectedTab =
                                            activeDetailTab[tabKey] ?? availableTabs[0]?.key ?? '';
                                          const selectedSection = availableTabs.find(({ key }) => key === selectedTab) ?? availableTabs[0];

                                          return selectedSection ? (
                                            <>
                                              <div className="overflow-x-auto no-scrollbar">
                                                <div className="flex min-w-max gap-7 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-black/55">
                                                  {availableTabs.map((tab) => (
                                                    <button
                                                      key={tab.key}
                                                      type="button"
                                                      className={`border-b px-0 py-3 text-left transition ${
                                                        selectedSection.key === tab.key
                                                          ? 'border-black text-black'
                                                          : 'border-transparent hover:border-black/30 hover:text-black/75'
                                                      }`}
                                                      onClick={() =>
                                                        setActiveDetailTab((prev) => ({
                                                          ...prev,
                                                          [tabKey]: tab.key,
                                                        }))
                                                      }
                                                    >
                                                      {tab.label}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                              <div className="bg-transparent p-4">
                                                <ul className="space-y-2 text-sm leading-6 text-black/72">
                                                  {card[selectedSection.key]?.map((item) => (
                                                    <li key={item} className="flex gap-2">
                                                      <span className="mt-[0.45rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black/45" />
                                                      <span>{item}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </>
                                          ) : null;
                                        })()}
                                      </div>
                                    ) : null}
                                    {(card.stayType || card.accessibility) ? (
                                      <div className="mt-5 border-t border-black/10 pt-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                        {card.stayType ? (
                                          <div className="bg-transparent p-4">
                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-black/55">
                                              Stay Type
                                            </p>
                                            <p className="mt-2 text-sm text-black/70">{card.stayType}</p>
                                          </div>
                                        ) : null}
                                        {card.accessibility ? (
                                          <div className="bg-transparent p-4">
                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-black/55">
                                              Accessibility
                                            </p>
                                            <p className="mt-2 text-sm text-black/70">{card.accessibility}</p>
                                          </div>
                                        ) : null}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                </article>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {sectionIndex === insertAfterIndex ? renderCta() : null}
                    </div>
                  );
                })}
                  </>
                );
              })()}
            </div>
          </div>
        </section>
        {midCarousel.length ? (
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
                  className="no-scrollbar trip-carousel-track flex w-full gap-6 overflow-x-hidden px-0 snap-x snap-mandatory"
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
                      className="trip-carousel-card flex-shrink-0 snap-start bg-black"
                    >
                      <div
                        className="h-[360px] w-full bg-cover bg-center md:h-[520px]"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                    </div>
                  ))}
                  <div className="trip-carousel-spacer flex-shrink-0" />
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
        ) : null}


        {restYourHead.items.length ? (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-[1200px] px-4">
              <h3 className="text-center text-2xl font-semibold uppercase tracking-[0.18em] text-black md:text-3xl">
                {restYourHead.title}
              </h3>
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {restYourHead.items.map((item) => (
                  <article key={item.name} className="flex flex-col overflow-hidden border border-black/10 bg-[#f8f6f2]">
                    <div
                      className="h-[320px] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                        {item.name}
                      </h4>
                      <p className="mt-3 flex-1 text-sm leading-7 text-black/70">{item.description}</p>
                      <button className="mt-5 text-left text-xs font-semibold uppercase tracking-[0.25em] text-black">
                        {item.ctaLabel}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <button className="q-button !bg-black !text-white !border-black">{restYourHead.ctaLabel}</button>
              </div>

              <div className="mt-14 border-t border-black/10 pt-8">
                <div className="space-y-4">
                  {infoDropdowns.map((item) => {
                    const isOpen = openInfoDropdown === item.key;

                    return (
                      <div key={item.key} className="border border-black/10 bg-[#f8f6f2]">
                        <button
                          type="button"
                          onClick={() => setOpenInfoDropdown((prev) => (prev === item.key ? null : item.key))}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-black">
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 flex-shrink-0 text-black transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen ? (
                          <div className="border-t border-black/10 px-5 py-4">
                            {Array.isArray(item.content) ? (
                              <div className="space-y-2.5 text-sm leading-7 text-black/70">
                                {item.content.map((line) => {
                                  const isHeading =
                                    line === 'Key Points' ||
                                    line === 'Cancellation Charges' ||
                                    line === 'Rescheduling' ||
                                    line === 'Force Majeure' ||
                                    line === 'Overview' ||
                                    line === 'Data Collection' ||
                                    line === 'Data Usage' ||
                                    line === 'Data Sharing' ||
                                    line === 'Your Rights' ||
                                    line === 'Security' ||
                                    line === 'Contact & Full Policy';

                                  return isHeading ? (
                                    <p
                                      key={line}
                                      className="pt-1 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black"
                                    >
                                      {line}
                                    </p>
                                  ) : (
                                    <p key={line}>{line}</p>
                                  );
                                })}
                              </div>
                            ) : isFaqContent(item.content) ? (
                              <div>
                                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black">
                                  {item.content.heading}
                                </p>
                                <div className="mt-4 space-y-3">
                                  {item.content.items.map((faq, index) => {
                                    const faqKey = `${item.key}-${index}`;
                                    const isFaqOpen = openFaqItem === faqKey;

                                    return (
                                      <div key={faqKey} className="border border-black/10 bg-white">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setOpenFaqItem((prev) => (prev === faqKey ? null : faqKey))
                                          }
                                          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                                        >
                                          <span className="text-sm font-medium leading-6 text-black">
                                            {faq.question}
                                          </span>
                                          <ChevronDown
                                            className={`h-4 w-4 flex-shrink-0 text-black transition-transform duration-200 ${
                                              isFaqOpen ? 'rotate-180' : ''
                                            }`}
                                          />
                                        </button>
                                        {isFaqOpen ? (
                                          <div className="border-t border-black/10 px-4 py-3">
                                            <p className="text-sm leading-7 text-black/70">{faq.answer}</p>
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm leading-7 text-black/70">{item.content}</p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {similarTrips.length ? (
          <TripsSection
            title="Similar Experiences"
            tagline="Start your bespoke adventure with us."
            trips={similarTrips}
            showViewMore
            viewMoreHref="/trip-finder"
          />
        ) : null}

        <CTASection />
      </main>
      {isDownloadPopupOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#201915]/35 px-4 py-8 backdrop-blur-[6px]"
          onClick={closeDownloadPopup}
        >
          <div
            className="relative w-full max-w-[388px] overflow-hidden border border-[#d7dce5] bg-[#fbfbf9] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative px-8 pb-7 pt-7">
              <button
                type="button"
                aria-label="Close popup"
                onClick={closeDownloadPopup}
                className="absolute right-8 top-8 inline-flex h-8 w-8 items-center justify-center border-2 border-[#394559] bg-white text-[#95a1b2] transition hover:text-[#394559]"
              >
                <X size={18} strokeWidth={2.2} />
              </button>

              <h2 className="pr-12 text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-[#1f2a3d]">
                Download Itinerary
              </h2>
              <p className="mt-1.5 max-w-[250px] text-[0.9rem] leading-6 text-[#5a677d]">
                Provide your details to get the complete travel plan
              </p>

              <div className="mt-5 flex items-center gap-3 border border-[#d9dfe8] bg-[#f8fafc] p-3.5">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="h-[52px] w-[52px] object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.95rem] font-semibold leading-6 text-[#1f2a3d]">
                    {trip.title}
                  </p>
                  <p className="text-[0.9rem] text-[#5a677d]">{tripDuration}</p>
                </div>
              </div>

              <form className="mt-3.5" onSubmit={handleDownloadSubmit}>
                <div>
                  <label htmlFor="download-email" className="text-[0.9rem] font-medium text-[#394559]">
                    Email Address *
                  </label>
                  <input
                    id="download-email"
                    type="email"
                    required
                    value={downloadForm.email}
                    onChange={(event) =>
                      setDownloadForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Enter your email address"
                    className="mt-1.5 h-10.5 w-full border border-[#3a4350] bg-white px-4 text-[0.94rem] text-[#1f2a3d] outline-none transition placeholder:text-[#8a93a3] focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15"
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="download-phone" className="text-[0.9rem] font-medium text-[#394559]">
                    Phone Number *
                  </label>
                  <input
                    id="download-phone"
                    type="tel"
                    required
                    value={downloadForm.phone}
                    onChange={(event) =>
                      setDownloadForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="Enter your phone number"
                    className="mt-1.5 h-10.5 w-full border border-[#3a4350] bg-white px-4 text-[0.94rem] text-[#1f2a3d] outline-none transition placeholder:text-[#8a93a3] focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15"
                  />
                </div>

                <label className="mt-3 flex items-center gap-3 text-[0.88rem] text-[#5a677d]">
                  <input
                    type="checkbox"
                    checked={downloadForm.wantsCallback}
                    onChange={(event) =>
                      setDownloadForm((prev) => ({ ...prev, wantsCallback: event.target.checked }))
                    }
                    className="h-[21px] w-[21px] border border-[#98a2b3] accent-[#004643]"
                  />
                  <span>Would you like us to call you back?</span>
                </label>

                <p className="mt-2.5 text-[0.82rem] leading-5 text-[#6b768b]">
                  By downloading this itinerary, I confirm that I have read and understood the{' '}
                  <Link
                    to="/privacy-policy"
                    className="font-medium text-[#004643] underline underline-offset-2"
                  >
                    Privacy Policy.
                  </Link>
                </p>

                {downloadState.message ? (
                  <p
                    className={`mt-2.5 text-[0.84rem] ${
                      downloadState.status === 'error' ? 'text-[#b54708]' : 'text-[#004643]'
                    }`}
                  >
                    {downloadState.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={downloadState.status === 'submitting'}
                  className="mt-4 inline-flex h-[50px] w-full items-center justify-center gap-3 bg-[#004643] px-6 text-[0.94rem] font-semibold text-white shadow-[0_14px_30px_rgba(0,70,67,0.24)] transition hover:bg-[#003a38] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>
                    {downloadState.status === 'submitting' ? 'Submitting...' : 'Download Itinerary'}
                  </span>
                  <Download size={18} strokeWidth={2.1} />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={openDownloadPopup}
        className="fixed right-0 top-1/2 z-[90] hidden -translate-y-1/2 rounded-l-[14px] bg-[#004643] px-3 py-5 text-[0.82rem] font-semibold tracking-normal text-white shadow-[0_10px_30px_rgba(0,70,67,0.28)] transition hover:bg-[#003a38] md:block"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        Download itinerary
      </button>
      <Footer />
    </div>
  );
}
