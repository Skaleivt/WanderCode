'use client';

import { useState } from 'react';
import { fetchAllStoriesClient } from '@/lib/api/clientApi';
import TravelersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import css from './PopularSection.module.css';
import { StoriesResponse } from '@/types/story';

type PopularClientProps = {
  initialData: StoriesResponse;
  perPage: number;
  sortField: string;
  sortOrder: string;
};

export default function PopularSectionClient({
  initialData,
  perPage,
  sortField,
  sortOrder,
}: PopularClientProps) {
  const [stories, setStories] = useState(initialData.data.data ?? []);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(
    initialData.data.hasNextPage ?? false
  );
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);

    const nextPage = page + 1;
    const data = await fetchAllStoriesClient({
      page: nextPage,
      perPage,
      sortField,
      sortOrder,
    });

    setStories((prev) => [...prev, ...data.data.data]);
    setPage(nextPage);
    setHasNextPage(data.data.hasNextPage);
    setLoading(false);
  };

  return (
    <section className={css.section}>
      <div className={css.list}>
        {stories.map((story) => (
          <TravelersStoriesItem key={story._id} story={story} />
        ))}
      </div>

      {hasNextPage && (
        <button className={css.button} onClick={loadMore} disabled={loading}>
          {loading ? 'Завантаження...' : 'Завантажити ще'}
        </button>
      )}
    </section>
  );
}
