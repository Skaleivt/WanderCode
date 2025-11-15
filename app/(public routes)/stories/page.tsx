import { fetchStoryById } from '@/lib/api/clientApi';
import { StoryDetailsClient } from './[storyId]/routesStory.client.jsx';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import PopularSection from '@/components/PopularSection/PopularSection';

type Props = {
  params: { storyId: string };
};

export default async function StoryPage({ params }: Props) {
  const { storyId } = params;

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
