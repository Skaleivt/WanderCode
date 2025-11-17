import Image from "next/image";
import { useRouter } from 'next/navigation';

import { Story } from '@/types/story';

import css from './TravellersStoriesItem.module.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleStoryBookmark } from "@/lib/api/storyApi";
import { useState } from "react";
import { showErrorToast } from "../ShowErrorToast/ShowErrorToast";
import { useAuthStore } from "@/lib/store/authStore";

type TravelersStoriesItemProps = {
  story: Story;
};

export default function TravelersStoriesItem({
  story,
}: TravelersStoriesItemProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [saved, setSaved] = useState<boolean>(Boolean(story.isFavorite));
  const [bookmarks, setBookmarks] = useState<number>(story.favoriteCount);

  const { mutate: handleToggleBookmark, isPending } = useMutation({
    mutationFn: () => toggleStoryBookmark(story._id, saved),
    onMutate: async () => {
      setSaved((prev) => !prev);
      setBookmarks((prev) => (saved ? Math.max(0, prev - 1) : prev + 1));
    },
    onError: (error: unknown) => {
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Сталася помилка. Спробуйте ще раз.",
      );
      setSaved((prev) => !prev);
      setBookmarks((prev) =>
        saved ? prev + 1 : Math.max(0, prev - 1),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["story", story._id] });
    },
  });

  const onBookmarkClick = () => {
    if (!isAuthenticated) {
      router.push("/sign-up");
      return;
    }
    handleToggleBookmark();
  };

  const getDateString = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
  }

  const goToStoryById = (id: string): void => {
      router.push(`/stories/${id}`);
  };


  return (
    <div className={css.story}>
      <img className={css.img} src={story.img} alt={story.title} />
                
      <div className={css.content}>
          <div className={css.info}>
              <div className={css.category}>{story.category}</div>
              <h3 className={css.title}>{story.title}</h3>
              <p className={css.description}>{story.article}</p>
          </div>

          <div className={css.owner}>
              <img className={css.avatar} src={story.img} alt={story.ownerId} />
              <div className={css.ownerInfo}>
                  <div>{story.ownerId}</div>
                  <div>{getDateString(new Date(story.date))} &#8226; {story.favoriteCount} <Image src="/favorite.svg" width={12} height={12} alt="Favorite" /></div>
              </div>
          </div>
          
          <div className={css.buttonPanel}>
              <button 
                  onClick={() => goToStoryById(story._id)}
                  className={css.button} 
              >
                  Переглянути статтю
              </button>
              <button 
                  onClick={onBookmarkClick}
                  disabled={isPending}
                  aria-pressed={saved}
                  aria-label={
                    saved
                      ? "Видалити історію із збережених"
                      : "Зберегти історію"
                  }
                  className={[
                    css.button, 
                    css.favoriteButton, 
                    saved ? css.bookmarkButtonSaved : "",
                    isPending ? css.bookmarkButtonDisabled : "",
                  ].filter(Boolean).join(" ")}
              >
                  <Image src="/favorite.svg" width={20} height={20} alt="Favorite" />
              </button>
          </div>
      </div>
    </div>
  );
}
