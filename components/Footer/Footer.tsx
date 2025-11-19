import Link from 'next/link';
import styles from './Footer.module.css';
// import Image from 'next/image';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    iconId: 'icon-Facebook',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    iconId: 'icon-Instagram',
  },
  { name: 'X', href: 'https://x.com/', iconId: 'icon-X' },
  { name: 'YouTube', href: 'https://www.youtube.com/', iconId: 'icon-Youtube' },
];

const navAuth = [
  { label: 'Головна', href: '/' },
  { label: 'Історії', href: '/stories' },
  { label: 'Мандрівники', href: '/travellers' },
];

const navGuest = [
  { label: 'Головна', href: '/auth/register' },
  { label: 'Історії', href: '/auth/register' },
  { label: 'Мандрівники', href: '/auth/register' },
];

export default function Footer() {
  const isAuthenticated = false; // заміниш на свій стейт

  const navLinks = isAuthenticated ? navAuth : navGuest;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* logo */}
          <div className={styles.topRow}>
            <Link href="/" className={styles.logo}>
              <svg
                className={styles.logo}
                width="22"
                height="22"
                aria-hidden="true"
              >
                <use href="/symbol-defs.svg#icon-logo" />
              </svg>

              <span className={styles.logoText}>Подорожники</span>
            </Link>
          </div>
          {/* соціальні мережі */}
          <ul className={styles.socialList}>
            {socialLinks.map(({ name, href, iconId }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                >
                  <svg
                    className={styles.socialIcon}
                    width="24"
                    height="24"
                    aria-hidden="true"
                  >
                    <use href={`/symbol-defs.svg#${iconId}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          {/* Навігація */}
          <ul className={styles.navList}>
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.divider} />

        <p className={styles.copy}>© 2025 Подорожники. Усі права захищені.</p>
      </div>
    </footer>
  );
}
