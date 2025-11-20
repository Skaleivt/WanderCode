// app/(private routes)/stories/edit/[storyId]/page.tsx

import EditStoryForm from '@/components/EditStoryForm/EditStoryForm';
import { notFound } from 'next/navigation';

interface EditStoryPageProps {
  params: {
    storyId: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditStoryPage(props: any) {
  const { params } = props as EditStoryPageProps;

  const storyId = params.storyId?.trim();

  if (!storyId) {
    return notFound();
  }

  return <EditStoryForm storyId={storyId} />;
}
