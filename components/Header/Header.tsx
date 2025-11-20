'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';

import AuthNavigation from '../AuthNavigation/AuthNavigation';
import Container from '../Container/Container';
import { useAuthStore } from '@/lib/store/authStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isLoginOpen || isRegisterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen, isLoginOpen, isRegisterOpen]);

  return (
    <Container>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <svg
              className={styles.logo}
              width="22"
              height="22"
              aria-hidden="true"
            >
              <use href="/symbol-defs.svg#icon-logo" />
            </svg>
            Подорожники
          </Link>
          <div className={styles.nav}>
            <nav className={styles.navDesktop}>
              <Link href="/">Головна</Link>
              <Link href="/stories">Історії</Link>
              <Link href="/travellers">Мандрівники</Link>
            </nav>
            {isAuthenticated && (
              <ul className={styles.navigationItem}>
                <li>
                  <Link href="/profile/saved" prefetch={false}>
                    Мій профіль
                  </Link>
                </li>

                <li>
                  <Link
                    href="/stories/create"
                    prefetch={false}
                    className={styles.createStory}
                  >
                    Опублікувати історію
                  </Link>
                </li>
              </ul>
            )}

            <div className={styles.authButtons}>
              <AuthNavigation />
            </div>

            <button className={styles.menuToggle} onClick={handleToggleMenu}>
              <svg width={24} height={24}>
                <use href="/symbol-defs.svg#icon-menu"></use>
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen &&
          createPortal(
            <MobileMenu
              onClose={handleCloseMenu}
              openLoginModal={() => setIsLoginOpen(true)}
              openRegisterModal={() => setIsRegisterOpen(true)}
            />,
            document.body
          )}
      </header>
    </Container>
  );
}
