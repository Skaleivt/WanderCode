import { notFound } from 'next/navigation';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoryDetailsClient } from './StoryDetailsClient';
import PopularSection from '@/components/PopularSection/PopularSection';
import { Metadata } from 'next';
import { DetailedStory } from '@/types/story';

interface PageProps {
  params: Promise<{ storyId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const storyId = resolvedParams.storyId?.trim();

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

export default async function StoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const storyId = resolvedParams.storyId?.trim();

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryDetailsClient storyId={storyId} />
      <PopularSection />
    </HydrationBoundary>
  );
}
