'use client';
import css from './AuthPage.module.css';
import { getMe, RegisterRequest, registerUser } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

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
      <h1 className={css.formTitle}>Реєстрація</h1>
      <p className={css.formText}>Раді вас бачити у спільноті мандрівників!</p>
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
