import { createContext } from 'react';
import type { CurrentUser } from '@/lib/api';

export interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  updateUser: (updates: Partial<CurrentUser>) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
