// app/(public routes)/stories/page.tsx

import React, { Suspense } from 'react';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import StoriesPageWrapper from '@/components/Stories/StoriesPageWrapper';
import { Metadata } from 'next';
import css from './StoriesPage.module.css';
import CategoriesFilterControls from '@/components/Stories/StoriesFilterControls';
import { fetchCategoriesServer } from '@/lib/api/serverApi';
import { Category } from '@/types/story';

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
  let categories: Category[] = [];

  try {
    const categoriesData = await fetchCategoriesServer();
    categories = categoriesData?.data || [];
  } catch (error) {
    console.error('Failed to fetch categories on server:', error);
  }

  return (
    <Container>
      <section className={css.section}>
        <div className={css.headerContentWrap}>
          <h1 className={css.heading}>Історії Мандрівників</h1>
          <CategoriesFilterControls categories={categories} />
        </div>
        <Suspense fallback={<Loader />}>
          <StoriesPageWrapper />
        </Suspense>
      </section>
    </Container>
  );
}
