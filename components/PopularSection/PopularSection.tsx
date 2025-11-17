export const dynamic = 'force-dynamic';

import { fetchAllStoriesServer, getMeServer } from '@/lib/api/serverApi';
import PopularSectionClient from './PopularSection.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoriesResponse } from '@/types/story';

type PopularSectionProps = {
  page?: number;
  perPage?: number;
  sortOrder?: string;
  sortField?: string;
};

export default async function PopularSection({
  page = 1,
  perPage = 3,
  sortField = 'favoriteCount',
  sortOrder = 'desc',
}: PopularSectionProps) {
  const userData = await getMeServer();

  const queryClient = new QueryClient();

  // Заповнюємо кеш React Query
  await queryClient.prefetchQuery({
    queryKey: ['stories', page, perPage, sortField, sortOrder],
    queryFn: () =>
      fetchAllStoriesServer({ page, perPage, sortField, sortOrder }),
  });

  const initialData = queryClient.getQueryData<StoriesResponse>([
    'stories',
    page,
    perPage,
    sortField,
    sortOrder,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PopularSectionClient
        initialData={initialData!}
        initialUser={userData?.selectedStories}
        perPage={perPage}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </HydrationBoundary>
  );
}
