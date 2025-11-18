// components/StoriesList/StoriesList.tsx
'use client';

import React from 'react';
import { Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem'; // Мяркуецца, што ён існуе
import styles from './StoriesList.module.css'; // Тут павінны быць стылі stories-list-grid

// Тып для перадачы ў TravellersStoriesItem
interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

interface StoriesListProps {
  stories: (StoryWithStatus | null | undefined)[];
  onToggleSuccess: (storyId: string, isAdding: boolean) => void;
}

const StoriesList: React.FC<StoriesListProps> = ({
  stories,
  onToggleSuccess,
}) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className={styles['stories-list-grid']}>
      {stories.map((story, index) => {
        if (!story) {
          return null;
        } // Выкарыстоўваем _id ці індэкс у якасці ключа

        const key = story._id || index;

        return (
          <div key={key}>
            <TravellersStoriesItem // Пераканаўшыся, што тып правільны
              story={story as StoryWithStatus}
              onToggleSuccess={onToggleSuccess}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StoriesList;
