// app/(public routes)/travellers/page.tsx

import React, { Suspense } from 'react';
import TravellersList from '@/components/Travellers/TravellersList/TravellersList';
import Loader from '@/components/Loader/Loader';
import Container from '@/components/Container/Container';

export default function TravellersPage() {
  return (
    <Container>
      <Suspense fallback={<Loader />}>
        <TravellersList />
      </Suspense>
    </Container>
  );
}
