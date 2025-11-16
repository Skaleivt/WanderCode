'use client';

import { useState } from 'react';
import css from './PopularSection.module.css';
import { StoriesResponse } from '@/types/story';
import TravelersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

type PopularClientProps = {
  initialData: StoriesResponse;
};

export default function PopularSectionClient({
  initialData
}: PopularClientProps) {
  const [stories] = useState(initialData.data.data ?? []);
  
  return (
    <section className={css.section}>
      <h2 className={css.title}>Популярні історії</h2> 
      <ul className={css.list}>
        {stories.map((story) => (
          <li className={css.listItem} key={story._id}>
            <TravelersStoriesItem story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
}
