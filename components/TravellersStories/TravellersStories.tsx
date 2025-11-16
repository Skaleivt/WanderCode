// components/TravellersStories/TravellersStories.tsx

'use client';

import { useMemo, useEffect } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchStoriesPage, StoriesPage } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import StoriesList from '@/components/StoriesList/StoriesList';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import { Story } from '@/types/story';

const TravellersStories = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const {
    data,
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
    ['stories', { filter: string }],
    number
  >({
    queryKey: ['stories', { filter }],

    queryFn: ({ pageParam = 1, queryKey }) => {
      const [, { filter }] = queryKey as ['stories', { filter: string }];
      return fetchStoriesPage({ pageParam, filter });
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allStories: Story[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.stories) ?? [];
  }, [data]);

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
      <div className="stories-loader">
        <Loader />
      </div>
    );
  }

  const noStoriesMessage =
    filter === 'all'
      ? 'Наразі немає жодної історії'
      : `Наразі немає історій у категорії "${filter}"`;

  if (!allStories.length) {
    return (
      <div className="stories-empty">
        <h2 className="stories-empty__title">{noStoriesMessage}</h2>
        <p className="stories-empty__text">
          Станьте першим, хто поділиться власною подорожжю та надихне інших!
        </p>
      </div>
    );
  }

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <section className="stories">
      <StoriesList stories={allStories} />

      {hasNextPage && (
        <div className="stories__load-more-wrap">
          <button
            type="button"
            className="stories__load-more-btn"
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
