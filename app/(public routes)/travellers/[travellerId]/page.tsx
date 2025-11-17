import React from 'react';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
// import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';

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

  const filter = travellerId;
  const traveller = await getTravellerById(travellerId);
  const stories = await fetchAllStoriesServer({ filter });
  const isStories = stories && stories.data && stories.data.totalItems > 0;
  console.log('stories', stories);

  if (!traveller) {
    notFound();
  }

  return (
    <Container>
      <div className={css.profile}>
        <TravellersInfo traveller={traveller} />
        <h2 className={css.title}>Історії Мандрівника</h2>
        {isStories ? (
          <div>Є історії</div> // замінити на TravellersStories
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
