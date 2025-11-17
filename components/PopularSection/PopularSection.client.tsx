'use client';

import { useCallback, useState } from 'react';
import { fetchAllStoriesClient, getMe } from '@/lib/api/clientApi';

import css from './PopularSection.module.css';
import { StoriesResponse, Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { useQuery } from '@tanstack/react-query';

type PopularClientProps = {
  initialData: StoriesResponse;
  initialUser: string[] | undefined;
  perPage: number;
  sortField: string;
  sortOrder: string;
};

interface StoryWithSaveStatus extends Story {
  isFavorite: boolean;
}

interface UserDataResponse {
  selectedStories: string[];
}

export default function PopularSectionClient({
  initialData,
  initialUser,
  perPage,
  sortField,
  sortOrder,
}: PopularClientProps) {
  // 🟦 Локальні стани (заповнюємо серверними даними)
  const [stories, setStories] = useState<Story[]>(initialData.data.data ?? []);
  const [selectedStories, setSelectedStories] = useState<string[]>(
    initialUser ?? []
  );
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(
    initialData.data.hasNextPage ?? false
  );
  const [loading, setLoading] = useState(false);

  // 🟦 Автоматичне оновлення сторінок, якщо зміниться сортування
  useQuery({
    queryKey: ['stories', page, perPage, sortField, sortOrder],
    queryFn: () =>
      fetchAllStoriesClient({ page, perPage, sortField, sortOrder }),
    initialData: initialData,
    enabled: false, // ❗ Цей useQuery тут не повинен запускатися автоматично
  });

  // 🟦 Оновлення списку вибраних історій
  const updateSelectedStories = useCallback(
    (storyId: string, isAdding: boolean) => {
      setSelectedStories((prevIds) =>
        isAdding
          ? prevIds.includes(storyId)
            ? prevIds
            : [...prevIds, storyId]
          : prevIds.filter((id) => id !== storyId)
      );
    },
    []
  );

  // 🟦 Завантажити більше історій
  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const [storiesData, userDataRaw] = await Promise.all([
        fetchAllStoriesClient({
          page: nextPage,
          perPage,
          sortField,
          sortOrder,
        }),
        getMe(),
      ]);

      const userData = (userDataRaw ?? {}) as UserDataResponse;

      setStories((prev) => [...prev, ...storiesData.data.data]);
      setSelectedStories(userData.selectedStories ?? []);
      setPage(nextPage);
      setHasNextPage(storiesData.data.hasNextPage);
    } catch (err) {
      console.error('Помилка завантаження наступної сторінки:', err);
    }

    setLoading(false);
  };

  return (
    <div className={css.section}>
      <ul className={css.list}>
        {stories.map((story) => {
          const isStorySaved = selectedStories.includes(story._id);
          const storyWithStatus: StoryWithSaveStatus = {
            ...story,
            isFavorite: isStorySaved,
          };

          return (
            <li key={story._id}>
              <TravellersStoriesItem
                story={storyWithStatus}
                onToggleSuccess={updateSelectedStories}
              />
            </li>
          );
        })}
      </ul>

      {hasNextPage && (
        <button className={css.button} onClick={loadMore} disabled={loading}>
          {loading ? 'Завантаження...' : 'Завантажити ще'}
        </button>
      )}
    </div>
  );
}
