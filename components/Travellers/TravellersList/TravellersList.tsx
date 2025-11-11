// components/Travellers/TravellersList/TravellersList.tsx
'use client';

import React, { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTravellers,
  FetchTravellersResponse,
} from '@/lib/api/travellersApi';
import {
  TRAVELLERS_INITIAL_PER_PAGE_DESKTOP,
  TRAVELLERS_LOAD_MORE_AMOUNT,
  TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET,
} from '@/constants/pagination';

// IMPORTS FIXED: Importing the single card component correctly
import TravellerCard from '../TravellerCard/TravellerCard';
import Loader from '@/components/Loader/Loader'; // Use your existing Loader
import styles from './TravellersList.module.css';

// Helper to determine initial card count based on screen size (client-side logic required for true adaptation)
const useInitialPerPage = (isMobileView: boolean) => {
  return isMobileView
    ? TRAVELLERS_INITIAL_PER_PAGE_MOBILE_TABLET
    : TRAVELLERS_INITIAL_PER_PAGE_DESKTOP;
};

const TravellersList: React.FC = () => {
  // Placeholder: True adaptation requires client-side state
  const isMobileView = false;
  const initialPerPage = useInitialPerPage(isMobileView);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<FetchTravellersResponse>({
    queryKey: ['travellers'],
    queryFn: ({ pageParam = 1 }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;

      return fetchTravellers({
        page: page,
        perPage: TRAVELLERS_LOAD_MORE_AMOUNT,
      });
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
  });

  const allTravellers = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const loadedPagesCount = data?.pages.length ?? 0;

  // Logic to show initial 12/8 + all subsequently loaded blocks of 4
  const itemsToDisplay =
    initialPerPage +
    Math.max(0, (loadedPagesCount - 1) * TRAVELLERS_LOAD_MORE_AMOUNT);
  const travellersToShow = allTravellers.slice(0, itemsToDisplay);

  // --- UI STATUS HANDLING ---

  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'error') {
    // Error handling: show toast or inline message
    return (
      <p className={styles.error}>
        Error loading travellers: {(error as Error).message}
      </p>
    );
  }

  if (travellersToShow.length === 0) {
    return <p className={styles.empty}>No travellers found.</p>;
  }

  // --- MAIN RENDER ---
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Мандрівники</h2>

      <ul className={styles.list}>
        {travellersToShow.map((traveller) => (
          // Using the TravellerCard component
          <TravellerCard key={traveller.id} traveller={traveller} />
        ))}
      </ul>

      {/* Show "Показати ще" if more pages exist */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={styles.loadMoreButton}
        >
          {isFetchingNextPage ? <Loader /> : 'Показати ще'}
        </button>
      )}

      {/* Show loader for background refetching (not next page) */}
      {isFetching && !isFetchingNextPage && <Loader />}
    </section>
  );
};

export default TravellersList;
