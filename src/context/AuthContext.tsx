import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  getMyProfile,
  getStoredUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../lib/api';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(getStoredUser());

  const refresh = async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch {
      setUser(getStoredUser());
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: false,
      login: async (payload) => {
        const response = await loginUser(payload);
        setUser(response.user);
      },
      register: async (payload) => {
        const response = await registerUser(payload);
        setUser(response.user);
      },
      logout: () => {
        logoutUser();
        setUser(null);
      },
      refresh,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
