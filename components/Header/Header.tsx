// components/Header/Header.tsx
import React from 'react';
import Link from 'next/link';
import Container from '../Container/Container';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export const Header: React.FC = () => {
  // Navigation links for non-authorized users (MVP)
  const publicNavItems = [
    { href: '/', label: 'Головна' },
    { href: '/stories', label: 'Історії' },
    { href: '/travellers', label: 'Мандрівники' },
  ];

  return (
    <header
      style={{
        backgroundColor: 'var(--color-scheme-1-background)',
        borderBottom: '1px solid var(--color-scheme-1-border)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container className="header-container">
        {' '}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Logo Placeholder */}
          <Link
            href="/"
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--color-royal-blue)',
              textDecoration: 'none',
            }}
          >
            WanderCode LOGO
          </Link>

          {/* Primary Navigation (Desktop view) */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '20px' }}>
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: 'var(--color-neutral-dark)',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons for Non-Logged-in User */}
          <div
            className="auth-buttons"
            style={{ display: 'flex', gap: '10px' }}
          >
            <AuthNavigation />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
