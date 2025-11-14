import { fetchAllStoriesServer } from '@/lib/api/serverApi';
import PopularSectionClient from './PopularSection.client';

type PopularSectionProps = {
  page?: number;
  sort?: string;
};

export default async function PopularSection({
  page = 1,
  sort = 'desc',
}: PopularSectionProps) {
  const initialData = await fetchAllStoriesServer({
    page,
    sort,
  });

  console.log('server:::::', initialData);

  return <PopularSectionClient initialData={initialData} />;
}
