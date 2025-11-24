// app/(public routes)/stories/page.tsx

import React from 'react';
import { Metadata } from 'next';
import css from './StoriesPage.module.css';
import {
  fetchAllStoriesServer,
  fetchCategoriesServer,
} from '@/lib/api/serverApi';

import StoriesClient from '@/components/Stories/Stories.client';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Story } from '@/types/story';

type StoriesPage = {
  data: {
    data: Story[];
    page: number;
    hasNextPage: boolean;
  };
};

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
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['stories', undefined, 9],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllStoriesServer({ page: pageParam, perPage: 9 }),
    getNextPageParam: (lastPage: StoriesPage) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    initialPageParam: 1,
  });

  const categories = await fetchCategoriesServer();

  return (
    <section className={css.section}>
      <div className={css.headerContentWrap}>
        <h1 className={css.heading}>Історії Мандрівників</h1>
      </div>
      <StoriesClient
        dehydratedState={dehydrate(queryClient)}
        categories={categories}
      />
    </section>
  );
}
