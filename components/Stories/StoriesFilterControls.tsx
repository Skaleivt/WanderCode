// components/Stories/StoriesFilterControls.tsx (Абноўлены, адпраўляе ID)

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Category } from '@/types/story';
import styles from './StoriesFilterControls.module.css';

interface StoriesFilterControlsProps {
  categories?: Category[];
}

const StoriesFilterControls = ({
  categories = [],
}: StoriesFilterControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Выкарыстоўваем _id для адсочвання стану
  const FULL_CATEGORIES = [
    { _id: 'all', name: 'Всі історії' },
    ...categories.map((cat) => ({ _id: cat._id, name: cat.name })),
  ];

  // activeFilter = _id або 'all'
  const activeFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = useCallback(
    (newValue: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newValue === 'all') {
        // If 'all' is selected, remove the 'filter' parameter
        current.delete('filter');
      } else {
        // Set the category ID as the filter
        current.set('filter', newValue); // newValue - гэта ID
        // Reset pagination when filter changes
        current.delete('page');
      }

      const query = current.toString();
      const newPath = query ? `?${query}` : '';

      // Navigate to the new URL
      router.push(`/stories${newPath}`);
    },
    [searchParams, router]
  );

  return (
    <>
      <div className={styles.filtersRow}>
        {FULL_CATEGORIES.map((cat) => (
          <button
            key={cat._id}
            type="button"
            className={`${styles.filterBtn} ${
              activeFilter === cat._id ? styles.filterBtnActive : ''
            }`}
            onClick={() => handleFilterChange(cat._id)} // <-- Адпраўляем ID
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className={styles.filtersSelectWrapper}>
        <label htmlFor="stories-category" className={styles.selectLabel}>
          Категорії
        </label>

        <select
          id="stories-category"
          className={styles.select}
          value={activeFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          {FULL_CATEGORIES.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default StoriesFilterControls;
