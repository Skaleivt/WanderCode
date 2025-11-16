"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import styles from "./Header.module.css";
import { MobileMenu } from "./MobileMenu";
import LoginForm from "../forms/LoginForm";
import RegistrationForm from "../forms/RegistrationForm";
import { Modal } from "../modal/Modal";
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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isLoginOpen || isRegisterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen, isLoginOpen, isRegisterOpen]);
  const handleLogout = () => {
    const confirmed = window.confirm("Ви впевнені, що хочете вийти?");
    if (confirmed) {
      console.log("Вихід");
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#1a5cff" />
          </svg>
          Подорожники
        </Link>

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
                <button
                  className={styles.loginBtn}
                  onClick={() => setIsLoginOpen(true)}
                >
                  Вхід
                </button>
                <button
                  className={styles.registerBtn}
                  onClick={() => setIsRegisterOpen(true)}
                >
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

        <button className={styles.menuToggle} onClick={handleToggleMenu}>
          <FiMenu size={24} />
        </button>
      </div>

      {isMenuOpen &&
        createPortal(
          <MobileMenu
            onClose={handleCloseMenu}
            isAuthenticated={isAuthenticated}
            userName={userName}
            userAvatar={userAvatar}
            openLoginModal={() => setIsLoginOpen(true)}
            openRegisterModal={() => setIsRegisterOpen(true)}
          />,
          document.body
        )}

      {}
      {/* {isConfirmOpen &&
        createPortal(
          <ConfirmModal
            message="Ви впевнені, що хочете вийти?"
            onConfirm={() => {
              setIsConfirmOpen(false);
              console.log("Вихід"); // тут треба викликати функцію logout
            }}
            onCancel={() => setIsConfirmOpen(false)}
          />,
          document.body
        )} */}
      {isLoginOpen &&
        createPortal(
          <Modal onClose={() => setIsLoginOpen(false)}>
            <LoginForm
              onToggle={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
            />
          </Modal>,
          document.body
        )}

      {isRegisterOpen &&
        createPortal(
          <Modal onClose={() => setIsRegisterOpen(false)}>
            <RegistrationForm
              onToggle={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
            />
          </Modal>,
          document.body
        )}
    </header>
  );
};
