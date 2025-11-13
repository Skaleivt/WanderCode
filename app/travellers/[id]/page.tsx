// app/travellers/[id]/page.tsx

import React from 'react';
import Image from 'next/image';
import { getTravellerById } from '@/lib/api/travellersApi';

interface TravellerProfilePageProps {
  params: {
    id: string;
  };
}

const TravellerProfilePage = async (props: TravellerProfilePageProps) => {
  const { id: travellerId } = await props.params;

  const traveller = await getTravellerById(travellerId);

  if (!traveller) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Мандрівника не знайдено 😔</h1>
        <p>На жаль, профіль з ID: {travellerId} не існує.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Профіль Мандрівника: {traveller.name}</h1>

      {traveller.avatarUrl && (
        <Image
          src={traveller.avatarUrl}
          alt={traveller.name}
          width={150}
          height={150}
          style={{ borderRadius: '50%' }}
        />
      )}

      {traveller.description && <p>Опис: {traveller.description}</p>}
      {traveller.articlesAmount !== undefined && (
        <p>Кількість історій: {traveller.articlesAmount}</p>
      )}
    </div>
  );
};

export default TravellerProfilePage;
