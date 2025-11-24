export const dynamic = 'force-dynamic';
import Container from '@/components/Container/Container';
import TravellerInfo from '@/components/Travellers/TravellerInfo/TravellerInfo';
import css from './ProfilePage.module.css';
import { getMeServer } from '@/lib/api/serverApi';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User } from '@/types/user';
import { toast } from 'react-toastify';
import ProfileOwnPage from './ProfileOwnPage.client';
import ProfileSavedPage from './ProfileSavedPage.client';

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

  return (
    <Container>
      <div className={css.profile}>
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
          <ProfileSavedPage />
        ) : (
          <ProfileOwnPage filter={filter} />
        )}
      </div>
    </Container>
  );
}
