// app/(public routes)/stories/page.tsx

import React, { Suspense } from 'react';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import StoriesPageWrapper from '@/components/Stories/StoriesPageWrapper';

export default async function StoriesPage() {
  return (
    <Container>
      <h1 className="main-title">Всі Історії</h1>

      <Suspense fallback={<Loader />}>
        <StoriesPageWrapper />
      </Suspense>
    </Container>
  );
}
