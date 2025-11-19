import React from 'react';
import { Metadata } from 'next';
import {
  getTravellerById,
  getTravellerInfoById,
} from '@/lib/api/travellersApi';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';

type Props = {
  params: Promise<{ travellerId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { travellerId } = await params;
  const traveller = await getTravellerInfoById(travellerId);
  return {
    title: `Профіль Мандрівника: ${traveller.name}`,
    description: `Історії подорожей, фото та пригоди з усього світу.`,
    openGraph: {
      title: `Профіль Мандрівника: ${traveller.name}`,
      description: '',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/travelers/${travellerId}`,
      siteName: 'Подорожники',
      images: [
        {
          url: traveller.avatarUrl,
          width: 1200,
          height: 630,
          alt: `Профіль мандрівника ${traveller.name}`,
        },
      ],
    },
  };
}

interface TravellerPageProps {
  params: Promise<{ travellerId: string }>;
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';

interface PageProps {
  params: Promise<{ storyId: string }>;
}

export default async function TravellerProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const travellerId = resolvedParams.storyId?.trim();

  if (!travellerId) {
    return notFound();
  }
  
  const travellerInfo = await getTravellerInfoById(travellerId);

  const filter = travellerId;
  const traveller = await getTravellerById(travellerId);
  const stories = await fetchAllStoriesServer({ filter });
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
    return notFound();
  }

  return (
    <>
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
