// app/(auth routes)/sign-in/page.tsx
'use client';

import css from './AuthPage.module.css';
import { AuthorizationRequest, getMe, loginUser } from '@/lib/api/clientApi';

import { useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues: AuthorizationRequest = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };
    try {
      const res = await loginUser(formValues);

      if (res) {
        const me = await getMe();
        if (me) setUser(me);
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError((error as ApiError).message ?? 'Oops... some error');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Вхід</h1>
      <p className={css.formText}>Вітаємо знову у спільноту мандрівників!</p>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Пошта*</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            placeholder="hello@podorozhnyky.ua"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Пароль*</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            placeholder="********"
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Увійти
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
