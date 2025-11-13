'use client';

import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import css from './PopularSection.module.css';
import { getPopularStories } from '@/lib/api/clientApi';
import { Story, StoriesResponse } from '@/types/story';
import { showErrorToast } from '../ShowErrorToast/ShowErrorToast';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

export default function PopularSection() {
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);

  const query = useQuery<StoriesResponse, Error>({
    queryKey: ['popularStories', page],
    queryFn: () => getPopularStories(page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.data) {
      setStories((prev) => [...prev, ...query.data.stories]);
    }
  }, [query.data]);

  useEffect(() => {
    if (query.isError) {
      showErrorToast('Не вдалося завантажити історії');
    }
  }, [query.isError]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Популярні історії</h2>

        {query.isLoading && page === 1 && <Loader />}

        {query.isError && (
          <p className={css.error}>Сталася помилка при завантаженні</p>
        )}

        {stories.length > 0 && (
          <div className={css.list}>
            {stories.map((story) => (
              <TravellersStoriesItem key={story._id} story={story} />
            ))}
          </div>
        )}

        {!query.isLoading && !query.isError && stories.length === 0 && (
          <p className={css.empty}>Поки що немає історій.</p>
        )}

        {query.data?.hasMore && (
          <button
            className={css.button}
            onClick={handleLoadMore}
            disabled={query.isFetching}
          >
          Переглянути всі
          </button>
        )}
      </div>
    </section>
  );
}
