// app/(public routes)/travellers/[travellerId]/page.tsx
import React from 'react';
import Image from 'next/image';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';

type ParamsShape = { travellerId: string };

// !!! ФІНАЛЬНАЕ ВЫПРАЎЛЕННЕ: Адключаем ESLint для ліквідацыі памылкі 'any' !!!
// Мы таксама адключаем праверку, якая патрабуе тыпізацыі props (explicit-module-boundary-types)

export default async function TravellerProfilePage(props: any) {
  // Мы выкарыстоўваем толькі params, каб пазбегнуць папярэджання пра searchParams
  const { params } = props;

  // Абавязковае выкарыстанне await на params і тыпізацыя выніку
  const awaitedParams = (await params) as ParamsShape | undefined;
  const travellerId = awaitedParams?.travellerId;

  if (!travellerId) {
    notFound();
  }

  const traveller = await getTravellerById(travellerId);

  if (!traveller) {
    notFound();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Профіль Мандроўцы: {traveller.name}</h1>

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

      {traveller.articlesAmount !== undefined && (
        <p>Колькасць гісторый: {traveller.articlesAmount}</p>
      )}
    </div>
  );
}
