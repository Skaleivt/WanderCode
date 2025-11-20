export const dynamic = 'force-dynamic';
import Container from '@/components/Container/Container';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
// import StoriesList from '@/components/StoriesList/StoriesList';
import TravellerInfo from '@/components/Travellers/TravellerInfo/TravellerInfo';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import css from './ProfilePage.module.css';

import {
  fetchAllStoriesServer,
  fetchOwnStories,
  getMeServer,
} from '@/lib/api/serverApi';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoriesListWrapper from './ProfilePage.client';
import { User } from '@/types/user';
import { toast } from 'react-toastify';

type PageProps = {
  params: Promise<{ pageType: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { pageType } = await params;

  if (!pageType) {
    notFound();
  }

  const userResponse = await getMeServer(pageType);

  if (!userResponse || !userResponse.data) {
    toast.error('Користувач не знайдений');
    return;
  }

  const user: User = userResponse.data;
  const filter = user._id;
  const stories = await fetchAllStoriesServer({ filter });

  const ownStories =
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
  const isStories = ownStories.data.totalItems > 0;

  const savedStories = await fetchOwnStories();

  console.log('saved stories', savedStories.stories);

  const isMyStories = savedStories.totalItems > 0;

  return (
    <Container>
      <TravellerInfo traveller={user} />
      <div>
        <ul className={css.btnContainer}>
          <li className={pageType === 'saved' ? css.active : ''}>
            <Link href="/profile/saved" aria-disabled={pageType === 'saved'}>
              Збережені історії
            </Link>
          </li>
          <li className={pageType === 'own' ? css.active : ''}>
            <Link href="/profile/own" aria-disabled={pageType === 'own'}>
              Мої історії
            </Link>
          </li>
        </ul>
      </div>
      {pageType === 'saved' ? (
        <div>
          {isMyStories ? (
            <StoriesListWrapper initialStories={savedStories.stories} />
          ) : (
            <MessageNoStories
              text={
                'У вас ще немає збережених історій, мершій збережіть вашу першу історію!'
              }
              buttonText={'До історій'}
            />
          )}
        </div>
      ) : (
        <div>
          {isStories ? (
            <TravellersStories initialStories={ownStories} filter={filter} />
          ) : (
            <MessageNoStories
              text={
                'Ви ще нічого не публікували, поділіться своєю першою історією!'
              }
              buttonText={'Опублікувати історію'}
            />
          )}
        </div>
      )}
    </Container>
  );
}
