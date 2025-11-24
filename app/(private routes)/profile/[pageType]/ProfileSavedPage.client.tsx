'use client';

import Loader from '@/components/Loader/Loader';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import TravellersStoriesItem from '@/components/TravellersStoriesItem/TravellersStoriesItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styles from './ProfileOwnPage.module.css';
import { fetchOwnStories, SavedStoriesResponse } from '@/lib/api/clientApi';

export default function ProfileSavedPage() {
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
  } = useInfiniteQuery<SavedStoriesResponse, Error>({
    queryKey: ['storiesSaved', currentPerPage],
    queryFn: async (context) => {
      const page = context.pageParam as number;

      return fetchOwnStories({
        page,
        perPage: currentPerPage,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNextPage) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: currentPerPage !== null,
  });

  useEffect(() => {
    if (isError) {
      showErrorToast('Something went wrong while fetching stories.');
    }
  }, [isError]);

  const isStories = data?.pages.length;

  return (
    <>
      {isStories ? (
        <>
          <ul className={styles.storyList}>
            {data?.pages.flatMap((page) =>
              page?.data.stories.map((story) => (
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
            'У вас ще немає збережених історій, мершій збережіть вашу першу історію!'
          }
          buttonText={'До історій'}
        />
      )}
    </>
  );
}
