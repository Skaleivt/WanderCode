// components/TravellersStoriesItem/TravellersStoriesItem.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; // ✅ ДАДАДЗЕНЫ useQuery
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'; // 🛑 UserRound і CalendarDays ВЫДАЛЕНЫ
import Image from 'next/image';

import { Story } from '@/types/story';
// ✅ ВЫПРАЎЛЕННЕ ІМПАРТУ: Змяняем шлях да api-функцый
import { toggleStoryBookmark, fetchUserById } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import styles from './TravellersStoriesItem.module.css';
import { User } from '@/types/user'; // ✅ ТРЭБА ІМПАРТАВАЦЬ ТЫП User

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
  const description = story.article; // 🛑 Выдалены старыя заглушкі: authorName, authorAvatar
  const publishedAt = story.date;
  const initialBookmarksCount = story.favoriteCount ?? 0;
  const initiallySaved = story.isFavorite; // ✅ 1. ЗАГРУЗКА ДАДЗЕНЫХ АЎТАРА ПА ID

  const { data: authorData } = useQuery<User>({
    queryKey: ['user', story.ownerId],
    queryFn: () => fetchUserById(story.ownerId),
    enabled: !!story.ownerId,
    staleTime: Infinity, // Дадзеныя аўтара звычайна статычныя
  });

  const authorName = authorData?.name || 'Невядомы аўтар';
  const authorAvatar = authorData?.avatarUrl || '/default-avatar.svg'; // Калі катэгорыя - гэта ID, ён будзе адлюстроўвацца як ID, калі не знойдзены назва.
  const categoryName = category;

  const [saved, setSaved] = useState<boolean>(initiallySaved);
  const [bookmarks, setBookmarks] = useState<number>(initialBookmarksCount); // ✅ 2. ФАРМАТАВАННЕ ДАТЫ (ДД.ММ.ГГГГ)

  const dateStr = useMemo(() => {
    const d = new Date(publishedAt);
    return d.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
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
    }, // ... (onError, onSuccess logic remains unchanged)
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
           {' '}
      <Link href={`/stories/${storyId}`} className={styles.imageLink}>
               {' '}
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={320}
          className={styles.image}
        />
                {/* 🛑 Катэгорыя: перанесена ўнутр content блока для версткі */}
             {' '}
      </Link>
           {' '}
      <div className={styles.content}>
                {/* ✅ Катэгорыя (зверху) */}       {' '}
        <span className={styles.categoryBadge}>{categoryName}</span>           
           {' '}
        <header>
                   {' '}
          <Link href={`/stories/${storyId}`}>
                        <h3 className={styles.title}>{title}</h3>{' '}
            {/* 🛑 Загаловак: 2 радкі */}         {' '}
          </Link>
                 {' '}
        </header>
                <p className={styles.description}>{description}</p>{' '}
        {/* 🛑 Апісанне: 3 радкі */}        {/* 🛑 СТАРЫ МЕТА-БЛОК ВЫДАЛЕНЫ */} 
              {/* ✅ 3. НОВЫ БЛОК АЎТАРА */}       {' '}
        <div className={styles.authorMetaBlock}>
                   {' '}
          <Image
            src={authorAvatar}
            alt={authorName}
            width={40}
            height={40}
            className={styles.authorAvatar}
          />
                   {' '}
          <div className={styles.authorInfoWrapper}>
                        <span className={styles.authorName}>{authorName}</span> 
                     {' '}
            <div className={styles.dateAndBookmarks}>
                           {' '}
              <span className={styles.publishedDate}>{dateStr}</span>           
               {' '}
              <span className={styles.bookmarks}>
                                 {' '}
                <span className={styles.bookmarksCount}>{bookmarks}</span>     
                           {' '}
                {saved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                             {' '}
              </span>
                         {' '}
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className={styles.actions}>
                   {' '}
          <Link href={`/stories/${storyId}`} className={styles.viewButton}>
                        Переглянути статтю          {' '}
          </Link>
                   {' '}
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
                        {/* ... (Кнопка зберагчы) ... */}           {' '}
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />   
                            Збереження...              {' '}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                               {' '}
                {saved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                                {saved ? 'Видалити з збережених' : 'Зберегти'} 
                           {' '}
              </span>
            )}
                     {' '}
          </button>
                 {' '}
        </div>
             {' '}
      </div>
         {' '}
    </article>
  );
};

export default TravellersStoriesItem;
