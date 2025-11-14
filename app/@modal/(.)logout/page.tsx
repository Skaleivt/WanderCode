// модалка для підтвердження виходу
// app/@modal/(.)logout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// Мінімальная функцыя, неабходная для таго, каб Next.js распазнаў файл як модуль
export default function LogoutModal() {
  const router = useRouter();

  // Функцыя для закрыцця мадальнага акна, вяртаючыся на папярэдні маршрут
  const onDismiss = () => {
    router.back();
  };

  return (
    // Мінімальная структура для мадальнага акна
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onDismiss}
    >
      <div
        style={{ padding: '20px', background: 'white', borderRadius: '8px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Выхад з сістэмы</h3>
        <p>Выхад адбыўся.</p>
        <button onClick={onDismiss}>Закрыць</button>
      </div>
    </div>
  );
}
