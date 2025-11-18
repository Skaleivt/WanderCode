// components/Travellers/TravellersList/TravellersList.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTravellersClient,
  FetchTravellersResponse as PaginationResult,
} from '@/lib/api/travellersApi';
import {
  TRAVELLERS_INITIAL_PER_PAGE_DESKTOP,
  TRAVELLERS_LOAD_MORE_AMOUNT,
  TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET,
} from '@/constants/pagination';

import TravellerCard from '../TravellerCard/TravellerCard';
import Loader from '@/components/Loader/Loader';
import styles from './TravellersList.module.css';

const useInitialPerPage = (isMobileView: boolean) => {
  return isMobileView
    ? TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET
    : TRAVELLERS_INITIAL_PER_PAGE_DESKTOP;
};

const TravellersList: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsClient(true);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 1440;
  const initialPerPage = useInitialPerPage(isMobileView);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PaginationResult>({
    queryKey: ['travellers', initialPerPage],

    queryFn: ({ pageParam = 1 }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;

      const perPageAmount =
        page === 1 ? initialPerPage : TRAVELLERS_LOAD_MORE_AMOUNT;

      return fetchTravellersClient({
        page: page,
        perPage: perPageAmount,
      });
    },

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      if (typeof lastPage.page === 'number') {
        const loadedCount = allPages.reduce((sum, p) => {
          const len = Array.isArray(p.data) ? p.data.length : 0;
          return sum + len;
        }, 0);
        const nextPerPage = TRAVELLERS_LOAD_MORE_AMOUNT;
        const nextPage = Math.floor(loadedCount / nextPerPage) + 1;
        return lastPage.hasNextPage ? nextPage : undefined;
      }
      if (lastPage.hasNextPage) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    enabled: isClient,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const allTravellers = useMemo(() => {
    const flatList = data?.pages.flatMap((page) => page.data) ?? [];

    const uniqueMap = flatList.reduce((map, traveller) => {
      map.set(traveller._id, traveller);
      return map;
    }, new Map<string, (typeof flatList)[number]>());

    return Array.from(uniqueMap.values());
  }, [data]);

  if (status === 'pending' || !isClient) {
    return <Loader />;
  }

  if (status === 'error') {
    return (
      <p className={styles.error}>
        Error loading travellers: {(error as Error).message}
      </p>
    );
  }

  if (allTravellers.length === 0) {
    return <p className={styles.empty}>No travellers found.</p>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Мандрівники</h2>
      <ul className={styles.list}>
        {allTravellers.map((traveller) => (
          <TravellerCard key={traveller._id} traveller={traveller} />
        ))}
      </ul>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={styles.loadMoreButton}
        >
          {isFetchingNextPage ? <Loader /> : 'Показати ще'}
        </button>
      )}
    </section>
  );
};

export default TravellersList;
