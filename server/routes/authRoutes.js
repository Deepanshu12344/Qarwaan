import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { ReferralReward } from '../models/ReferralReward.js';

const router = express.Router();

router.post('/register', async (request, response) => {
  try {
    const { name, email, password, preferredLanguage, preferredCurrency, referralCode } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return response.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const normalizedReferralCode = referralCode ? String(referralCode).trim().toUpperCase() : '';
    let referredByCode = '';
    let referrer = null;

    if (normalizedReferralCode) {
      referrer = await User.findOne({ referralCode: normalizedReferralCode });
      if (!referrer) {
        return response.status(400).json({ message: 'Invalid referral code' });
      }
      referredByCode = normalizedReferralCode;
      referrer.referralCount = Number(referrer.referralCount || 0) + 1;
      await referrer.save();
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      preferredLanguage: preferredLanguage || 'en',
      preferredCurrency: preferredCurrency || 'INR',
      referralCode: `QAR${Date.now().toString().slice(-6)}`,
      referredByCode: referredByCode || undefined,
    });

    if (referrer && referredByCode) {
      const rewardAmount = Number(process.env.REFERRAL_REWARD_FLAT_INR || 1000);
      const couponCode = `REF${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;
      const validTill = new Date(Date.now() + Number(process.env.REFERRAL_REWARD_VALID_DAYS || 90) * 24 * 60 * 60 * 1000);

      const rewardCoupon = await Coupon.create({
        code: couponCode,
        description: `Referral reward for inviting ${user.name}`,
        discountType: 'flat',
        discountValue: rewardAmount,
        minOrderAmount: Number(process.env.REFERRAL_REWARD_MIN_ORDER || 0),
        usageLimit: 1,
        active: true,
        validFrom: new Date(),
        validTill,
      });

      await ReferralReward.create({
        referrer: referrer._id,
        referredUser: user._id,
        referralCode: referredByCode,
        rewardType: 'coupon',
        couponCode: rewardCoupon.code,
        couponId: rewardCoupon._id,
        rewardValue: rewardAmount,
        status: 'issued',
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '7d' }
    );

    return response.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '7d' }
    );

    return response.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
