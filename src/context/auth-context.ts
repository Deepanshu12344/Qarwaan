import { createContext } from 'react';
import type { UserProfile } from '../types/user';

export type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    referralCode?: string;
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
