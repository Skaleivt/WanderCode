import { notFound } from 'next/navigation';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { StoryDetailsClient } from './StoryDetailsClient';
import PopularSection from '@/components/PopularSection/PopularSection';

interface PageProps {
  params: Promise<{ storyId: string }>;
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
