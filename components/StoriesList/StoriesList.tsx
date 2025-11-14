// components/StoriesList/StoriesList.tsx
import React from 'react';

// Улічваючы, што ён утрымлівае спіс гісторый, нам спатрэбіцца тып Story.
// Калі ласка, праверце шлях да вашага Story:
import { Story } from '@/types/story';

// Мяркуем, што кампанент прымае масіў гісторый
interface StoriesListProps {
  stories: Story[];
}

export default function StoriesList({ stories }: StoriesListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Спіс Гісторый (Заглушка)</h2>

      {/* Апцыянальна: Заглушка рэндэрынгу, калі StoriesList адлюстроўвае TravellersStoriesItem */}
      {/*
            {stories.length > 0 ? (
                stories.map(story => (
                    // !!! УВАГА: Праверце, ці патрабуецца тут TravellersStoriesItem, і выпраўце імпарт
                    <div key={story._id} style={{ border: '1px dotted grey', padding: '10px' }}>
                        {story.title}
                    </div>
                ))
            ) : (
                <p>Гісторый няма.</p>
            )}
            */}

      {/* Мінімум, каб прайсці зборку */}
      <p>Усяго гісторый: {stories.length}</p>
    </div>
  );
}
