'use client';

import { useState } from 'react';
import css from './PopularSection.module.css';
import { StoriesResponse } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { useRouter } from 'next/navigation';

type PopularClientProps = {
  initialData: StoriesResponse;
};

export default function PopularSectionClient({
  initialData
}: PopularClientProps) {
  const router = useRouter();
  const [stories] = useState(initialData.data.data ?? []);

  const goToStories = (): void => {
      router.push('/stories');
  };
  
  return (
    <section className={css.section}>
      <h2 className={css.title}>Популярні історії</h2> 
      <ul className={css.list}>
        {stories.map((story) => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </ul>
      <button 
          onClick={goToStories}
          className={css.button} 
      >
          Переглянути всі
      </button>
    </section>
  );
}
