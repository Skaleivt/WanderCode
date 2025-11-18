import React from 'react';
import { getTravellerById } from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';

import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ storyId: string }>;
}

interface TravellerProfileData {
  _id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const travellerId = resolvedParams.storyId?.trim();

  if (!travellerId) {
    return {};
  }

  try {
    const traveller: TravellerProfileData | null =
      await getTravellerById(travellerId);

    if (!traveller) {
      return { title: 'Профіль не знайдено | Wander Code' };
    }

    const title = `${traveller.name} — Історії та Профіль Мандрівника | Wander Code`;
    const description =
      traveller.description ||
      `Перегляньте профіль мандрівника ${traveller.name} та його унікальні історії подорожей на Wander Code.`;

    return {
      title: title,
      description: description,
      keywords: [
        'профіль мандрівника',
        traveller.name,
        'історії подорожей',
        'автор блогу',
        'Wander Code',
      ],
      openGraph: {
        title: title,
        description: description,
        url: `https://wander-code.vercel.app/travellers/${travellerId}`,
        siteName: 'Wander Code',
        images: traveller.avatarUrl
          ? [
              {
                url: traveller.avatarUrl,
                width: 400,
                height: 400,
                alt: traveller.name,
              },
            ]
          : [],
        type: 'article',
      },
    };
  } catch {
    return { title: 'Профіль | WanderCode' };
  }
}

export default async function TravellerProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const travellerId = resolvedParams.storyId?.trim();

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
