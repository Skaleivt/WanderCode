'use client';
import css from './AuthPage.module.css';
import { getMe, RegisterRequest, registerUser } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function RegistrationForm() {
  const [error] = useState('');
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
      toast.info('Реєструємо вас...');
      const res = await registerUser(formValues);

      if (res) {
        const me = await getMe();
        if (me) {
          setUser(me);
          toast.success(
            `Реєстрація пройшла успішно! Ласкаво просимо, ${me.name || 'користувач'}!`
          );
          router.push('/');
        } else {
          toast.warning(
            'Реєстрація пройшла, але не вдалося отримати дані користувача.'
          );
        }
      } else {
        toast.error('Невірна пошта або пароль.');
      }
    } catch {
      toast.error('Сталася помилка. Спробуйте ще раз.');
    }
  };

  useEffect(() => {
    document.title = `Реєстрація| WanderCode`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Створіть новий акаунт. ВВедіть і'я, пошту та пароль`
      );
  });

  return (
    <main className={css.mainContent}>
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
