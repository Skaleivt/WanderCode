// components/Stories/StoriesPageWrapper.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import {
  fetchStoriesPage, // Кліенцкі API
  StoriesPage,
} from '@/lib/api/clientApi';

import StoriesList from '@/components/StoriesList/StoriesList';
import Loader from '@/components/Loader/Loader';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import { Story } from '@/types/story'; // Мяркуецца, што ён існуе
import styles from './StoriesPageWrapper.module.css'; // Мяркуецца, што файл стыляў створаны

// Тып для перадачы ў StoriesList
interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

const STORIES_PER_PAGE = 9; // Памер старонкі 9 -> +3

const StoriesPageWrapper: React.FC = () => {
  const searchParams = useSearchParams(); // Фільтр не выкарыстоўваецца без катэгорый, але пакідаем для будучага выкарыстання
  const filter = searchParams.get('filter') || undefined;

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
    ['allStories', { filter: string | undefined }],
    number
  >({
    queryKey: ['allStories', { filter }],

    queryFn: ({ pageParam = 1 }) => {
      return fetchStoriesPage({
        pageParam,
        filter,
        perPage: STORIES_PER_PAGE,
      });
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  }); // Аб'ядноўваем дадзеныя з усіх старонак
  const allStories: StoryWithStatus[] = useMemo(() => {
    const stories = queryData?.pages.flatMap((page) => page.stories) ?? [];

    return stories
      .filter((story): story is Story => !!story)
      .map((story) => ({
        ...story, // Забеспячэнне наяўнасці поля isFavorite
        isFavorite: (story as StoryWithStatus).isFavorite ?? false,
      })) as StoryWithStatus[];
  }, [queryData]); // Паказваем тосты пры памылках

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error
          ? error.message
          : 'Виникла помилка під час завантаження даних';
      showErrorToast(message);
    }
  }, [isError, error]);

  const handleLoadMore = () => {
    fetchNextPage();
  }; // Заглушка для апрацоўшчыка закладак
  const handleToggleSuccess = (storyId: string, isAdding: boolean) => {
    console.log(
      `Закладка для ${storyId}: ${isAdding ? 'дададзена' : 'выдалена'}`
    );
  }; // 1. Статус Загрузка

  if (isLoading && !isFetchingNextPage) {
    return (
      <div className={styles.storiesLoader}>
                <Loader />     {' '}
      </div>
    );
  }

  const noStoriesMessage = 'На жаль, не знайдено історій.'; // 2. Статус Пуста

  if (!allStories.length && !hasNextPage) {
    return (
      <div className={styles.storiesEmpty}>
        <h2 className={styles.storiesEmpty__title}>{noStoriesMessage}</h2>     
          <p className={styles.storiesEmpty__text}>Спробуйте пізніше.</p>   
      </div>
    );
  } // 3. Галоўны Рэндэрынг

  return (
    <section className={styles.storiesSection}>
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
            {isFetchingNextPage && <Loader />}       {' '}
    </section>
  );
};

export default StoriesPageWrapper;
