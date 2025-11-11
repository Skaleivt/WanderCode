// app/page.tsx
import React from 'react';
import Container from '@/components/layout/Container/Container';

export default function HomePage() {
  return (
    <Container className="homepage-container">
      <h1 style={{ marginTop: '40px', color: 'var(--color-royal-blue)' }}>
        Welcome to WanderCode
      </h1>

      <p style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '800px' }}>
        This content is wrapped within the **Container** component. Please test
        the following functionality:
      </p>

      {}
      <section
        style={{
          padding: '20px',
          backgroundColor: 'var(--color-royal-blue-lighter)',
          marginBottom: '40px',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ color: 'var(--color-royal-blue-dark)', marginTop: 0 }}>
          Adaptive Container Test
        </h2>
        <ul style={{ color: 'var(--color-neutral-dark)' }}>
          {}
          <li>
            **Mobile ( &lt; 375px ):** The container should be fluid (100%
            width) with 20px padding.
          </li>
          <li>
            **Mobile Fixed ( &gt;= 375px ):** Max-width should be fixed at 375px
            (with 20px padding).
          </li>
          <li>
            **Tablet ( &gt;= 768px ):** Max-width should be fixed at 768px, and
            padding should be 32px.
          </li>
          <li>
            **Desktop ( &gt;= 1440px ):** Max-width should be fixed at 1440px,
            and padding should be 64px.
          </li>
        </ul>
      </section>

      {}
      <section
        style={{
          height: '1000px',
          backgroundColor: 'var(--color-neutral-lightest)',
          border: '1px solid var(--color-scheme-1-border)',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ color: 'var(--color-neutral-darker)' }}>
          Footer Stickiness Test
        </h2>
        <p>This large block of content forces the page to scroll.</p>
        <p>
          Please scroll to the very bottom to ensure the **Footer** is correctly
          positioned at the end of the content, not just the viewport.
        </p>
      </section>

      <h3 style={{ marginTop: '40px', marginBottom: '40px' }}>
        End of Home Page Content.
      </h3>
    </Container>
  );
}
