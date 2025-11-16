"use client";

import { FiX } from "react-icons/fi";
import Link from "next/link";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  onClose: () => void;
  isAuthenticated: boolean;
  userName?: string;
  userAvatar?: string;
  openLoginModal: () => void;
  openRegisterModal: () => void;
}

export const MobileMenu = ({
  onClose,
  isAuthenticated,
  userName,
  userAvatar,
  openLoginModal,
  openRegisterModal,
}: MobileMenuProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#1a5cff" />
            </svg>
            Подорожники
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link href="/" onClick={onClose}>
            Головна
          </Link>
          <Link href="/stories" onClick={onClose}>
            Історії
          </Link>
          <Link href="/travelers" onClick={onClose}>
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

        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <button
                className={styles.loginBtn}
                onClick={() => {
                  onClose();
                  openLoginModal();
                }}
              >
                Вхід
              </button>
              <button
                className={styles.registerBtn}
                onClick={() => {
                  onClose();
                  openRegisterModal();
                }}
              >
                Реєстрація
              </button>
            </>
          ) : (
            <div className={styles.userInfo}>
              {userAvatar && (
                <img src={userAvatar} alt="avatar" className={styles.avatar} />
              )}
              <span>{userName}</span>
              <button className={styles.logoutBtn} onClick={onClose}>
                Вихід
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
