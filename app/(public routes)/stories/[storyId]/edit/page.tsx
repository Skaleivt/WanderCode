import EditStoryForm from '@/components/EditStoryForm/EditStoryForm';

export default function EditStoryPage({ params }: { params: { storyId: string } }) {
  return <EditStoryForm storyId={params.storyId} />;
}