import express from 'express';
import { Review } from '../models/Review.js';
import { Trip } from '../models/Trip.js';
import { requireAdminAuth, requireAdminPermission } from '../middleware/adminAuth.js';
import { requireUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

router.get('/trip/:slug', async (request, response) => {
  try {
    const trip = await Trip.findOne({ slug: request.params.slug });
    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    const reviews = await Review.find({ trip: trip._id, moderationStatus: 'approved' }).sort({ createdAt: -1 });
    return response.status(200).json({ reviews });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

router.post('/trip/:slug', requireUserAuth, async (request, response) => {
  try {
    const { rating, title, comment } = request.body;
    const trip = await Trip.findOne({ slug: request.params.slug });
    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    if (!rating || !comment) {
      return response.status(400).json({ message: 'rating and comment are required' });
    }

    const review = await Review.create({
      trip: trip._id,
      user: request.user.userId,
      authorName: request.user.name || 'Traveler',
      authorEmail: request.user.email,
      rating,
      title,
      comment,
      verified: true,
      moderationStatus: 'pending',
    });

    return response.status(201).json({ message: 'Review submitted for moderation', reviewId: review._id });
  } catch {
    return response.status(500).json({ message: 'Failed to submit review' });
  }
});

router.get('/admin/pending', requireAdminAuth, requireAdminPermission('manage_crm'), async (_request, response) => {
  try {
    const reviews = await Review.find({ moderationStatus: 'pending' }).sort({ createdAt: -1 });
    return response.status(200).json({ reviews });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch pending reviews' });
  }
});

router.patch('/admin/:id/moderate', requireAdminAuth, requireAdminPermission('manage_crm'), async (request, response) => {
  try {
    const { moderationStatus, moderationNote } = request.body;
    if (!['approved', 'rejected'].includes(moderationStatus)) {
      return response.status(400).json({ message: 'Invalid moderation status' });
    }

    const review = await Review.findByIdAndUpdate(
      request.params.id,
      { moderationStatus, moderationNote },
      { new: true }
    );

    if (!review) {
      return response.status(404).json({ message: 'Review not found' });
    }

    return response.status(200).json({ review });
  } catch {
    return response.status(500).json({ message: 'Failed to moderate review' });
  }
});

export default router;
