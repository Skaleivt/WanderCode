// app/(public routes)/travellers/page.tsx

import React, { Suspense } from 'react';
import TravellersList from '@/components/Travellers/TravellersList/TravellersList';
import Loader from '@/components/Loader/Loader';
import Container from '@/components/Container/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Спільнота Мандрівників | WanderCode',
  description:
    'Знайомтесь із членами спільноти WanderCode. Знайдіть авторів, гідів та однодумців, які діляться своїми унікальними історіями подорожей та надихають на нові пригоди.',
  keywords: [
    'мандрівники',
    'спільнота',
    'автори подорожей',
    'туристи',
    'блогери',
    'профілі',
    'Wander Code',
  ],
  openGraph: {
    title: 'Спільнота WanderCode — Автори та Пригоди',
    description:
      'Тисячі активних мандрівників чекають на вас. Знайдіть нових друзів та обмінюйтесь досвідом!',
    url: '/wandercode.jpg',
    siteName: 'WanderCode',
    type: 'website',
  },
};

export default function TravellersPage() {
  return (
    <Container>
      <Suspense fallback={<Loader />}>
        <TravellersList />
      </Suspense>
    </Container>
  );
}
