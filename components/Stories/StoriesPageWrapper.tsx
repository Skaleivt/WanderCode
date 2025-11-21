// components/Stories/StoriesPageWrapper.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { getStories, storiesKeys } from '@/lib/api/story';
import { StoriesResponse, Story } from '@/types/story';

import StoriesList from '@/components/StoriesList/StoriesList';
import Loader from '@/components/Loader/Loader';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import styles from './StoriesPageWrapper.module.css';

// Hook to determine screen size for responsive pagination
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth >= 768 && window.innerWidth < 1440) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return screenSize;
};

// Function to adapt STORIES_PER_PAGE based on screen
const getPaginationSettings = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  switch (screenSize) {
    case 'mobile': // Mobile: initial 8 stories, +4 on load more
      return { initial: 8, step: 4 };
    case 'tablet': // Tablet: initial 8 stories (4x2), +4 on load more
      return { initial: 8, step: 4 };
    case 'desktop': // Desktop: initial 9 stories (3x3), +3 on load more
    default:
      return { initial: 9, step: 3 };
  }
};

// Type for list item (required by StoriesList)
export interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

const StoriesPageWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const screenSize = useScreenSize(); // 1. Determine the category filter from URL (ID or 'all')

  const categoryFilter = searchParams.get('filter') || 'all'; // 2. Determine pagination settings dynamically

  const { initial, step } = useMemo(
    () => getPaginationSettings(screenSize),
    [screenSize]
  );

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // refetch, // refetch больш не патрэбны
  } = useInfiniteQuery<
    StoriesResponse,
    Error,
    InfiniteData<StoriesResponse, number>,
    ReturnType<typeof storiesKeys.list>,
    number
  >({
    // ✅ ЗМЕНА: Уключаем initial і step у queryKey. Гэта забяспечвае
    // аўтаматычны скід стану пагінацыі пры змене памеру экрана або фільтра.
    queryKey: storiesKeys.list(categoryFilter, initial, step),

    queryFn: async ({ pageParam = 1 }) => {
      // Calculate limit: initial for the first page, step for subsequent pages
      const limit = pageParam === 1 ? initial : step; // Call getStories with filter and limit

      const response = await getStories(pageParam, limit, categoryFilter);

      return response;
    },

    initialPageParam: 1, // Correctly determine the next page number from API response
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNextPage ? lastPage.data.page + 1 : undefined,
    staleTime: 1000 * 60 * 5, // Refetch when screen size changes to get the correct initial amount
    enabled: true,
  }); // Extract and flatten stories from all pages

  const allStories: StoryWithStatus[] = useMemo(() => {
    // Accessing the actual data: page.data?.data
    const stories =
      queryData?.pages.flatMap((page) => page.data?.data || []) ?? [];

    return stories
      .filter((story): story is Story => !!story)
      .map((story) => ({
        ...story,
        isFavorite: (story as StoryWithStatus).isFavorite ?? false,
      })) as StoryWithStatus[];
  }, [queryData]); // 🛑 ВЫДАЛЕНА: Гэты useEffect больш не патрэбны. Скід адбываецца праз змену queryKey.
  // useEffect(() => {
  //   refetch();
  // }, [categoryFilter, initial, refetch]);
  // Show toasts on error

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
  }; // Placeholder for bookmark handler

  const handleToggleSuccess = (storyId: string, isAdding: boolean) => {
    console.log(`Bookmark for ${storyId}: ${isAdding ? 'added' : 'removed'}`);
  }; // 1. Loading State

  if (isLoading && !isFetchingNextPage) {
    return (
      <div className={styles.storiesLoader}>
                <Loader />       {' '}
      </div>
    );
  }

  const noStoriesMessage = 'На жаль, не знайдено історій.'; // 2. Empty State (Filter works, but no data found)

  if (!allStories.length && !hasNextPage) {
    return (
      <div className={styles.storiesEmpty}>
               {' '}
        <h2 className={styles.storiesEmpty__title}>{noStoriesMessage}</h2>     
         {' '}
        <p className={styles.storiesEmpty__text}>
                    Спробуйте пізніше або змініть фільтри.        {' '}
        </p>
             {' '}
      </div>
    );
  } // 3. Main Rendering

  return (
    <section className={styles.storiesSection}>
           {' '}
      <StoriesList stories={allStories} onToggleSuccess={handleToggleSuccess} />
            {/* Check for next page based on the API response */}     {' '}
      {hasNextPage && (
        <div className={styles.loadMoreWrap}>
                   {' '}
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
                       {' '}
            {isFetchingNextPage ? 'Завантаження...' : 'Переглянути ще'}       
             {' '}
          </button>
                 {' '}
        </div>
      )}
            {isFetchingNextPage && <Loader />}   {' '}
    </section>
  );
};

export default StoriesPageWrapper;
