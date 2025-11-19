// components/Travellers/TravellersSectionHome/TravellersSectionHome.tsx
import React from 'react';
import Link from 'next/link';
import { fetchTravellersServer } from '@/lib/api/travellersApi';
import TravellerCard from '../TravellerCard/TravellerCard';
import styles from './TravellersSectionHome.module.css';
import { Traveller } from '@/types/traveller';

const HOME_TRAVELLERS_COUNT = 4;

export default async function TravellersSectionHome() {
  try {
    const response = await fetchTravellersServer({
      page: 1,
      perPage: HOME_TRAVELLERS_COUNT,
    });
    const travellers = response.data || [];
    const hasMoreTravellers = response.hasNextPage;

    if (travellers.length === 0) {
      return (
        <p className={styles.empty}>Немає мандрівників для відображення.</p>
      );
    }

    return (
      <div className={styles.section}>
        <ul className={styles.list}>
          {travellers.map((traveller: Traveller) => (
            <TravellerCard
              key={traveller._id}
              traveller={
                { ...traveller, id: traveller._id } as Traveller & {
                  id: string;
                }
              }
            />
          ))}
        </ul>
        {hasMoreTravellers && (
          <Link href="/travellers" className={styles.loadMoreButton}>
            Переглянути всі
          </Link>
        )}
      </div>
    );
  } catch (error) {
    console.error(
      'SERVER ERROR: Failed to fetch travellers for homepage.',
      error
    );
    return <p className={styles.error}>Помилка завантаження мандрівників.</p>;
  }
}
