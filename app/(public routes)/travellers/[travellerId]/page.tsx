// app/(public routes)/travelers/[travellerId]/page.tsx
import React from 'react';
import Image from 'next/image';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';

interface TravellerPageProps {
  params: Promise<{ travellerId: string }>;
}

export default async function TravellerProfilePage({
  params,
}: TravellerPageProps) {
  const { travellerId } = await params;

  if (!travellerId) {
    notFound();
  }

  const traveller = await getTravellerById(travellerId);

  if (!traveller) {
    notFound();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Профіль Мандрівніка: {traveller.name}</h1>

      {traveller.avatarUrl && (
        <Image
          src={traveller.avatarUrl}
          alt={traveller.name}
          width={150}
          height={150}
          style={{ borderRadius: '50%' }}
        />
      )}

      {traveller.description && <p>{traveller.description}</p>}

      {typeof traveller._id !== 'undefined' && <p>ID: {traveller._id}</p>}
    </div>
  );
}
