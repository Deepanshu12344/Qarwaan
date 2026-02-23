import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './config/db.js';
import { seedAdminIfNeeded } from './data/adminSeed.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import fxRoutes from './routes/fxRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { seedTripsIfNeeded } from './data/tripsSeed.js';
import { startCrmNotifier } from './services/crmNotifier.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, '..', process.env.MEDIA_UPLOAD_DIR || 'uploads');

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(
  express.json({
    verify: (request, _response, buffer) => {
      if (request.originalUrl.includes('/api/payments/webhook/')) {
        request.rawBody = buffer.toString();
      }
    },
  })
);

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/fx', fxRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/uploads', express.static(uploadsDir));

connectToDatabase(process.env.MONGODB_URI)
  .then(() => {
    return Promise.all([seedTripsIfNeeded(), seedAdminIfNeeded()]);
  })
  .then(() => {
    startCrmNotifier();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect database:', error.message);
    process.exit(1);
  });
