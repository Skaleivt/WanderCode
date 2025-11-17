// app/(public routes)/stories/[storyId]/page.tsx
import { fetchStoryById } from '@/lib/api/clientApi';
import { StoryDetailsClient } from './routesStory.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import PopularSection from '@/components/PopularSection/PopularSection';
import { notFound } from 'next/navigation';

export default async function StoryPage(props: unknown) {
  const params = await (props as { params?: { storyId?: string } })?.params;
  const storyId = params?.storyId;

  if (!storyId) {
    return notFound();
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetchStoryById(storyId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryDetailsClient storyId={storyId} />
      <PopularSection />
    </HydrationBoundary>
  );
}
