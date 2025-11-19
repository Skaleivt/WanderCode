'use client';
import Link from 'next/link';
import styles from './MobileMenu.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

interface MobileMenuProps {
  onClose: () => void;
  userName?: string;
  userAvatar?: string;
  openLoginModal: () => void;
  openRegisterModal: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg
              className={styles.logo}
              width="22"
              height="22"
              aria-hidden="true"
            >
              <use href="/symbol-defs.svg#icon-logo" />
            </svg>
            Подорожники
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width={24} height={24}>
              <use href="/symbol-defs.svg#icon-close"></use>
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          <Link href="/" onClick={onClose}>
            Головна
          </Link>
          <Link href="/stories" onClick={onClose}>
            Історії
          </Link>
          <Link href="/travellers" onClick={onClose}>
            Мандрівники
          </Link>

          {isAuthenticated && (
            <>
              <Link href="/profile" onClick={onClose}>
                Мій Профіль
              </Link>
              <button className={styles.publishBtn} onClick={onClose}>
                Опублікувати історію
              </button>
            </>
          )}
        </nav>
        <AuthNavigation />
      </div>
    </div>
  );
};
