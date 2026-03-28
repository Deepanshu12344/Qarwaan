import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import Trip from './models/Trip.js';
import { trips } from './data/trips.js';
import { tripSlug } from './lib/slug.js';

dotenv.config();

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim());
  dns.setServers(servers);
}

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
      ? Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS)
      : 15000,
    connectTimeoutMS: process.env.MONGODB_CONNECT_TIMEOUT_MS
      ? Number(process.env.MONGODB_CONNECT_TIMEOUT_MS)
      : 15000,
  });
  await Trip.deleteMany({});
  await Trip.insertMany(
    trips.map((trip) => ({
      ...trip,
      slug: tripSlug(trip.title, trip.location),
    })),
  );
  await mongoose.disconnect();
  console.log(`Seeded ${trips.length} trips`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
