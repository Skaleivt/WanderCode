// app/(public routes)/stories/[storyId]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';
import type { DetailedStory } from '@/types/story';

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

// 🛑 ВЫПРАЎЛЕННЕ: Выкарыстоўваем 'any' для аргумента generateMetadata
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any): Promise<Metadata> {
  // Прывядзенне тыпу для бяспечнай працы ўнутры функцыі
  const { params } = props as PageProps;

  const storyId = params.storyId?.trim();

  if (!storyId) {
    return {
      title: 'Сторінка не знайдена | WanderCode',
    };
  }

  let story: DetailedStory;
  try {
    story = await fetchStoryByIdServer(storyId);
  } catch {
    return {
      title: 'Історія не знайдена | WanderCode',
      description: 'Вибачте, запитана історія подорожі не знайдена.',
    };
  }

  // ... (астатні код generateMetadata)
  const fullTitle = `${story.title} | Історія від ${story.owner.name} | WanderCode`;
  const canonicalUrl = `https://wander-code.vercel.app/stories/${storyId}`;

  return {
    title: fullTitle,
    description: story.article,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: story.article,
      url: canonicalUrl,
      siteName: 'WanderCode',
      type: 'article',
      images: [
        {
          url: story.img,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function StoryPage(props: any) {
  // Прывядзенне тыпу для бяспечнай працы ўнутры функцыі
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
  } catch {
    return notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <StoryDetailsClient storyId={storyId} />
            <PopularSection />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  );
}
