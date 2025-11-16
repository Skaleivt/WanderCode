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
    return <h1>Помилка: Story ID не передано</h1>;
  }

  return (
    <div>
      <h1>Сторінка історії</h1>
      <p>ID історії: {storyId}</p>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}
