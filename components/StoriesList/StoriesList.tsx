// components/StoriesList/StoriesList.tsx (ВЫПРАЎЛЕНЫ)
import React from 'react';
import { Story } from '@/types/story';

interface StoriesListProps {
  stories: (Story | null | undefined)[];
}

const StoriesList: React.FC<StoriesListProps> = ({ stories }) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="stories-list-grid">
      {stories.map((story, index) => {
        if (!story) {
          return null;
        }

        const key = story._id || index;

        return (
          <div key={key}>
            <h3>{story.title}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default StoriesList;
