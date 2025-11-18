'use client';

import { useCallback, useState } from 'react';
import { fetchAllStoriesClient, getMe } from '@/lib/api/clientApi';

import css from './PopularSection.module.css';
import { StoriesResponse, Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const [stories, setStories] = useState<Story[]>(initialData.data.data ?? []);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(
    initialData.data.hasNextPage ?? false
  );
  const [loading, setLoading] = useState(false);

  const { data: userData } = useQuery<UserDataResponse>({
    queryKey: ['user'],
    queryFn: getMe,
    initialData: initialUser ? { selectedStories: initialUser } : undefined,
    staleTime: Infinity,
  });

  useQuery({
    queryKey: ['stories', page, perPage, sortField, sortOrder],
    queryFn: () =>
      fetchAllStoriesClient({ page, perPage, sortField, sortOrder }),
    initialData: initialData,
    enabled: false,
  });

  const selectedStories = userData?.selectedStories ?? [];

  const updateSelectedStories = useCallback(
    (storyId: string, isAdding: boolean) => {
      queryClient.setQueryData<UserDataResponse | undefined>(
        ['user'],
        (prevData) => {
          if (!prevData) return prevData;

          let newSelectedStories;
          if (isAdding) {
            newSelectedStories = prevData.selectedStories.includes(storyId)
              ? prevData.selectedStories
              : [...prevData.selectedStories, storyId];
          } else {
            newSelectedStories = prevData.selectedStories.filter(
              (id) => id !== storyId
            );
          }
          return { ...prevData, selectedStories: newSelectedStories };
        }
      );
    },
    [queryClient]
  );

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const storiesData = await fetchAllStoriesClient({
        page: nextPage,
        perPage,
        sortField,
        sortOrder,
      });

      setStories((prev) => [...prev, ...storiesData.data.data]);
      setPage(nextPage);
      setHasNextPage(storiesData.data.hasNextPage);

      // Не трэба выклікаць getMe(), бо стан карыстальніка падтрымліваецца useQuery
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
// components/PopularSection/PopularSection.client.tsx
