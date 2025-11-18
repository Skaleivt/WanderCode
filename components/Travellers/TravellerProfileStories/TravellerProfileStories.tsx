// components/Travellers/TravellerProfileStories/TravellerProfileStories.tsx
'use client';

import { useMemo, useEffect, useCallback } from 'react';
import {
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchStoriesPage, StoriesPage } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import StoriesList from '@/components/StoriesList/StoriesList';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import { Story } from '@/types/story';

interface TravellerProfileStoriesProps {
  travellerId: string;
  travellerName: string;
}

const TravellerProfileStories: React.FC<TravellerProfileStoriesProps> = ({
  travellerId,
  travellerName,
}) => {
  const queryClient = useQueryClient();

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
    ['stories', { travellerId: string }],
    number
  >({
    queryKey: ['stories', { travellerId }],
    queryFn: ({ pageParam = 1, queryKey }) => {
      const [, { travellerId }] = queryKey;
      return fetchStoriesPage({ pageParam, travellerId });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // ✅ ВИПРАВЛЕННЯ: Перетворення даних для відповідності типам StoriesList
  const allStories = useMemo(() => {
    const rawStories = data?.pages.flatMap((page) => page.stories) ?? [];

    return rawStories
      .filter((story): story is Story => !!story) // Відфільтровуємо null/undefined
      .map((story) => ({
        ...story,
        // Гарантуємо, що це boolean (якщо undefined -> false)
        isFavorite: story.isFavorite ?? false,
      }));
  }, [data]);

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error
          ? error.message
          : 'Виникла помилка під час завантаження історій';
      showErrorToast(message);
    }
  }, [isError, error]);

  // ✅ ДОДАНО: Обробник для оновлення стану після лайку/збереження
  const handleToggleSuccess = useCallback(() => {
    // Інвалідуємо запит, щоб отримати актуальні дані (наприклад, оновлені isFavorite)
    queryClient.invalidateQueries({ queryKey: ['stories', { travellerId }] });
  }, [queryClient, travellerId]);

  const handleLoadMore = () => {
    fetchNextPage();
  };

  if (isLoading) {
    return (
      <div className="stories-loader">
        <Loader />
      </div>
    );
  }

  const storiesTitle = `Історії, опубліковані ${travellerName}`;

  if (!allStories.length) {
    return (
      <section className="stories-profile">
        <h2 className="stories-empty__title">{storiesTitle}</h2>
        <p className="stories-empty__text">
          {travellerName} поки що не поділився жодною історією.
        </p>
      </section>
    );
  }

  return (
    <section className="stories-profile">
      <h2 className="stories-profile__title">{storiesTitle}</h2>

      {/* ✅ Передаємо оновлений список та функцію toggle */}
      <StoriesList stories={allStories} onToggleSuccess={handleToggleSuccess} />

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

export default TravellerProfileStories;
