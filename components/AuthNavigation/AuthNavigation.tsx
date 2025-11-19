'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import Image from 'next/image';
import { useState } from 'react';
import ConfirmModal from '../Modal/ConfirmModal';

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.replace('/');
  };

  return (
    <>
      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Ви точно хочете вийти?"
          description="Ми будемо сумувати за вами!"
          confirmText="Вийти"
          cancelText="Відмінити"
          onConfirm={async () => {
            await handleLogout();
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      )}

      {isAuthenticated ? (
        <>
          <ul className={css.container}>
            <li className={css.navigationItem}>
              <Link
                href="/profile/saved"
                prefetch={false}
                className={css.navigationLink}
              >
                Мій профіль
              </Link>
            </li>

            <li>
              <Link
                href="/stories/create"
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

              <button
                className={css.logoutButton}
                onClick={() => setIsOpen(true)}
              >
                <svg width={24} height={24} className={css.logoutBtnIcon}>
                  <use href="/symbol-defs.svg#icon-logout"></use>
                </svg>
              </button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul className={css.container}>
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
      )}
    </>
  );
}
