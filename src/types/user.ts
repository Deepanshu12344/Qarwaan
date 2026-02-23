import type { BookingRecord } from './admin';
import type { Trip } from './trip';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  preferredLanguage?: string;
  preferredCurrency?: string;
  referralCode?: string;
};

export type UserProfile = AuthUser & {
  savedTrips?: Trip[];
  referralCode?: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type UserBookingsResponse = {
  bookings: BookingRecord[];
};

export type UserReferralResponse = {
  referral: {
    referralCode: string;
    referralCount: number;
    users: Array<{
      _id: string;
      name: string;
      email: string;
      createdAt: string;
    }>;
    rewards: Array<{
      _id: string;
      couponCode: string;
      rewardValue: number;
      status: 'issued' | 'redeemed' | 'expired';
      createdAt: string;
    }>;
  };
};
