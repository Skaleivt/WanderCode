'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '../Container/Container';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
// import { ConfirmModal } from "./ConfirmModal";

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  userAvatar?: string;
}

export const Header = ({
  isAuthenticated,
  userName,
  userAvatar,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const router = useRouter();

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    setIsConfirmOpen(true);
  };

  const goToLogin = () => router.push('/auth/login');
  const goToRegister = () => router.push('/auth/register');

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        {' '}
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <svg width="22" height="22" aria-hidden="true">
              <use href="/symbol-defs.svg#icon-logo" />
            </svg>
            Подорожники
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className={styles.navDesktop}>
            <Link href="/">Головна</Link>
            <Link href="/stories">Історії</Link>
            <Link href="/travelers">Мандрівники</Link>

            {isAuthenticated && (
              <>
                <Link href="/profile">Мій Профіль</Link>
                <button className={styles.publishBtn}>
                  Опублікувати історію
                </button>
              </>
            )}

            <div className={styles.authButtons}>
              {!isAuthenticated ? (
                <>
                  <button className={styles.loginBtn} onClick={goToLogin}>
                    Вхід
                  </button>
                  <button className={styles.registerBtn} onClick={goToRegister}>
                    Реєстрація
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.userInfo}>
                    {userAvatar && (
                      <img
                        src={userAvatar}
                        alt="avatar"
                        className={styles.avatar}
                      />
                    )}
                    <span>{userName}</span>
                  </div>
                  <button
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                    title="Вихід"
                  >
                    <FiLogOut size={20} />
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* BURGER ON MOBILE */}
          <button className={styles.menuToggle} onClick={handleToggleMenu}>
            <FiMenu size={24} />
          </button>
        </div>
      </Container>

      {/* MOBILE MENU */}
      {isMenuOpen &&
        createPortal(
          <MobileMenu
            onClose={handleCloseMenu}
            isAuthenticated={isAuthenticated}
            userName={userName}
            userAvatar={userAvatar}
            goToLogin={goToLogin}
            goToRegister={goToRegister}
            onLogout={handleLogout}
          />,
          document.body
        )}

      {/* LOGOUT CONFIRM MODAL */}
      {/* {isConfirmOpen &&
        createPortal(
          <ConfirmModal
            message="Ви впевнені, що хочете вийти?"
            onConfirm={() => {
              setIsConfirmOpen(false);
              console.log("LOGOUT"); // тут буде твоя реальна логіка
            }}
            onCancel={() => setIsConfirmOpen(false)}
          />,
          document.body
        )} */}
    </header>
  );
};
