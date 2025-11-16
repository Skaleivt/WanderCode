// app/(public routes)/stories/page.tsx

import type { Metadata } from 'next';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { Suspense } from 'react';
import Loader from '@/components/Loader/Loader';

// 💡 Import the new filter component
import StoriesFilterControls from '@/components/Stories/StoriesFilterControls';

import styles from './StoriesPage.module.css';

export const metadata: Metadata = {
  title: 'Історії Мандрівників | Подорожники',
  description:
    'Надихаючі історії мандрівників з усього світу: Європа, Азія, гори, пустелі та океани. Читайте досвід інших та плануйте власні пригоди.',
};

const StoriesPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.heading}>Історії Мандрівників</h1>

            {/* 💡 Replaced old filter markup with the new Client Component */}
            <StoriesFilterControls />
          </header>

          <TanStackProvider>
            <Suspense fallback={<Loader />}>
              <TravellersStories />
            </Suspense>
          </TanStackProvider>
        </div>
      </section>
    </main>
  );
};

export default StoriesPage;
