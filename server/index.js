import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import Trip from './models/Trip.js';
import MonthPlace from './models/MonthPlace.js';
import { normalizeTrip } from './lib/tripTransforms.js';

dotenv.config();

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim());
  dns.setServers(servers);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/trips', async (_req, res) => {
  try {
    const trips = await Trip.find().lean();
    res.json(trips.map(normalizeTrip));
  } catch (error) {
    res.status(500).json({ message: 'Failed to load trips' });
  }
});

app.get('/api/trips/:slug', async (req, res) => {
  try {
    const trip = await Trip.findOne({ slug: req.params.slug }).lean();
    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }
    res.json(normalizeTrip(trip));
  } catch (error) {
    res.status(500).json({ message: 'Failed to load trip' });
  }
});

app.get('/api/month-places', async (_req, res) => {
  try {
    const months = await MonthPlace.find().sort({ order: 1 }).lean();
    res.json(months);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load month guides' });
  }
});

app.get('/api/month-places/:slug', async (req, res) => {
  try {
    const month = await MonthPlace.findOne({ slug: req.params.slug }).lean();
    if (!month) {
      res.status(404).json({ message: 'Month guide not found' });
      return;
    }
    res.json(month);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load month guide' });
  }
});

const connect = async () => {
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
};

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
