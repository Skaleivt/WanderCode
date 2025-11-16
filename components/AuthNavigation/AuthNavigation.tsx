'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import Image from 'next/image';

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.replace('/');
  };

  return isAuthenticated ? (
    <>
      <ul className={css.container}>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Мій профіль
          </Link>
        </li>
        <li>
          <Link
            href="/createStory"
            prefetch={false}
            className={css.createStory}
          >
            Опублікувати історію
          </Link>
        </li>
        <li className={css.avatar}>
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="User Avatar"
              width={32}
              height={32}
              className={css.avatar}
            />
          ) : (
            <div className={css.placeholderAvatar}>👤</div>
          )}
          <p className={css.userEmail}>{user?.name}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            <svg width={24} height={24} className={css.logoutBtnIcon}>
              <use href="/symbol-defs.svg#icon-logout"></use>
            </svg>
          </button>
        </li>
      </ul>
    </>
  ) : (
    <>
      <ul>
        <li className={css.navigationItem}>
          <Link
            href="/auth/login"
            prefetch={false}
            className={css.navigationLink}
          >
            Вхід
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link
            href="/auth/register"
            prefetch={false}
            className={css.navigationLink}
          >
            Реєстрація
          </Link>
        </li>
      </ul>
    </>
  );
}
