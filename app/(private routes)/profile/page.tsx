// app/(private routes)/profile/page.tsx
import React from 'react';

// Вызначаем асінхронны Server Component, як патрабуе Next.js App Router
export default async function ProfilePage() {
  // Тут будзе логіка атрымання дадзеных карыстальніка і яго гісторый

  return (
    <main style={{ padding: '20px' }}>
      <h1>Вітаем у вашым профілі!</h1>
      <p>Гэты раздзел знаходзіцца ў стадыі распрацоўкі.</p>
    </main>
  );
}
