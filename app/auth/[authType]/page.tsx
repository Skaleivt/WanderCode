import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Link from 'next/link';
import css from './AuthPage.module.css';

type AuthPageProps = {
  params: { authType: string };
};

export default async function AuthPage({ params }: AuthPageProps) {
  const { authType } = await params;

  return (
    <>
      <div className={css.authContainer}>
        <ul className={css.authNavList}>
          <li>
            <Link href="/auth/register">Реєстрація</Link>
          </li>
          <li>
            <Link href="/auth/login">Вхід</Link>
          </li>
        </ul>
        {authType === 'register' ? <RegistrationForm /> : <LoginForm />}
      </div>
    </>
  );
  notFound();
}
