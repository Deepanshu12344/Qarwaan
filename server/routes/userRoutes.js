import express from 'express';
import { Booking } from '../models/Booking.js';
import { ReferralReward } from '../models/ReferralReward.js';
import { Trip } from '../models/Trip.js';
import { User } from '../models/User.js';
import { requireUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

router.get('/me', requireUserAuth, async (request, response) => {
  try {
    const user = await User.findById(request.user.userId).select('-password').populate('savedTrips');
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }
    return response.status(200).json({ user });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.patch('/me', requireUserAuth, async (request, response) => {
  try {
    const { name, preferredCurrency, preferredLanguage } = request.body;
    const updates = {};

    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof preferredCurrency === 'string' && preferredCurrency.trim()) {
      updates.preferredCurrency = preferredCurrency.trim().toUpperCase();
    }
    if (typeof preferredLanguage === 'string' && preferredLanguage.trim()) {
      updates.preferredLanguage = preferredLanguage.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return response.status(400).json({ message: 'No valid profile fields provided' });
    }

    const user = await User.findByIdAndUpdate(
      request.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).json({ user });
  } catch {
    return response.status(400).json({ message: 'Failed to update profile' });
  }
});

router.get('/me/bookings', requireUserAuth, async (request, response) => {
  try {
    const bookings = await Booking.find({ user: request.user.userId }).sort({ createdAt: -1 });
    return response.status(200).json({ bookings });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch booking history' });
  }
});

router.get('/me/saved-trips', requireUserAuth, async (request, response) => {
  try {
    const user = await User.findById(request.user.userId).populate('savedTrips');
    return response.status(200).json({ savedTrips: user?.savedTrips || [] });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch saved trips' });
  }
});

router.get('/me/referrals', requireUserAuth, async (request, response) => {
  try {
    const user = await User.findById(request.user.userId).select('referralCode referralCount');
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    const referredUsers = await User.find({ referredByCode: user.referralCode })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    const rewards = await ReferralReward.find({ referrer: user._id })
      .select('couponCode rewardValue status createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    return response.status(200).json({
      referral: {
        referralCode: user.referralCode || '',
        referralCount: Number(user.referralCount || 0),
        users: referredUsers,
        rewards,
      },
    });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch referrals' });
  }
});

router.post('/me/saved-trips/:tripId', requireUserAuth, async (request, response) => {
  try {
    const trip = await Trip.findById(request.params.tripId);
    if (!trip) {
      return response.status(404).json({ message: 'Trip not found' });
    }

    const user = await User.findById(request.user.userId);
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    const exists = user.savedTrips.some((item) => String(item) === String(trip._id));
    if (!exists) {
      user.savedTrips.push(trip._id);
      await user.save();
    }

    return response.status(200).json({ message: 'Trip saved' });
  } catch {
    return response.status(500).json({ message: 'Failed to save trip' });
  }
});

router.delete('/me/saved-trips/:tripId', requireUserAuth, async (request, response) => {
  try {
    const user = await User.findById(request.user.userId);
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    user.savedTrips = user.savedTrips.filter((item) => String(item) !== request.params.tripId);
    await user.save();

    return response.status(200).json({ message: 'Trip removed from saved list' });
  } catch {
    return response.status(500).json({ message: 'Failed to remove saved trip' });
  }
});

export default router;
