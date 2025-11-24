'use client';

import Loader from '@/components/Loader/Loader';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import TravellersStoriesItem from '@/components/TravellersStoriesItem/TravellersStoriesItem';
import { fetchOwnStoriesClient } from '@/lib/api/clientApi';
import { StoriesResponse } from '@/types/story';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styles from './ProfileOwnPage.module.css';

export interface TravellersStoriesProps {
  filter: string;
}

export default function ProfileOwnPage({ filter }: TravellersStoriesProps) {
  const [currentPerPage, setCurrentPerPage] = useState(3);

  useEffect(() => {
    const calculatePerPage = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1440) return 2;
      return 3;
    };
    setCurrentPerPage(calculatePerPage());
    const handleResize = () => setCurrentPerPage(calculatePerPage());
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<StoriesResponse, Error>({
    queryKey: ['storiesOwn', currentPerPage],
    queryFn: async (context) => {
      const page = context.pageParam as number;

      return fetchOwnStoriesClient({
        page,
        perPage: currentPerPage,
        filter,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    initialPageParam: 1,
  });

  const hasStories = data?.pages.some((page) => page.data.data.length > 0);
  useEffect(() => {
    if (isError) {
      showErrorToast('Something went wrong while fetching stories.');
    }
  }, [isError]);

  return (
    <>
      {hasStories ? (
        <>
          <ul className={styles.storyList}>
            {data?.pages.flatMap((page) =>
              page.data.data.map((story) => (
                <li className={styles.storyItem} key={story._id}>
                  <TravellersStoriesItem story={story} />
                </li>
              ))
            )}
          </ul>
          {hasNextPage && (
            <div className={styles.loadMoreWrap}>
              <button
                className={styles.loadMoreBtn}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Завантаження...' : 'Переглянути ще'}
              </button>
            </div>
          )}
          {isLoading && <Loader />}
        </>
      ) : (
        <MessageNoStories
          text={
            'Ви ще нічого не публікували, поділіться своєю першою історією!'
          }
          buttonText={'Опублікувати історію'}
        />
      )}
    </>
  );
}
