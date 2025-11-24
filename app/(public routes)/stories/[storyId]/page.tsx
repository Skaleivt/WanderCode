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
import { Container } from '@/components/Container/Container';

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
      description: 'Вибачте, запитана історія подорожі не знайдена.',
    };
  }

  // Безпечні звернення до owner та img — використовуємо optional chaining і fallback
  const ownerName =
    story.owner?.name ?? story.ownerId?.name ?? 'Автор невідомий';
  const titleText = story.title ?? 'Історія';
  const descriptionText =
    typeof story.article === 'string' && story.article.length > 0
      ? story.article
      : 'Історія подорожі';

  const fullTitle = `${titleText} | Історія від ${ownerName} | WanderCode`;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wander-code.vercel.app';
  const canonicalUrl = `${base.replace(/\/$/, '')}/stories/${storyId}`;

  const ogImages = [];
  if (story.img && typeof story.img === 'string') {
    ogImages.push({
      url: story.img,
      width: 1200,
      height: 630,
      alt: titleText,
    });
  }

  return {
    title: fullTitle,
    description: descriptionText,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: descriptionText,
      url: canonicalUrl,
      siteName: 'WanderCode',
      type: 'article',
      images: ogImages,
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
    <Container>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <StoryDetailsClient storyId={storyId} />
              <PopularSection />
            </HydrationBoundary>
          </div>
        </section>
      </div>
    </Container>
  );
}
