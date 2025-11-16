// app/(public routes)/stories/[storyId]/page.tsx

import React from 'react';

type StoryParams = {
  storyId: string;
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface StoryPageProps {
  params: Promise<StoryParams>;
  searchParams?: Promise<SearchParams>;
}

export default async function StoryDetailPage(props: StoryPageProps) {
  const { storyId } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};

  if (!storyId) {
    return <h1>Памылка: Story ID не перададзены</h1>;
  }

  return (
    <div>
      <h1>Старонка гісторыі</h1>
      <p>Ідэнтыфікатар гісторыі: {storyId}</p>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}
