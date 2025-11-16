// app/(public routes)/travelers/page.tsx

import React, { Suspense } from 'react';
import TravellersList from '@/components/Travellers/TravellersList/TravellersList';
import Loader from '@/components/Loader/Loader';

export default function TravellersPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Мандрівники</h1>

      <Suspense fallback={<Loader />}>
        <TravellersList />
      </Suspense>
    </main>
  );
}
