import { notFound } from 'next/navigation';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoryDetailsClient } from './StoryDetailsClient';
import PopularSection from '@/components/PopularSection/PopularSection';
import mongoose from 'mongoose';

type StoryPageProps = {
  params?: {
    storyId?: string;
  };
};

export default async function StoryPage({ params }: StoryPageProps) {
  const storyId = params?.storyId?.trim();

  // Перевірка валідності MongoDB ObjectId
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    return notFound();
  }

  const queryClient = new QueryClient();
  try {
    // Prefetch story для SSR
    await queryClient.prefetchQuery({
      queryKey: ['story', storyId],
      queryFn: () => fetchStoryByIdServer(storyId),
    });
  } catch {
    // Якщо story не знайдено на сервері
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryDetailsClient storyId={storyId} />
      <PopularSection />
    </HydrationBoundary>
  );
}
