// components/StoriesList/StoriesList.tsx
import React from 'react';
import { Story } from '@/types/story';
// ✅ 1. ІМПАРТУЕМ КАМПАНЕНТ ДЛЯ АДЛЮСТРАВАННЯ ЭЛЕМЕНТАЎ
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

// Паколькі TravellersStoriesItem чакае isFavorite, мы выкарыстоўваем тып,
// які гарантуе гэта (пры ўмове, што ён ёсць у Story або яго пашырэнні)
interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

interface StoriesListProps {
  stories: (StoryWithStatus | null | undefined)[]; // Выкарыстоўваем StoryWithStatus
  // ✅ 2. ПРАПС ДЛЯ АБНАЎЛЕННЯ ЗАКЛАДАК
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
    <div className="stories-list-grid">
           {' '}
      {stories.map((story, index) => {
        if (!story) {
          return null;
        }

        const key = story._id || index;

        return (
          <div key={key}>
                       {' '}
            {/* ✅ 3. ВЫКАРЫСТОЎВАЕМ TravellersStoriesItem ДЛЯ АДЛЮСТРАВАННЯ */}
                       {' '}
            <TravellersStoriesItem
              story={story as StoryWithStatus}
              onToggleSuccess={onToggleSuccess}
            />
                     {' '}
          </div>
        );
      })}
         {' '}
    </div>
  );
};

export default StoriesList;
