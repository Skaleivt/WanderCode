'use client';

import { getMe, checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // спробувати отримати користувача
        const user = await getMe();
        if (user) {
          setUser(user);
          return;
        }

        // якщо getMe не вдався, спробувати рефреш
        const refreshed = await checkSession(); // новий метод на /api/auth/refresh
        if (refreshed) {
          const userAfterRefresh = await getMe();
          if (userAfterRefresh) setUser(userAfterRefresh);
          else clearIsAuthenticated();
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
}
