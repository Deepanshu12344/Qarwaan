import { useMemo } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrips } from '../data/useTrips';
import Logo from './Logo';

const usefulInformation = [
  { label: 'Frequently Asked Questions' },
  { label: 'Online Enquiry', href: '/enquire' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cancellation Policy' },
  { label: 'Travel Insurance' },
] as const;

type FooterTrip = {
  slug?: string;
  title: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FooterDestination = {
  name: string;
  slug?: string;
};

function getTripTimestamp(trip: FooterTrip) {
  const dateValue = trip.createdAt || trip.updatedAt;
  if (!dateValue) {
    return 0;
  }

  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getDestinationName(trip: FooterTrip) {
  return (trip.location || trip.title || '').trim();
}

export default function Footer() {
  const { trips } = useTrips();

  const recentDestinations = useMemo(() => {
    const seen = new Set<string>();
    const uniqueDestinations: FooterDestination[] = [];

    [...(trips as FooterTrip[])]
      .sort((a, b) => getTripTimestamp(b) - getTripTimestamp(a))
      .forEach((trip) => {
        const name = getDestinationName(trip);
        if (!name) {
          return;
        }

        const normalizedName = name.toLowerCase();
        if (seen.has(normalizedName)) {
          return;
        }

        seen.add(normalizedName);
        uniqueDestinations.push({
          name,
          slug: trip.slug,
        });
      });

    return uniqueDestinations.slice(0, 7);
  }, [trips]);

  return (
    <footer id="footer" className="bg-[#1a1a1a] py-16 text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:grid-cols-4">
        <div className="flex flex-col items-start">
          <Link to="/" aria-label="Qarwaan home" className="inline-flex items-start">
            <Logo tone="light" className="h-8 w-auto md:h-10" />
          </Link>
          <div className="mt-6 flex items-center gap-3 text-white/80">
            <span
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-white/50 hover:text-white"
            >
              <Facebook size={18} />
            </span>
            <span
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-white/50 hover:text-white"
            >
              <Instagram size={18} />
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Get In Touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a href="mailto:team@qarwaan.com" className="transition hover:text-white">
                team@qarwaan.com
              </a>
            </li>
            <li>
              <a href="tel:8796162117" className="transition hover:text-white">
                8796162117
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Useful Information</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {usefulInformation.map((item) => (
              <li key={item.label}>
                {'href' in item ? (
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Popular Destinations</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {recentDestinations.map((destination) => (
              <li key={destination.slug || destination.name}>
                {destination.slug ? (
                  <Link to={`/trip-finder/${destination.slug}`} className="transition hover:text-white">
                    {destination.name}
                  </Link>
                ) : (
                  destination.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 text-xs uppercase tracking-[0.2em] text-white/60 md:flex-row">
          <span>(c) Qarwaan 2026</span>
          <span>Curated journeys, tailored around you.</span>
        </div>
      </div>
    </footer>
  );
}
