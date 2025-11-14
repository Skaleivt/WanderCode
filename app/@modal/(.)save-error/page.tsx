// модалка для помилки при збереженні
// app/@modal/(.)save-error/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// Мінімальная функцыя для адлюстравання памылкі
export default function SaveErrorModal() {
  const router = useRouter();

  // Функцыя для закрыцця мадальнага акна
  const onDismiss = () => {
    router.back();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,0,0,0.1)', // Чырвоны напаўпразрысты фон
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid red',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Памылка Захавання! 🚨</h3>
        <p>Не ўдалося захаваць дадзеныя. Паспрабуйце яшчэ раз.</p>
        <button onClick={onDismiss}>Зразумець</button>
      </div>
    </div>
  );
}
