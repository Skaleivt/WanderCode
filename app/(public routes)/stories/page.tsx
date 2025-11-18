// app/(public routes)/stories/page.tsx

import React, { Suspense } from 'react';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import StoriesPageWrapper from '@/components/Stories/StoriesPageWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Всі Історії Мандрівників | WanderCode',
  description:
    'Перегляньте повний архів автентичних історій від спільноти Wander Code. Надихайтеся новими маршрутами, порадами та враженнями з усього світу.',
  keywords: [
    'всі історії',
    'архів подорожей',
    'блоги мандрівників',
    'нові історії',
    'пригоди',
  ],
  openGraph: {
    title: 'Архів Історій WanderCode',
    description:
      'Кожна подорож – це унікальна історія. Знайдіть свою наступну пригоду серед тисяч оповідань від нашої спільноти.',
    url: '/wandercode.jpg',
    siteName: 'WanderCode',
    type: 'website',
  },
};

export default async function StoriesPage() {
  return (
    <Container>
      <h1 className="main-title">Всі Історії</h1>

      <Suspense fallback={<Loader />}>
        <StoriesPageWrapper />
      </Suspense>
    </Container>
  );
}
