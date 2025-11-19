import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Link from 'next/link';
import css from './AuthPage.module.css';
import Container from '@/components/Container/Container';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Props = {
  params: Promise<{ authType: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { authType } = await params;

  if (authType !== 'login' && authType !== 'register') {
    notFound();
  }

  const isRegister = authType === 'register';
  const title = isRegister ? 'Реєстрація | Подорожники' : 'Вхід | Подорожники';
  const description = isRegister
    ? 'Створіть новий акаунт у спільноті мандрівників. Заповніть форму реєстрації, щоб приєднатися.'
    : 'Увійдіть до свого акаунта Подорожників. Введіть електронну пошту та пароль.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/${authType}`,
      siteName: 'Подорожники',
      images: [
        {
          url: '/home/back-main-desk-1x.webp',
          width: 1200,
          height: 630,
          alt: isRegister ? 'Сторінка реєстрації' : 'Сторінка входу',
        },
      ],
    },
  };
}

type AuthPageProps = {
  params: Promise<{ authType: string }>;
};

import LoginForm from "../../components/forms/LoginForm";
import RegistrationForm from "../../components/forms/RegistrationForm";
import AuthFormWrapper from "../../components/forms/AuthFormWrapper";

interface AuthPageProps {
  params: { authType: "login" | "register" };
}

export default function AuthPage({ params }: AuthPageProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // наприклад, user токен
    if (storedUser) {
      setIsAuthenticated(true);
      router.replace("/");
    }
  }, [router]);

  if (isAuthenticated) return null;

  return (
    <Container>
      <section className={css.auth}>
        <header className={css.header}>
          <div className={css.topRow}>
            <Link href="/" className={css.logo}>
              <svg width="22" height="22" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-logo" />
              </svg>

              <span className={css.logoText}>Подорожники</span>
            </Link>
          </div>
        </header>
        <div className={css.authContainer}>
          <ul className={css.authNavList}>
            <li
              className={`${css.authNavItem} ${
                authType === 'register' ? css.active : ''
              }`}
            >
              <Link href="/auth/register">Реєстрація</Link>
            </li>

            <li
              className={`${css.authNavItem} ${
                authType === 'login' ? css.active : ''
              }`}
            >
              <Link href="/auth/login">Вхід</Link>
            </li>
          </ul>

          {authType === 'register' ? <RegistrationForm /> : <LoginForm />}
        </div>
        <footer className={css.footer}>&copy; 2025 Подорожники</footer>
      </section>
    </Container>
  );
}
