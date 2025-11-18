// src/components/Stories/StoriesFilterControls.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// Імпартуем тып Category, каб ён працаваў з пропсам categories
import { Category } from '@/types/story';
import styles from './StoriesFilterControls.module.css';

interface StoriesFilterControlsProps {
  // Зробім неабавязковым, але лагічна: ён павінен быць перададзены
  categories?: Category[];
}

// ✅ ВЫПРАЎЛЕННЕ: Дадаем значэнне па змаўчанні [] для categories, каб пазбегнуць .map на undefined
const StoriesFilterControls = ({
  categories = [],
}: StoriesFilterControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Ствараем поўны спіс, аб'ядноўваючы 'Усе гісторыі' з дынамічнымі дадзенымі

  const FULL_CATEGORIES = [
    // 'all' будзе мець _id = 'all', бо гэта не ID катэгорыі
    { _id: 'all', name: 'Всі історії' }, // Пераўтвараем загружаныя катэгорыі (цяпер бяспечна, бо categories гарантавана з'яўляецца масівам)
    ...categories.map((cat) => ({ _id: cat._id, name: cat.name })),
  ]; // Атрымліваем бягучы актыўны фільтр з URL (цяпер чакаем ID або 'all')

  const activeFilter = searchParams.get('filter') || 'all'; // Handler to update the URL when filter changes

  const handleFilterChange = useCallback(
    (newValue: string) => {
      // Ствараем новы URLSearchParams
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newValue === 'all') {
        // Калі абрана 'all', выдаляем параметр 'filter'
        current.delete('filter');
      } else {
        // Цяпер newValue - гэта фактычны ID катэгорыі
        current.set('filter', newValue); // Скідаем пагінацыю пры змене фільтра
        current.delete('page');
      } // Канструюйце новы шлях

      const query = current.toString();
      const newPath = query ? `?${query}` : ''; // Пераходзім на новы URL

      router.push(`/stories${newPath}`);
    },
    [searchParams, router]
  );

  return (
    <>
      <div className={styles.filtersRow}>
        {FULL_CATEGORIES.map((cat) => (
          <button
            key={cat._id} // Выкарыстоўваем _id як ключ
            type="button"
            className={`${styles.filterBtn} ${
              activeFilter === cat._id ? styles.filterBtnActive : ''
            }`}
            onClick={() => handleFilterChange(cat._id)} // Перадаем _id для фільтрацыі
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
