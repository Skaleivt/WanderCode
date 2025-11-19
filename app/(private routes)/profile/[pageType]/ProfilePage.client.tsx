// components/StoriesListWrapper.tsx
'use client';

import StoriesList, {
  StoryWithStatus,
} from '@/components/StoriesList/StoriesList';
import { useState } from 'react';

interface Props {
  initialStories: StoryWithStatus[];
}

export default function StoriesListWrapper({ initialStories }: Props) {
  const [stories, setStories] = useState(initialStories);

  console.log('client', initialStories, stories);

  const handleToggleFavorite = (storyId: string, isAdding: boolean) => {
    setStories((prev) =>
      prev.map((story) =>
        story._id === storyId ? { ...story, isFavorite: isAdding } : story
      )
    );
  };

  return (
    <StoriesList stories={stories} onToggleSuccess={handleToggleFavorite} />
  );
}
