// components/PopularSection/PopularSection.client.tsx
'use client';

import { useState } from 'react';
import {
  fetchAllStoriesClient,
  getMe,
  addStoryToSaved,
  removeStoryFromSaved,
} from '@/lib/api/clientApi';
import Link from 'next/link';

import css from './PopularSection.module.css';
import { StoriesResponse, Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { useQuery } from '@tanstack/react-query';

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

const INITIAL_REQUEST_COUNT = 4;

export default function PopularSectionClient({
  initialData,
  initialUser,
  sortField,
  sortOrder,
}: PopularClientProps) {
  const [selectedStories, setSelectedStories] = useState<string[]>(
    initialUser ?? []
  );

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

  const onToggleSuccess = async (
    storyId: string,
    isCurrentlySaved: boolean
  ) => {
    try {
      if (isCurrentlySaved) {
        await removeStoryFromSaved(storyId);
        setSelectedStories((prev) => prev.filter((id) => id !== storyId));
      } else {
        await addStoryToSaved(storyId);
        setSelectedStories((prev) =>
          prev.includes(storyId) ? prev : [...prev, storyId]
        );
      }
    } catch (err) {
      console.error('Failed to toggle saved story', err);
    }
  };

  const effectiveSelectedStories = userData?.selectedStories ?? selectedStories;

  return (
    <div className={css.section}>
      <ul className={css.list}>
        {stories.map((story) => {
          const isStorySaved = effectiveSelectedStories.includes(story._id);
          const storyWithStatus: StoryWithSaveStatus = {
            ...story,
            isFavorite: isStorySaved,
          };

          return (
            <li key={story._id} className={css.listItem}>
              <TravellersStoriesItem
                story={storyWithStatus}
                onToggleSuccess={(id: string, currentlySaved: boolean) =>
                  onToggleSuccess(id, currentlySaved)
                }
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
