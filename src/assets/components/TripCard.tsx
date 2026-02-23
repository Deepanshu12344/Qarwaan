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
    <article className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_16px_36px_rgba(17,34,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(17,34,17,0.14)]">
      <div className="relative h-56 overflow-hidden">
        <img
          src={trip.heroImage}
          alt={trip.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#112211]">
          {trip.durationDays} Days / {trip.nights} Nights
        </span>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-xl font-bold text-[#112211]">{trip.name}</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#8DD3BB]" />
            {trip.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4 text-[#8DD3BB]" />
            {trip.groupType}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 text-sm text-amber-500">
          <Star className="h-4 w-4 fill-amber-500" />
          <span className="font-medium text-[#112211]">{trip.rating}</span>
          <span className="text-gray-500">({trip.reviewCount} reviews)</span>
        </div>

        <p className="line-clamp-2 text-sm text-gray-600">{trip.overview}</p>

        <div className="flex items-end justify-between pt-2">
          <div>
            {trip.discountedPrice ? (
              <p className="text-sm text-gray-400 line-through">{formatMoney(trip.price)}</p>
            ) : null}
            <p className="text-2xl font-bold text-[#112211]">{formatMoney(finalPrice)}</p>
            <p className="text-xs text-gray-500">{t('per_traveler')}</p>
          </div>
          <Link
            to={`/trips/${trip.slug}`}
            className="rounded-lg bg-[#8DD3BB] px-5 py-2.5 text-sm font-semibold text-[#112211] transition hover:bg-[#7dcab1]"
          >
            View Trip
          </Link>
        </div>
      </div>
    </article>
  );
}
