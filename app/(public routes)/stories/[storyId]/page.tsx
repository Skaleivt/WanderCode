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
  params: Promise<{ storyId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const storyId = awaitedParams.storyId?.trim();

  if (!storyId) {
    return {
      title: 'Сторінка не знайдена | WanderCode',
    };
  }

  let story: DetailedStory | null = null;
  try {
    story = await fetchStoryByIdServer(storyId);
  } catch {
    return {
      title: 'Історія не знайдена | WanderCode',
      description: 'Вибачте, запитана історія подорожі не знайдена.',
    };
  }

  if (!story) {
    return {
      title: 'Історія не знайдена | WanderCode',
    };
  }

  const ownerName = story.owner?.name ?? 'Невідомий автор';
  const storyTitle = story.title ?? 'Історія без назви';
  const articleExcerpt =
    typeof story.article === 'string' && story.article.length
      ? story.article
      : undefined;

  const fullTitle = `${storyTitle} | Історія від ${ownerName} | WanderCode`;
  const canonicalUrl = `https://wander-code.vercel.app/stories/${storyId}`;

  const images =
    story.img && typeof story.img === 'string' && story.img.length
      ? [
          {
            url: story.img,
            width: 1200,
            height: 630,
            alt: storyTitle,
          },
        ]
      : undefined;

  return {
    title: fullTitle,
    description: articleExcerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: articleExcerpt,
      url: canonicalUrl,
      siteName: 'WanderCode',
      type: 'article',
      images,
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const awaitedParams = await params;
  const storyId = awaitedParams.storyId?.trim();

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
