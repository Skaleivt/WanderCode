import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Link from 'next/link';
import css from './AuthPage.module.css';
import Container from '@/components/Container/Container';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            <li className={authType === 'register' ? css.active : ''}>
              <Link
                aria-disabled={authType === 'register'}
                href="/auth/register"
              >
                Реєстрація
              </Link>
            </li>
            <li className={authType === 'login' ? css.active : ''}>
              <Link aria-disabled={authType === 'login'} href="/auth/login">
                Вхід
              </Link>
            </li>
          </ul>
          {authType === 'register' ? <RegistrationForm /> : <LoginForm />}
        </div>
        <footer className={css.footer}>&copy; 2025 Подорожники</footer>
      </section>
    </Container>
  );
}
