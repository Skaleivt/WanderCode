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
  onToggleSuccess: (storyId: string, isAdding: boolean) => void;
}

const StoriesList: React.FC<StoriesListProps> = ({
  stories,
  onToggleSuccess,
}) => {
  // Выкарыстоўваем useMemo для дадатковай дэдуплікацыі і фільтрацыі
  const uniqueStories = useMemo(() => {
    if (!stories || stories.length === 0) {
      return [];
    }

    const uniqueMap = new Map<string, StoryWithStatus>();

    stories.forEach((story) => {
      // Фільтруем null/undefined і тыя, у якіх няма _id
      if (story && story._id) {
        // Гарантуем, што мы дадаем элемент, толькі калі яго яшчэ няма (дэдуплікацыя)
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
        // Выкарыстоўваем story._id як адзіны і ўпэўнены ключ
        return (
          <TravellersStoriesItem
            key={story._id}
            story={story}
            onToggleSuccess={onToggleSuccess}
          />
        );
      })}
    </div>
  );
};

export default StoriesList;
