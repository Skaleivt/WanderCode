// components/TravellersStories/TravellersStories.tsx
'use client';

import { useMemo, useEffect } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import {
  fetchStoriesPage,
  StoriesPage,
  StoriesResponse,
} from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import StoriesList from '@/components/StoriesList/StoriesList';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import { Story } from '@/types/story';
import styles from './TravellersStories.module.css';

interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

export interface TravellersStoriesProps {
  initialStories: StoriesResponse;
  filter: string;
}

const TravellersStories = ({
  initialStories,
  filter,
}: TravellersStoriesProps) => {
  const data = initialStories?.data;

  const initialPage: StoriesPage = {
    stories: data?.data || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    nextPage:
      (data?.currentPage || 1) < (data?.totalPages || 1)
        ? (data?.currentPage || 1) + 1
        : undefined,
  };
  const initialDataQuery: InfiniteData<StoriesPage, number> = {
    pages: [initialPage],
    pageParams: [1],
  };

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    StoriesPage,
    Error,
    InfiniteData<StoriesPage, number>,
    ['travellerStories', { filter: string }],
    number
  >({
    queryKey: ['travellerStories', { filter }],

    queryFn: ({ pageParam = 1 }) => {
      return fetchStoriesPage({ pageParam: pageParam as number, filter });
    },

    initialPageParam: initialPage.nextPage || 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: initialDataQuery,
  });

  const allStories: StoryWithStatus[] = useMemo(() => {
    const stories = queryData?.pages.flatMap((page) => page.stories) ?? [];

    return stories
      .filter((story): story is Story => !!story)
      .map((story) => ({
        ...story,
        isFavorite: (story as StoryWithStatus).isFavorite ?? false,
      })) as StoryWithStatus[];
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error
          ? error.message
          : 'Виникла помилка під час завантаження даних';
      showErrorToast(message);
    }
  }, [isError, error]);
  if (isLoading) {
    return (
      <div className={styles.storiesLoader}>
        <Loader />
      </div>
    );
  }

  const noStoriesMessage = 'Цей користувач ще не публікував історій';

  if (!allStories.length && !hasNextPage) {
    return (
      <div className={styles.storiesEmpty}>
        <h2 className={styles.storiesEmpty__title}>{noStoriesMessage}</h2>
        <p className={styles.storiesEmpty__text}>
          Станьце першим, хто поділиться власною подорожжю та надихне іншых!
        </p>
      </div>
    );
  }

  const handleLoadMore = () => {
    fetchNextPage();
  };
  const handleToggleSuccess = (storyId: string, isAdding: boolean) => {
    console.log(
      `Закладка для ${storyId}: ${isAdding ? 'дададзена' : 'выдалена'}`
    );
  };

  return (
    <section className={styles.stories}>
      <StoriesList stories={allStories} onToggleSuccess={handleToggleSuccess} />
      {hasNextPage && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Завантаження...' : 'Переглянути ще'}
          </button>
        </div>
      )}
      {isFetchingNextPage && <Loader />}
    </section>
  );
};

export default TravellersStories;
