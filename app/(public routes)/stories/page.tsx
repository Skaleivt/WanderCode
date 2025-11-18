// app/(public routes)/stories/page.tsx

import React, { Suspense } from 'react';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import StoriesPageWrapper from '@/components/Stories/StoriesPageWrapper';

// 🛑 Выдалены ўсе імпарты, звязаныя з катэгорыямі:
// StoriesFilterControls, fetchCategories, CategoryResponse, Category

export default async function StoriesPage() {
  // 🛑 Выдалена ўся логіка загрузкі катэгорый
  return (
    <Container>
            <h1 className="main-title">Всі Історії</h1>           {' '}
      {/* 🛑 Выдалены выклік StoriesFilterControls */}           {' '}
      <Suspense fallback={<Loader />}>
                <StoriesPageWrapper />     {' '}
      </Suspense>
         {' '}
    </Container>
  );
}
