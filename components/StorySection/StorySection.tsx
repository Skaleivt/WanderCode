// components/StorySection/StorySection.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { StoriesPage } from '@/lib/api/clientApi';
import TravellersStoriesItem from '@/components/TravellersStoriesItem/TravellersStoriesItem';
import { fetchStoriesPage } from '@/lib/api/clientApi';
import { Loader2 } from 'lucide-react';

import styles from './StorySection.module.css';
import { Story } from '@/types/story';
// import { Button } from '../ui/button'; // 🛑 ВЫДАЛЕНЫ ІМПАРТ: Выкарыстоўваем стандартны <button>

interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

interface StorySectionProps {
  queryKey: string;
  title: string;
  limit: 3 | 6 | 9;
  showViewAllButton: boolean;
  viewAllHref?: string;
  filter?: string;
  sortField?: 'favoriteCount' | 'date';
  sortOrder?: 'asc' | 'desc';
  travellerId?: string;
}

const handleToggleSuccess = (storyId: string, isAdding: boolean) => {
  console.log(
    `Story ${storyId} Toggled: ${isAdding ? 'Added' : 'Removed'} (Placeholder)`
  );
};

const StorySection = ({
  queryKey,
  title,
  limit,
  showViewAllButton,
  viewAllHref = '/stories',
  filter,
  sortField,
  sortOrder = 'desc',
  travellerId,
}: StorySectionProps) => {
  // const ITEMS_PER_PAGE = 9; // ✅ ВЫДАЛЕНА: Гэтая зменная больш не патрэбна
  // const initialPagesToFetch = Math.ceil(limit / ITEMS_PER_PAGE) || 1; // 🛑 ВЫДАЛЕНА: Невыкарыстоўваемая зменная

  // 1. Выкарыстанне useInfiniteQuery
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery<StoriesPage>({
    queryKey: [queryKey, filter, sortField, travellerId],
    queryFn: (
      { pageParam = 1 } // ✅ ВЫПРАЎЛЕННЕ: Яўна прыводзім pageParam да number
    ) =>
      fetchStoriesPage({
        pageParam: pageParam as number,
        filter,
        sortField,
        sortOrder,
        travellerId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  }); // 2. Аб'яднанне ўсіх старонак і абрэзка да limit

  const displayedStories: StoryWithStatus[] = useMemo(() => {
    const stories = data?.pages.flatMap((page) => page.stories) || [];
    const slicedStories = stories.slice(0, limit);
    return slicedStories.map((story) => ({
      ...story,
      isFavorite: false,
    })) as StoryWithStatus[];
  }, [data, limit]);

  if (isLoading || status === 'pending') {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="h-8 w-8 animate-spin" /> Завантаження історій...
      </div>
    );
  }
  return (
    <section className={styles.storySection}>
           {' '}
      <header className={styles.sectionHeader}>
                <h2>{title}</h2>       {' '}
        {showViewAllButton && (
          <Link href={viewAllHref} className={styles.viewAllButton}>
                        Показати всі          {' '}
          </Link>
        )}
             {' '}
      </header>
           {' '}
      {displayedStories.length === 0 ? (
        <p className={styles.noStories}>Гісторій не знайдено.</p>
      ) : (
        <div className={styles.storiesGrid}>
                   {' '}
          {displayedStories.map((story) => (
            <TravellersStoriesItem
              key={story._id}
              story={story}
              onToggleSuccess={handleToggleSuccess}
            />
          ))}
                 {' '}
        </div>
      )}
                {/* Кнопка "Загрузіць больш" (Пагінацыя) */}     {' '}
      {!showViewAllButton && hasNextPage && (
        <div className={styles.loadMoreContainer}>
                   {' '}
          {/* ✅ ВЫПРАЎЛЕННЕ: Выкарыстоўваем стандартны <button> замест <Button> */}
                   {' '}
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton} // Трэба дадаць стылі для гэтай кнопкі ў StorySection.module.css
          >
                       {' '}
            {isFetchingNextPage ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />{' '}
                Завантаження...
              </span>
            ) : (
              `Показати ще історії`
            )}
                     {' '}
          </button>
                 {' '}
        </div>
      )}
         {' '}
    </section>
  );
};

export default StorySection;
