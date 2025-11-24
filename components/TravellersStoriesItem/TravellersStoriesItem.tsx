// components/TravellersStoriesItem/TravellersStoriesItem.tsx
'use client';

import Link from 'next/link';

import Image from 'next/image';

import { Story } from '@/types/story';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './TravellersStoriesItem.module.css';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { showErrorToast } from '../ShowErrorToast/ShowErrorToast';
import { addStoryToSaved, removeStoryFromSaved } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';

export type ProfileProps = {
  avatarUrl?: string;
  name?: string;
  description?: string;
};

type TravellersStoriesItemProps = {
  story: Story;
};

export default function TravellersStoriesItem({
  story,
}: TravellersStoriesItemProps) {
  const { isAuthenticated, user } = useAuthStore();

  const date = new Date(story.date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const [saved, setSaved] = useState(false);
  // перевірка користувача
  useEffect(() => {
    if (isAuthenticated && user) {
      setSaved(user.selectedStories?.includes(story._id) ?? false);
    }
  }, [isAuthenticated, user, story._id]);

  const toggleSaveMutation = useMutation({
    mutationFn: async ({
      storyId,
      isSaved,
    }: {
      storyId: string;
      isSaved: boolean;
    }) => {
      if (isSaved) {
        return await removeStoryFromSaved(storyId);
      } else {
        return await addStoryToSaved(storyId);
      }
    },
    onSuccess: () => {
      setSaved((prev) => !prev);
    },
    onError: () => {
      showErrorToast('Щось пішло не так');
    },
  });
  const router = useRouter();

  const goToRegister = () => {
    router.push('/auth/login');
  };

  return (
    <article className={styles.card}>
      <Link href={`/stories/${story._id}`} className={styles.imageLink}>
        <Image
          src={story.img}
          alt={story.title}
          width={800}
          height={320}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <span className={styles.categoryBadge}>{story.category.name}</span>
        <header>
          <Link href={`/stories/${story._id}`}>
            <h3 className={styles.title}>{story.title}</h3>
          </Link>
        </header>
        <p className={styles.description}>{story.article}</p>

        <div className={styles.authorMetaBlock}>
          <Image
            src={story.ownerId.avatarUrl || '/default-avatar.png'}
            alt={story.ownerId.name || 'avatar'}
            width={40}
            height={40}
            className={styles.authorAvatar}
          />
          <div className={styles.authorInfoWrapper}>
            <span className={styles.authorName}>
              {story.ownerId.name || 'Невідомий автор'}
            </span>
            <div className={styles.dateAndBookmarks}>
              <span className={styles.publishedDate}>{date}</span>
              <span className={styles.point}>•</span>
              <span className={styles.bookmarks}>
                <span className={styles.bookmarksCount}>
                  {story.favoriteCount || 0}
                </span>
                <svg className={styles.bookmarksCountIcon}>
                  <use href="/symbol-defs.svg#icon-bookmark"></use>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/stories/${story._id}`} className={styles.viewButton}>
            Переглянути статтю
          </Link>

          <button
            className={saved ? styles.bookmarkBtnSave : styles.bookmarkBtn}
            onClick={() => {
              if (!isAuthenticated) {
                goToRegister();
              } else {
                toggleSaveMutation.mutate({
                  storyId: story._id,
                  isSaved: saved,
                });
              }
            }}
          >
            <svg
              className={
                saved
                  ? styles.bookmarksSavedIconSave
                  : styles.bookmarksSavedIcon
              }
            >
              <use href="/symbol-defs.svg#icon-bookmark"></use>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
