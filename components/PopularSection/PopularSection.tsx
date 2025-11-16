import { fetchAllStoriesServer } from '@/lib/api/serverApi';
import PopularSectionClient from './PopularSection.client';

type PopularSectionProps = {
  page?: number;
  perPage?: number;
  sortOrder?: string;
  sortField?: string;
};

export default async function PopularSection({
  page = 1,
  perPage = 3,
  sortField = 'favoriteCount',
  sortOrder = 'desc',
}: PopularSectionProps) {

  const initialData = await fetchAllStoriesServer({
    page,
    perPage,
    sortField,
    sortOrder,
  });

  return (
    <PopularSectionClient initialData={initialData} />
  );
}
