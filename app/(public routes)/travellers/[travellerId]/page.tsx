import React from 'react';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
// ✅ ВЫПРАЎЛЕННЕ ESLint: Выдалены невыкарыстоўваны імпарт TravellersStoriesProps
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';

// Use unknown for props and await params to satisfy Next.js runtime requirement
export default async function TravellerProfilePage(props: unknown) {
  // Await params — works whether params is a Promise or a plain object
  const params = await (props as { params?: { travellerId?: string } })?.params;
  const travellerId = params?.travellerId;

  if (!travellerId) {
    return notFound();
  }

  const filter = travellerId;
  const traveller = await getTravellerById(travellerId);
  const stories = await fetchAllStoriesServer({ filter });
  const safeStories =
    stories && stories.data
      ? stories
      : {
          data: {
            items: [],
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
  console.log('stories', safeStories);

  if (!traveller) {
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
