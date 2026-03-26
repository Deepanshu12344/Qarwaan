import { trips } from './trips';
import type { TripCard } from './trips';

export const featuredTrips: TripCard[] = trips.filter((trip) => trip.featured);
