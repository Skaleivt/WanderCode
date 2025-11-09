"use client";

import { checkSession } from "@/lib/api/clientApi";
import { getMe } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";
import { useEffect } from "react";

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
      const isAuthenticated = await checkSession();
      if (isAuthenticated) {
        // Якщо сесія валідна — отримуємо користувача
        const user = await getMe();
        if (user) setUser(user);
      } else {
        // Якщо сесія невалідна — чистимо стан
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
}
