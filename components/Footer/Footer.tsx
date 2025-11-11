// components/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Container from '../layout/Container/Container';

export const Footer: React.FC = () => {
  // Navigation links
  const navItems = [
    { href: '/', label: 'Головна' },
    { href: '/stories', label: 'Історії' },
    { href: '/travellers', label: 'Мандрівники' },
    { href: '/profile', label: 'Профіль' },
  ];

  // Social media links (placeholders)
  const socialLinks = [
    { href: 'https://www.facebook.com/', label: 'Facebook' },
    { href: 'https://www.instagram.com/', label: 'Instagram' },
    { href: 'https://x.com/', label: 'X' },
    { href: 'https://www.youtube.com/', label: 'YouTube' },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-neutral-darker)',
        color: 'var(--color-white)',
        padding: '40px 0',
        marginTop: 'auto',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          {/* Top section: Logo, Nav, Social (Simple Flex Layout) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '30px',
            }}
          >
            {/* Logo Placeholder */}
            <Link
              href="/"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--color-white)',
                textDecoration: 'none',
              }}
            >
              WanderCode LOGO
            </Link>

            {/* Navigation Block */}
            <nav>
              <h4 style={{ marginBottom: '10px', color: 'var(--color-white)' }}>
                Навігація
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {navItems.map((item) => (
                  <li key={item.href} style={{ marginBottom: '5px' }}>
                    <Link
                      href="/auth/register"
                      style={{
                        color: 'var(--color-neutral-light)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Media Block */}
            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--color-white)' }}>
                Соцмережі
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  gap: '15px',
                }}
              >
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-white)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section: Copyright */}
          <div
            style={{
              borderTop: '1px solid var(--opacity-white-15)',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--color-neutral-light)',
              }}
            >
              © 2025 Подорожники. Усі права захищені.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
