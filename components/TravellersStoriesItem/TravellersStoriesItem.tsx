// components/TravellersStoriesItem/TravellersStoriesItem.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  CalendarDays,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';

import { Story } from '@/types/story';
import { toggleStoryBookmark } from '@/lib/api/storyApi';
import { useAuthStore } from '@/lib/store/authStore';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import styles from './TravellersStoriesItem.module.css';

interface StoryWithStatus extends Story {
  isFavorite: boolean;
}

type TravellersStoriesItemProps = {
  story: StoryWithStatus;
  onToggleSuccess: (storyId: string, isAdding: boolean) => void;
};

interface MutationContext {
  currentSaved: boolean;
}

const TravellersStoriesItem = ({
  story,
  onToggleSuccess,
}: TravellersStoriesItemProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const storyId = story._id;
  const imageUrl = story.img;
  const category = story.category;
  const title = story.title;
  const description = story.article;
  const authorName = 'Unknown author';
  const authorAvatar = '/file.svg';
  const publishedAt = story.date;
  const initialBookmarksCount = story.favoriteCount ?? 0;
  const initiallySaved = story.isFavorite;

  const [saved, setSaved] = useState<boolean>(initiallySaved);
  const [bookmarks, setBookmarks] = useState<number>(initialBookmarksCount);

  const dateStr = useMemo(() => {
    const d = new Date(publishedAt);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }, [publishedAt]);

  const { mutate: handleToggleBookmark, isPending } = useMutation<
    unknown,
    unknown,
    boolean,
    MutationContext
  >({
    mutationFn: (currentSavedState: boolean) =>
      toggleStoryBookmark(storyId, currentSavedState),
    onMutate: async () => {
      const currentSaved = saved;
      setSaved((prev) => !prev);
      setBookmarks((prev) => (currentSaved ? Math.max(0, prev - 1) : prev + 1));
      return { currentSaved };
    },
    onError: (error: unknown, variables, context) => {
      showErrorToast(
        error instanceof Error
          ? error.message
          : 'Сталася помилка. Спробуйте ще раз.'
      );
      const operationWasDelete = context?.currentSaved;

      setSaved((prev) => !prev);
      setBookmarks((prev) =>
        operationWasDelete ? prev + 1 : Math.max(0, prev - 1)
      );
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      const wasSavedBefore = context?.currentSaved;
      onToggleSuccess(storyId, !wasSavedBefore);
    },
  });

  const onBookmarkClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    handleToggleBookmark(saved);
  };

  return (
    <article className={styles.card}>
      <Link href={`/stories/${storyId}`} className={styles.imageLink}>
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={320}
          className={styles.image}
        />
        <span className={styles.categoryBadge}>{category}</span>
      </Link>

      <div className={styles.content}>
        <header>
          <Link href={`/stories/${storyId}`}>
            <h3 className={styles.title}>{title}</h3>
          </Link>
        </header>

        <p className={styles.description}>{description}</p>

        <div className={styles.meta}>
          <Image
            src={authorAvatar}
            alt={authorName}
            width={32}
            height={32}
            className={styles.authorAvatar}
          />
          <span className={styles.metaInfo}>
            <UserRound className="h-4 w-4" />
            {authorName}
          </span>
          <span className={styles.metaInfo}>
            <CalendarDays className="h-4 w-4" />
            {dateStr}
          </span>
          <span className={styles.bookmarks}>
            {saved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
            <span className={styles.bookmarksCount}>{bookmarks}</span>
          </span>
        </div>

        <div className={styles.actions}>
          <Link href={`/stories/${storyId}`} className={styles.viewButton}>
            Переглянути статтю
          </Link>

          <button
            type="button"
            onClick={onBookmarkClick}
            disabled={isPending}
            aria-pressed={saved}
            aria-label={
              saved ? 'Видалити історію із збережених' : 'Зберегти історію'
            }
            className={[
              styles.bookmarkButton,
              saved ? styles.bookmarkButtonSaved : '',
              isPending ? styles.bookmarkButtonDisabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Збереження...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                {saved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {saved ? 'Видалити з збережених' : 'Зберегти'}
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default TravellersStoriesItem;
