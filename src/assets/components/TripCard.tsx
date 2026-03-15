import { Clock3, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSitePreferences } from '../../context/useSitePreferences';
import type { Trip } from '../../types/trip';

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  const finalPrice = trip.discountedPrice || trip.price;
  const { formatMoney, t } = useSitePreferences();

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#e0d3c5] bg-white transition hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(31,26,23,0.12)]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={trip.heroImage}
          alt={trip.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[#1f1a17]">
          {trip.durationDays} Days / {trip.nights} Nights
        </span>
      </div>

      <div className="space-y-3 p-6">
        <h3 className="text-2xl font-semibold text-[#1f1a17]">{trip.name}</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b5f57]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#d86b4a]" />
            {trip.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4 text-[#d86b4a]" />
            {trip.groupType}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-[#b38f6b]">
          <Star className="h-3.5 w-3.5 fill-[#b38f6b] text-[#b38f6b]" />
          <span>{trip.rating}</span>
          <span className="text-[#8c7c72]">({trip.reviewCount})</span>
        </div>

        <p className="line-clamp-2 text-sm text-[#6b5f57]">{trip.overview}</p>

        <div className="flex items-end justify-between pt-2">
          <div>
            {trip.discountedPrice ? (
              <p className="text-xs text-[#a39186] line-through">{formatMoney(trip.price)}</p>
            ) : null}
            <p className="text-2xl font-semibold text-[#1f1a17]">{formatMoney(finalPrice)}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#8c7c72]">{t('per_traveler')}</p>
          </div>
          <Link
            to={`/trips/${trip.slug}`}
            className="rounded-full border border-[#1f1a17] px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#1f1a17] transition hover:bg-[#1f1a17] hover:text-white"
          >
            View Trip
          </Link>
        </div>
      </div>
    </article>
  );
}
