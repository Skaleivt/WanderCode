// app/(public routes)/stories/[storyId]/edit/page.tsx

import EditStoryForm from '@/components/EditStoryForm/EditStoryForm';
// Імпартуйце notFound, калі ён неабходны
// import { notFound } from 'next/navigation';

interface EditStoryPageProps {
  params: {
    storyId: string;
  };
}

export default async function EditStoryPage(
  props: unknown // NEXT.JS BUILDER FIX: Абыход памылкі з 'Promise<any>'
) {
  // Выкарыстоўваем строгі тып для ўнутранай працы
  const { params } = props as EditStoryPageProps;

  if (!params.storyId) {
    // return notFound();
  }

  return <EditStoryForm storyId={params.storyId} />;
}
