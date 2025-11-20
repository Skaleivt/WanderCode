import React from 'react';
import { Metadata } from 'next';
import {
  getTravellerById,
  getTravellerInfoById,
} from '@/lib/api/travellersApi';
import { notFound } from 'next/navigation';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { TravellersInfo } from '@/components/TravellersInfo/TravellersInfo';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchAllStoriesServer } from '@/lib/api/serverApi';

type Props = {
  params: { travellerId: string };
};
export const dynamic = 'force-dynamic';

// NOTE: Next.js may pass props.params as a Promise — await it before use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await (props?.params as
    | Props['params']
    | Promise<Props['params']>);
  const travellerId = (await params)?.travellerId?.trim?.();
  if (!travellerId) {
    return { title: `Мандрівник не знайдений` };
  }

  const traveller = await getTravellerInfoById(travellerId);
  if (!traveller) {
    return { title: `Мандрівник не знайдений` };
  }

  return {
    title: `Профіль Мандрівніка: ${traveller.name}`,
    description: `Історії подорожей, фото та пригоди з усього світу.`,
    openGraph: {
      title: `Профіль Мандрівніка: ${traveller.name}`,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function TravellerProfilePage(props: any) {
  const params = await (props?.params as
    | Props['params']
    | Promise<Props['params']>);
  const travellerId = (await params)?.travellerId?.trim?.();

  if (!travellerId) {
    return notFound();
  }

  const traveller = await getTravellerById(travellerId);
  if (!traveller) {
    return notFound();
  }

  const filter = travellerId;
  const storiesRes = await fetchAllStoriesServer({ filter });

  const safeStories = (() => {
    if (
      storiesRes &&
      typeof storiesRes === 'object' &&
      storiesRes.data &&
      Array.isArray(storiesRes.data.data)
    ) {
      const meta = storiesRes.data;
      const coercedMeta = {
        data: Array.isArray(meta.data) ? meta.data : [],
        totalItems: Number.isFinite(Number(meta.totalItems))
          ? Number(meta.totalItems)
          : 0,
        totalPages: Number.isFinite(Number(meta.totalPages))
          ? Number(meta.totalPages)
          : 0,
        currentPage: Number.isFinite(Number(meta.currentPage))
          ? Number(meta.currentPage)
          : 1,
        page: Number.isFinite(Number(meta.page)) ? Number(meta.page) : 1,
        perPage: Number.isFinite(Number(meta.perPage))
          ? Number(meta.perPage)
          : (meta.perPage ?? 9),
        hasNextPage: !!meta.hasNextPage,
        hasPreviousPage: !!meta.hasPreviousPage,
      };
      return { data: coercedMeta };
    }

    return {
      data: {
        data: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        perPage: 9,
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
      },
    };
  })();

  const isStories = safeStories.data.totalItems > 0;

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
