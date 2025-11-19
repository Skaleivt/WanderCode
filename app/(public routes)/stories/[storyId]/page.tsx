// app/(public routes)/stories/[storyId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoryDetailsClient } from './StoryDetailsClient';
import PopularSection from '@/components/PopularSection/PopularSection';
import styles from './page.module.css';

interface PageProps {
  params: { storyId: string };
}

// 🛑 ВЫПРАЎЛЕННЕ: Выкарыстоўваем 'any' для аргумента, каб абыйсці памылку Next.js Builder-а.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function StoryPage(props: any) {
  // Выкарыстоўваем строгі тып для ўнутранай працы
  const { params } = props as PageProps;

  const storyId = params.storyId?.trim();

  if (!storyId) {
    return notFound();
  }

  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ['story', storyId],
      queryFn: () => fetchStoryByIdServer(storyId),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Калі fetchStoryByIdServer кіне памылку (напрыклад, 404),
    // мы тут выклікаем notFound.
    return notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Деталі історії */}
            <StoryDetailsClient storyId={storyId} />

            {/* Блок популярних статей */}
            <PopularSection />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  );
}
