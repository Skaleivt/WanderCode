"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { toggleStoryBookmark } from "@/lib/api/storyApi";
import { useAuthStore } from "@/lib/store/authStore";
import { showErrorToast } from "@/components/ShowErrorToast/ShowErrorToast";
import Image from "next/image";

type TravellersStoriesItemProps = {
  storyId: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string | Date;
  initialBookmarksCount: number;
  initiallySaved: boolean;
};

const TravellersStoriesItem = ({
  storyId,
  imageUrl,
  category,
  title,
  description,
  authorName,
  authorAvatar,
  publishedAt,
  initialBookmarksCount,
  initiallySaved,
}: TravellersStoriesItemProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [saved, setSaved] = useState<boolean>(Boolean(initiallySaved));
  const [bookmarks, setBookmarks] = useState<number>(
    Number(initialBookmarksCount) || 0,
  );

  const dateStr = useMemo(() => {
    const d = new Date(publishedAt);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }, [publishedAt]);

  const { mutate: handleToggleBookmark, isPending } = useMutation({
    mutationFn: () => toggleStoryBookmark(storyId, saved),
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
    onSuccess: (res) => {
      if (typeof res?.bookmarks === "number") {
        setBookmarks(Math.max(0, res.bookmarks));
      }
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    },
  });

  const onBookmarkClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    handleToggleBookmark();
  };

  return (
    <>
      <article className="group grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:grid-cols-[280px_1fr]">

        <Link
          href={`/stories/${storyId}`}
          className="relative block overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
        >
          <Image
  src={imageUrl}
  alt={title}
  width={800}
  height={320}
  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
/>
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow">
            {category}
          </span>
        </Link>

        <div className="flex flex-col px-5 pb-5 pt-2 md:py-5">
          <header className="mb-3">
            <Link href={`/stories/${storyId}`}>
              <h3 className="line-clamp-2 text-xl font-semibold text-slate-900">
                {title}
              </h3>
            </Link>
          </header>

          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Image
  src={authorAvatar}
  alt={authorName}
  width={32}
  height={32}
  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
/>
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              {authorName}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {dateStr}
            </span>
            <span className="ml-auto inline-flex items-center gap-2 text-slate-700">
              {saved ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{bookmarks}</span>
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/stories/${storyId}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Переглянути статтю
            </Link>

            <button
              type="button"
              onClick={onBookmarkClick}
              disabled={isPending}
              aria-pressed={saved}
              aria-label={
                saved
                  ? "Видалити історію із збережених"
                  : "Додати історію в збережені"
              }
              className={`inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                saved
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              } ${isPending ? "cursor-wait opacity-80" : ""}`}
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
                  {saved ? "У збережених" : "Додати в збережені"}
                </span>
              )}
            </button>
          </div>
        </div>
      </article>

    </>
  );
};

export default TravellersStoriesItem;