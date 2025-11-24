// components/StoriesList/StoriesList.tsx
'use client';

import React, { useMemo } from 'react';
import { Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import styles from './StoriesList.module.css';

export interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

interface StoriesListProps {
  stories: (StoryWithStatus | null | undefined)[];
}

const StoriesList = ({ stories }: StoriesListProps) => {
  const uniqueStories = useMemo(() => {
    if (!stories || stories.length === 0) {
      return [];
    }

    const uniqueMap = new Map<string, StoryWithStatus>();

    stories.forEach((story) => {
      if (story && story._id) {
        if (!uniqueMap.has(story._id)) {
          uniqueMap.set(story._id, story);
        }
      }
    });

    return Array.from(uniqueMap.values());
  }, [stories]);

  if (uniqueStories.length === 0) {
    return null;
  }

  return (
    <div className={styles['stories-list-grid']}>
      {uniqueStories.map((story) => {
        return <TravellersStoriesItem key={story._id} story={story} />;
      })}
    </div>
  );
};

export default StoriesList;
