// app/(auth routes)/sign-up/page.tsx (ФІНАЛЬНАЯ ВЕРСІЯ)
'use client';
import css from './SignUpPage.module.css';
import { RegisterRequest, registerUser } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';

export default function SingUp() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues: RegisterRequest = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      name: String(formData.get('name')),
    };
    try {
      const res = await registerUser(formValues); // !!! ВЫПРАЎЛЕННЕ ESLINT: Ігнараванне 'any' на месцы выкарыстання !!!

      if (res && (res as any).user) {
        setUser((res as any).user);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError((error as ApiError).message ?? 'Oops... some error');
    }
  };

  useEffect(() => {
    document.title = `Sign-up | NoteHub`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Create a new account on NoteHub. Sign up with your email and password to get started.`
      );
  });

  return (
    <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>     {' '}
      <form onSubmit={handleSubmit} className={css.form}>
               {' '}
        <div className={css.formGroup}>
                    <label htmlFor="name">Name</label>         {' '}
          <input
            id="name"
            type="text"
            name="name"
            className={css.input}
            required
          />
                 {' '}
        </div>
               {' '}
        <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>         {' '}
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
                 {' '}
        </div>
               {' '}
        <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>         {' '}
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
                 {' '}
        </div>
               {' '}
        <div className={css.actions}>
                   {' '}
          <button type="submit" className={css.submitButton}>
                        Register          {' '}
          </button>
                 {' '}
        </div>
                {error && <p className={css.error}>{error}</p>}     {' '}
      </form>
         {' '}
    </main>
  );
}
