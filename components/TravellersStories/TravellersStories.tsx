
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import StoriesList from "@/components/StoriesList/StoriesList";
import { showErrorToast } from "@/components/ShowErrorToast/ShowErrorToast";


type Story = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  // додай сюди решту полів, які треба StoriesList
};

// TODO: заміни на свій реальний API-запит (наприклад, clientApi.getStories())
const fetchStories = async (): Promise<Story[]> => {
  const res = await fetch("/api/stories");

  if (!res.ok) {
    throw new Error("Не вдалося завантажити історії");
  }

  return res.json();
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) =>
      setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener("change", listener);

    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const TravellersStories = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery(
    "(min-width: 768px) and (max-width: 1279px)"
  );
  const isMobile = useMediaQuery("(max-width: 767px)");

  // стартові кількості: desktop 9, tablet 8, mobile 9
  const initialCount = useMemo(() => {
    if (isDesktop) return 9;
    if (isTablet) return 8;
    if (isMobile) return 9;
    return 9;
  }, [isDesktop, isTablet, isMobile]);

  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  const {
    data: stories = [],
    isLoading,
    isError,
    error,
  } = useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: fetchStories, // тут можеш підставити свою функцію з api.ts
  });

  // показати toast один раз при помилці
  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error ? error.message : "Сталася помилка";
      showErrorToast(message);
    }
  }, [isError, error]);

  // ЛОАДЕР
  if (isLoading) {
    return (
      <div className="stories-loader">
        <Loader />
      </div>
    );
  }

  // ПОРОЖНІЙ СТАН, якщо з бекенда прийшов пустий масив
  if (!stories.length) {
    return (
      <div className="stories-empty">
        <h2 className="stories-empty__title">Поки що немає історій</h2>
        <p className="stories-empty__text">
          Станьте першим, хто поділиться власною мандрівкою та надихне
          інших!
        </p>
      </div>
    );
  }

  const visibleStories = stories.slice(0, visibleCount);
  const canLoadMore = visibleCount < stories.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, stories.length));
  };

  return (
    <section className="stories">
      <StoriesList stories={visibleStories} />

      {canLoadMore && (
        <div className="stories__load-more-wrap">
          <button
            type="button"
            className="stories__load-more-btn"
           
             onClick={handleLoadMore}
          >
            Переглянути всі
          </button>
        </div>
      )}
    </section>
  );
};

export default TravellersStories;