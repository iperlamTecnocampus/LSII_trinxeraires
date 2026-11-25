import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch, resetCsrfToken, type CurrentUser } from '@/lib/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (response.status === 401) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Could not check the current session (${response.status}).`);
      }

      setUser((await response.json()) as CurrentUser);
    } catch (requestError) {
      setUser(null);
      setError(requestError instanceof Error ? requestError.message : 'Could not check the current session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const response = await apiFetch('/api/auth/logout', { method: 'POST' });
    if (!response.ok) {
      throw new Error(`Could not log out (${response.status}).`);
    }

    resetCsrfToken();
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updates: Partial<CurrentUser>) => {
    setUser((currentUser) => (currentUser ? { ...currentUser, ...updates } : currentUser));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: user !== null, error, updateUser, refresh, logout }),
    [user, isLoading, error, updateUser, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
