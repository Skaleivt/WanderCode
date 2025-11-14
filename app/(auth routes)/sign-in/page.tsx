// app/(auth routes)/sign-in/page.tsx
'use client';

import css from './SignInPage.module.css';

import { loginUser, LoginRequest } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // !!! ВЫПРАЎЛЕННЕ: Выкарыстоўваем LoginRequest, які патрабуе толькі email і password !!!
    const formValues: LoginRequest = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };

    try {
      const res = await loginUser(formValues);

      // !!! ВЫПРАЎЛЕННЕ: Перадаем толькі аб'ект user у стор !!!
      if (res && res.user) {
        setUser(res.user);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      // Пакідаем арыгінальны код для ApiError, але ён можа выклікаць памылку, калі памылка не адпавядае Next.js тыпу.
      // Лепш выкарыстоўваць: (error as any).message ?? 'Oops... some error'
      setError((error as ApiError).message ?? 'Oops... some error');
    }
  };

  useEffect(() => {
    document.title = `Sign-in | NoteHub`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Sign in to your NoteHub account. Enter your email and password to log in.`
      );
  });

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
