import EditStoryForm from '@/components/EditStoryForm/EditStoryForm';

export default function EditStoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const resolvedParams = params;
  const storyId = resolvedParams.storyId?.trim();
  return <EditStoryForm storyId={storyId} />;
}
