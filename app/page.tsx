// app/page.tsx
import React from 'react';
import Container from '@/components/layout/Container/Container';
import Link from 'next/link';
import StoriesList from '@/components/StoriesList/StoriesList';

export default function HomePage() {
  return (
    <Container className="homepage-container">
      {' '}
      <h1 style={{ marginTop: '40px', color: 'var(--color-royal-blue)' }}>
        Welcome to WanderCode{' '}
      </h1>{' '}
      <p style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '800px' }}>
        This content is wrapped within the **Container** component. Please test
        the following functionality:{' '}
      </p>
      {/* Navigation Block */}
      <section
        style={{
          margin: '30px 0',
          padding: '15px',
          border: '2px solid var(--color-accent)',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ color: 'var(--color-accent-dark)', marginTop: 0 }}>
          Navigation
        </h2>
        <p style={{ fontWeight: 'bold' }}>
          Go to the Travellers Page to test the Infinite Scroll functionality:
        </p>

        {/* Link for navigation */}
        <Link
          href="/travellers"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Переглянути Мандрівників ( /travellers )
        </Link>
      </section>
      {/* End Navigation Block */}{' '}

      <section>
        <StoriesList stories={[
          {
            title: 'Венеція без туристів: маршрути для справжніх м',
            description: 'Венеція — це не лише площа Святого Марка і гондоли на Канале Ґранде. Ми вирішили дослідити місто з іншого боку — вулицями, де не ходять натовпи'
          },
          {
            title: 'Північне сяйво в Норвегії: погоня за світлом',
            description: 'Венеція — це не лише площа Святого Марка і гондоли на Канале Ґранде. Ми вирішили дослідити місто з іншого боку — вулицями, де не ходять натовпи'
          },
          {
            title: 'Північне сяйво в Норвегії: погоня за світлом',
            description: 'Венеція — це не лише площа Святого Марка і гондоли на Канале Ґранде. Ми вирішили дослідити місто з іншого боку — вулицями, де не ходять натовпи'
          }
        ]} />
      </section>

      <section
        style={{
          padding: '20px',
          backgroundColor: 'var(--color-royal-blue-lighter)',
          marginBottom: '40px',
          borderRadius: '8px',
        }}
      >
        {' '}
        <h2 style={{ color: 'var(--color-royal-blue-dark)', marginTop: 0 }}>
          Adaptive Container Test{' '}
        </h2>{' '}
        <ul style={{ color: 'var(--color-neutral-dark)' }}>
          {/* Adaptive breakpoints list */}{' '}
          <li>
            **Mobile ( &lt; 375px ):** The container should be fluid (100%
            width) with 20px padding.{' '}
          </li>{' '}
          <li>
            **Mobile Fixed ( &gt;= 375px ):** Max-width should be fixed at 375px
            (with 20px padding).{' '}
          </li>{' '}
          <li>
            **Tablet ( &gt;= 768px ):** Max-width should be fixed at 768px, and
            padding should be 32px.{' '}
          </li>{' '}
          <li>
            **Desktop ( &gt;= 1440px ):** Max-width should be fixed at 1440px,
            and padding should be 64px.{' '}
          </li>{' '}
        </ul>{' '}
      </section>
      {/* Footer Stickiness Test Block */}{' '}
      <section
        style={{
          height: '1000px',
          backgroundColor: 'var(--color-neutral-lightest)',
          border: '1px solid var(--color-scheme-1-border)',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        {' '}
        <h2 style={{ color: 'var(--color-neutral-darker)' }}>
          Footer Stickiness Test{' '}
        </h2>
        <p>This large block of content forces the page to scroll.</p>{' '}
        <p>
          Please scroll to the very bottom to ensure the **Footer** is correctly
          positioned at the end of the content, not just the viewport.{' '}
        </p>{' '}
      </section>{' '}
      <h3 style={{ marginTop: '40px', marginBottom: '40px' }}>
        End of Home Page Content.{' '}
      </h3>{' '}
    </Container>
  );
}
