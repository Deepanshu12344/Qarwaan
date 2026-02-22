import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import { seedTripsIfNeeded } from './data/tripsSeed.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/newsletter', newsletterRoutes);

connectToDatabase(process.env.MONGODB_URI)
  .then(() => {
    return seedTripsIfNeeded();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect database:', error.message);
    process.exit(1);
  });
