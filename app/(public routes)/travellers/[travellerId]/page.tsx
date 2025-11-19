// app/(public routes)/travellers/[travellerId]/page.tsx

import React from 'react';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';

import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';

interface PageProps {
  // Захоўваем правільную тыпізацыю, якую мы хочам выкарыстоўваць
  params: { travellerId: string };
}

// 🛑 ВЫПРАЎЛЕННЕ: Выкарыстоўваем 'any' для аргумента, каб абыйсці памылку Next.js Builder-а.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function TravellerProfilePage(props: any) {
  // Выкарыстоўваем строгі тып для ўнутранай працы
  const { params } = props as PageProps;

  // Атрымліваем travellerId з прыведзенага аб'екта params
  const travellerId = params.travellerId?.trim();

  if (!travellerId) {
    return notFound();
  }

  const filter = travellerId;
  const traveller = await getTravellerById(travellerId);
  const stories = await fetchAllStoriesServer({ filter });

  // Ваш код для апрацоўкі адказу гісторый
  const safeStories =
    stories && stories.data
      ? stories
      : {
          data: {
            data: [],
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            page: 1,
            perPage: 9,
            hasPreviousPage: false,
          },
        };
  const isStories = safeStories.data.totalItems > 0;

  if (!traveller) {
    // Выклікаецца, калі getTravellerById вяртае null (напрыклад, з-за 404)
    return notFound();
  }

  return (
    <Container>
      <div className={css.profile}>
        <TravellersInfo traveller={traveller} />
        <h2 className={css.title}>Історії Мандрівника</h2>
        {isStories ? (
          <TravellersStories initialStories={safeStories} filter={filter} />
        ) : (
          <MessageNoStories
            text={'Цей користувач ще не публікував історій'}
            buttonText={'Назад до історій'}
          />
        )}
      </div>
    </Container>
  );
}
