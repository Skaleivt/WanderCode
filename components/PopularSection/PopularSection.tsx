export const dynamic = 'force-dynamic';

import { fetchAllStoriesServer, getMeServer } from '@/lib/api/serverApi';
import PopularSectionClient from './PopularSection.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoriesResponse } from '@/types/story';

interface UserResponse {
  selectedStories: string[];
}

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
  const queryClient = new QueryClient();

  // 1. Апрацоўка памылкі пры атрыманні гісторый (менш верагодна)
  try {
    await queryClient.prefetchQuery({
      queryKey: ['stories', page, perPage, sortField, sortOrder],
      queryFn: () =>
        fetchAllStoriesServer({ page, perPage, sortField, sortOrder }),
    });
  } catch (error) {
    console.error('SERVER ERROR: Failed to prefetch stories.', error);
    // Калі памылка, queryClient будзе без дадзеных, працягваем.
  }

  // 2. Апрацоўка памылкі пры атрыманні карыстальніка (ВЕРАГОДНАЯ ПРЫЧЫНА 401)
  try {
    await queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: getMeServer,
    });
  } catch (error) {
    // Калі 401, мы лагіруем і дазваляем кампаненту працягваць працу
    console.error(
      'SERVER ERROR: Failed to prefetch user data (expected 401).',
      error
    );
    // Мы не выкідваем памылку, каб блок рэндэрыўся.
  }

  // Атрымліваем дадзеныя (яны могуць быць null/undefined, што апрацоўваецца ў Client)
  const initialData = queryClient.getQueryData<StoriesResponse>([
    'stories',
    page,
    perPage,
    sortField,
    sortOrder,
  ]);

  const initialUserData = queryClient.getQueryData<UserResponse>(['user']);

  // Калі initialData ўсё яшчэ null/undefined пасля апрацоўкі памылак, мы не можам рэндэрыць
  if (!initialData) {
    // Мы можам вярнуць null або паведамленне
    return <p>Няма дадзеных пра папулярныя гісторыі.</p>;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PopularSectionClient
        initialData={initialData} // initialData цяпер гарантавана не null, дзякуючы праверцы
        initialUser={initialUserData?.selectedStories}
        perPage={perPage}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </HydrationBoundary>
  );
}
