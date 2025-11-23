'use client';
import {
  hydrate,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { showErrorToast } from '../ShowErrorToast/ShowErrorToast';
import { Story, Category, CategoryResponse } from '@/types/story';
import styles from './StoriesPageWrapper.module.css';
import { getStories } from '@/lib/api/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

type StoriesClientProps = {
  categories: CategoryResponse;
  dehydratedState: unknown;
};

function StoriesList({ categories }: { categories: CategoryResponse }) {
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    undefined
  );
  const [currentPerPage, setCurrentPerPage] = useState(9);

  useEffect(() => {
    const calculatePerPage = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1440) return 8;
      return 9;
    };
    setCurrentPerPage(calculatePerPage());
    const handleResize = () => setCurrentPerPage(calculatePerPage());
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  type StoriesPage = {
    data: {
      data: Story[];
      page: number;
      hasNextPage: boolean;
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<StoriesPage, Error>({
    queryKey: ['stories', currentCategory, currentPerPage],
    queryFn: async (context) => {
      const page = context.pageParam as number;

      return getStories(page, currentPerPage, currentCategory);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    initialPageParam: 1,
  });

  // Фільтрація
  const handleFilter = (catId: string | undefined) => {
    const newCat: string | undefined =
      currentCategory === catId ? undefined : catId;
    setCurrentCategory(newCat);
  };
  // Помилка
  useEffect(() => {
    if (isError) {
      showErrorToast('Something went wrong while fetching stories.');
    }
  }, [isError]);

  return (
    <>
      ({' '}
      <ul>
        <option
          className={styles.categoriesBtn}
          value={''}
          onClick={() => handleFilter(undefined)}
        >
          Всі історії
        </option>
        {Array.isArray(categories.data) &&
          categories.data.map((cat: Category) => (
            <option
              className={styles.categoriesBtn}
              value={cat._id}
              key={cat._id}
              onClick={() => handleFilter(cat._id)}
            >
              {cat.name}
            </option>
          ))}
      </ul>
      ): (
      <ul>
        <button
          className={styles.categoriesBtn}
          onClick={() => handleFilter(undefined)}
        >
          Всі історії
        </button>
        {Array.isArray(categories.data) &&
          categories.data.map((cat: Category) => (
            <button
              className={styles.categoriesBtn}
              key={cat._id}
              onClick={() => handleFilter(cat._id)}
            >
              {cat.name}
            </button>
          ))}
      </ul>
      )
      {data && (
        <ul>
          {data.pages.flatMap((page) => {
            console.log('Сторіз з API:', page.data.data);
            return page.data.data.map((story) => (
              <li key={story._id}>
                <TravellersStoriesItem story={story} />
              </li>
            ));
          })}
        </ul>
      )}
      {hasNextPage && (
        <div className={styles.loadMoreWrap}>
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Завантаження...' : 'Переглянути ще'}
          </button>
        </div>
      )}
      {isLoading && <Loader />}
    </>
  );
}

export default function StoriesClient({
  categories,
  dehydratedState,
}: StoriesClientProps) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    hydrate(queryClient, dehydratedState);
  }, [queryClient, dehydratedState]);

  return (
    <QueryClientProvider client={queryClient}>
      <StoriesList categories={categories} />
    </QueryClientProvider>
  );
}
