'use client';
import css from './SignUpPage.module.css';
import { RegisterRequest, registerUser } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';

export default function SingUp() {
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues: RegisterRequest = {
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };
    try {
      const res = await registerUser(formValues);

      if (res) {
        setUser(res);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError((error as ApiError).message ?? 'Oops... some error');
    }
  };
  // переписати матадані
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
      <ul>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Вхід
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Реєстрація
          </Link>
        </li>
      </ul>
      <h1 className={css.formTitle}>Реєстрація</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="name">Імʼя та Прізвище*</label>
          <input
            id="name"
            type="name"
            name="name"
            className={css.input}
            required
            placeholder="Ваше імʼя та прізвище"
          />
        </div>

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
            Зареєструватись
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
