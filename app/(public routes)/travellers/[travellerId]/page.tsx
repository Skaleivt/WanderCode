import React from 'react';
import {
  getTravellerById,
  getTravellerInfoById,
} from '@/lib/api/travellersApi';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchOwnStoriesServer } from '@/lib/api/serverApi';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { StoriesResponse } from '@/lib/api/clientApi';

type Props = {
  params: Promise<{ travellerId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const travellerId = (await params).travellerId?.trim();
  if (!travellerId) {
    return { title: `Мандрівник не знайдений` };
  }

  const traveller = await getTravellerInfoById(travellerId);
  if (!traveller) {
    return { title: `Мандрівник не знайдений` };
  }

  return {
    title: `Профіль Мандрівніка: ${traveller.name}`,
    description: `Історії подорожей, фото та пригоди з усього світу.`,
    openGraph: {
      title: `Профіль Мандрівніка: ${traveller.name}`,
      description: '',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/travelers/${travellerId}`,
      siteName: 'Подорожники',
      images: [
        {
          url: traveller.avatarUrl,
          width: 1200,
          height: 630,
          alt: `Профіль мандрівника ${traveller.name}`,
        },
      ],
    },
  };
}

export default async function TravellerProfilePage({ params }: Props) {
  const travellerId = (await params).travellerId?.trim();

  const traveller = await getTravellerById(travellerId);
  const queryClient = new QueryClient();
  const filter = travellerId;

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['stories', 9, travellerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchOwnStoriesServer({
        page: pageParam,
        perPage: 9,
        filter,
      }),

    getNextPageParam: (lastPage: StoriesResponse) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    initialPageParam: 1,
  });

  return (
    <Container>
      <div className={css.profile}>
        <TravellersInfo traveller={traveller} />
        <h2 className={css.title}>Історії Мандрівника</h2>
        <TravellersStories
          dehydratedState={dehydrate(queryClient)}
          filter={filter}
        />
      </div>
    </Container>
  );
}
