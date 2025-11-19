'use client';

import React, { useCallback, useState } from 'react';
import {
  FetchTravellersResponse,
  fetchTravellersClient,
  Traveller,
} from '@/lib/api/travellersApi';
import TravellerCard from '../TravellerCard/TravellerCard';
import Loader from '@/components/Loader/Loader';
import styles from './TravellersList.module.css';

type TravellersListClientProps = {
  initialData: FetchTravellersResponse;
  loadMoreAmount: number; // кількість елементів на наступні сторінки
};

export default function TravellersListClient({
  initialData,
  loadMoreAmount,
}: TravellersListClientProps) {
  const [travellers, setTravellers] = useState<Traveller[]>(
    initialData.data ?? []
  );
  const [page, setPage] = useState<number>(initialData.page ?? 1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initialData.hasNextPage ?? false
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    setError(null);

    const nextPage = page + 1;

    try {
      const res = await fetchTravellersClient({
        page: nextPage,
        perPage: loadMoreAmount,
      });

      // Додаємо нові елементи
      setTravellers((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasNextPage(res.hasNextPage ?? false);
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити наступну сторінку мандрівників.');
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, page, loadMoreAmount]);

  if (travellers.length === 0 && !loading) {
    return <p className={styles.empty}>No travellers found.</p>;
  }

  return (
    <section className={styles.section}>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.list}>
        {travellers.map((traveller) => (
          <TravellerCard key={traveller._id} traveller={traveller} />
        ))}
      </ul>

      {hasNextPage && (
        <button
          className={styles.loadMoreButton}
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? <Loader /> : 'Показати ще'}
        </button>
      )}
    </section>
  );
}
