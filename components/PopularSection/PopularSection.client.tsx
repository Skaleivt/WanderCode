// components/PopularSection/PopularSection.client.tsx
'use client';

import { useCallback, useState } from 'react';
import { fetchAllStoriesClient, getMe } from '@/lib/api/clientApi';
import Link from 'next/link';

import css from './PopularSection.module.css';
import { StoriesResponse, Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type PopularClientProps = {
  initialData: StoriesResponse;
  initialUser: string[] | undefined;
  sortField: string;
  sortOrder: string;
};

interface StoryWithSaveStatus extends Story {
  isFavorite: boolean;
}

interface UserDataResponse {
  selectedStories: string[];
}

// Канстанта для запыту
const INITIAL_REQUEST_COUNT = 4;

export default function PopularSectionClient({
  initialData,
  initialUser,
  sortField,
  sortOrder,
}: PopularClientProps) {
  const queryClient = useQueryClient();

  const [stories] = useState<Story[]>(initialData.data.data ?? []);
  const [hasNextPage] = useState(initialData.data.hasNextPage ?? false);

  const { data: userData } = useQuery<UserDataResponse>({
    queryKey: ['user'],
    queryFn: getMe,
    initialData: initialUser ? { selectedStories: initialUser } : undefined,
    staleTime: Infinity,
  });

  useQuery({
    queryKey: ['stories', 1, INITIAL_REQUEST_COUNT, sortField, sortOrder],
    queryFn: () =>
      fetchAllStoriesClient({
        page: 1,
        perPage: INITIAL_REQUEST_COUNT,
        sortField,
        sortOrder,
      }),
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
            <li key={story._id} className={css.listItem}>
              <TravellersStoriesItem
                story={storyWithStatus}
                onToggleSuccess={updateSelectedStories}
              />
            </li>
          );
        })}
      </ul>
      {hasNextPage && (
        <Link href="/stories" className={css.button}>
          Переглянути всі
        </Link>
      )}
    </div>
  );
}
