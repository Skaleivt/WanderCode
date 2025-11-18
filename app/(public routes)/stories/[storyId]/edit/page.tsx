import EditStoryForm from '@/components/EditStoryForm/EditStoryForm';

type EditStoryPageProps = {
  params: Promise<{ storyId: string }>;
};

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { storyId } = await params;   

  return <EditStoryForm storyId={storyId} />;
}

