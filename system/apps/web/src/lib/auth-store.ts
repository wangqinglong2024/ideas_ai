import { useEffect, useState } from 'react';
import { auth } from './api.js';

export type AuthUser = { id: string; email: string | null } | null;

export function useAuth(): { user: AuthUser; loading: boolean; refresh: () => Promise<void>; signOut: () => Promise<void> } {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async (): Promise<void> => {
    try {
      const { user: u } = await auth.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return {
    user,
    loading,
    refresh,
    signOut: async () => {
      try {
        await auth.signOut();
      } finally {
        setUser(null);
      }
    },
  };
}

export function navigate(to: string): void {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
