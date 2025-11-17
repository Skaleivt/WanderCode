// app/not-found.tsx
import React from 'react';
import Link from 'next/link';
import Container from '@/components/Container/Container';

export default function NotFound() {
  return (
    <section
      style={{
        textAlign: 'center',
        padding: '50px 0',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        <h1 style={{ fontSize: '72px', color: 'var(--color-royal-blue)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
          Старонка не знойдзена
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '40px' }}>
          На жаль, мы не змаглі знайсці запытаны вамі рэсурс.
        </p>
        <Link
          href="/"
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-scheme-1-accent)',
            color: 'var(--color-white)',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Перайсці на Галоўную
        </Link>
      </Container>
    </section>
  );
}
