// app/travellers/page.tsx
'use client';
import { Suspense } from 'react';
import TravellersList from '@/components/Travellers/TravellersList/TravellersList';
import Loader from '@/components/Loader/Loader';
import styles from './TravellersPage.module.css';

const TravellersPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <p className={styles.title}>Мандрівники</p>
      <Suspense fallback={<Loader />}>
        <TravellersList />
      </Suspense>
    </div>
  );
};

export default TravellersPage;
