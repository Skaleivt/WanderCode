// src/components/Stories/StoriesFilterControls.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './StoriesFilterControls.module.css';
import { useCallback } from 'react';

// 1. Static list of categories (Matching the backend 'category' field)
const CATEGORIES = [
  { label: 'Всі історії', value: 'all' },
  { label: 'Європа', value: 'europe' },
  { label: 'Азія', value: 'asia' },
  { label: 'Гори', value: 'mountains' },
  { label: 'Море', value: 'sea' },
];

const StoriesFilterControls = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current active filter from the URL, default to 'all'
  const activeFilter = searchParams.get('filter') || 'all';

  // 2. Handler to update the URL when filter changes
  const handleFilterChange = useCallback(
    (newValue: string) => {
      // Create a new URLSearchParams object based on current params
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newValue === 'all') {
        // If 'all' is selected, remove the 'filter' parameter
        current.delete('filter');
      } else {
        // Set the new filter value
        current.set('filter', newValue);
        // Reset page to 1 whenever the filter changes (optional but recommended)
        current.delete('page');
      }

      // Construct the new URL path
      const query = current.toString();
      const newPath = query ? `?${query}` : '';

      // Navigate to the new URL
      router.push(`/stories${newPath}`);
    },
    [searchParams, router]
  );

  return (
    <>
      {/* Filter buttons row (Tablet/Desktop) */}
      <div className={styles.filtersRow}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`${styles.filterBtn} ${
              activeFilter === cat.value ? styles.filterBtnActive : ''
            }`}
            onClick={() => handleFilterChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Select dropdown (Mobile) */}
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
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default StoriesFilterControls;
