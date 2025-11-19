'use client';

import css from './AuthPage.module.css';
import { AuthorizationRequest, getMe, loginUser } from '@/lib/api/clientApi';

import { useEffect, useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [error] = useState('');
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
      toast.info('Перевіряємо ваші дані...');
      const res = await loginUser(formValues);

      if (res) {
        const me = await getMe();
        if (me) {
          setUser(me);
          toast.success(`Ласкаво просимо, ${me.name || 'користувач'}!`);
          router.push('/');
        } else {
          toast.warning('Не вдалося отримати дані користувача.');
        }
      } else {
        toast.error('Невірна пошта або пароль.');
      }
    } catch (error) {
      toast.error(
        (error as ApiError).message ?? 'Сталася помилка. Спробуйте ще раз.'
      );
    }
  };

  useEffect(() => {
    document.title = `Вхід | WanderCode`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', `Ввійдіть у свій WanderCode акаунт`);
  });

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Вхід</h1>
        <p className={css.formText}>Вітаємо знову у спільноту мандрівників!</p>
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
