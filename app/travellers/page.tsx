// app/travellers/page.tsx
import { Suspense } from 'react';
import TravellersList from '@/components/Travellers/TravellersList/TravellersList';
import Loader from '@/components/Loader/Loader';

const TravellersPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <TravellersList />
    </Suspense>
  );
};

export default TravellersPage;
