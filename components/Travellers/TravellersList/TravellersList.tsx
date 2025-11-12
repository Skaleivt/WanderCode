// components/Travellers/TravellersList/TravellersList.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchTravellers,
  FetchTravellersResponse as PaginationResult,
  Traveller,
} from '@/lib/api/travellersApi';
import {
  TRAVELLERS_INITIAL_PER_PAGE_DESKTOP,
  TRAVELLERS_LOAD_MORE_AMOUNT,
  TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET,
} from '@/constants/pagination';

import TravellerCard from '../TravellerCard/TravellerCard';
import Loader from '@/components/Loader/Loader';
import styles from './TravellersList.module.css';

// Helper to determine initial card count based on screen size
const useInitialPerPage = (isMobileView: boolean) => {
  // Mobile/Tablet: 8, Desktop: 12
  return isMobileView
    ? TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET
    : TRAVELLERS_INITIAL_PER_PAGE_DESKTOP;
};

const TravellersList: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsClient(true);

    queryClient.removeQueries({ queryKey: ['travellers'] });

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [queryClient]);

  const isMobileView = windowWidth < 1440;
  const initialPerPage = useInitialPerPage(isMobileView);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PaginationResult>({
    queryKey: ['travellers'],

    queryFn: ({ pageParam = 1 }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;

      const perPageAmount =
        page === 1 ? initialPerPage : TRAVELLERS_LOAD_MORE_AMOUNT;

      return fetchTravellers({
        page: page,
        perPage: perPageAmount,
      });
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
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

    const uniqueTravellers = flatList.reduce((acc, current) => {
      if (!acc.some((item) => item._id === current._id)) {
        acc.push(current);
      }
      return acc;
    }, [] as Traveller[]);

    return uniqueTravellers;
  }, [data]);

  // --- UI STATUS HANDLING ---

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

  // --- MAIN RENDER ---
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Мандрівнікі</h2>

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

      {isFetching && !isFetchingNextPage && <Loader />}
    </section>
  );
};

export default TravellersList;
