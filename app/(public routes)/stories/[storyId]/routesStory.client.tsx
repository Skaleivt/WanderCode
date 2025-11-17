'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStoryById, saveStory } from '@/lib/api/clientApi';
import css from './routesStory.client.module.css';
import { DetailedStory } from '@/types/story';
import Loader from '@/components/Loader/Loader';
import { toast } from 'react-toastify';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type Props = {
  storyId: string;
};

export function StoryDetailsClient({ storyId }: Props) {
  const queryClient = useQueryClient();

  // Запит детальної історії
  const {
    data: story,
    isLoading,
    isError,
  } = useQuery<DetailedStory, Error>({
    queryKey: ['story', storyId],
    queryFn: () => fetchStoryById(storyId),
  });

  // Локальны стан для src выявы + fallback
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setImgSrc(story?.img ?? '/default-avatar.png');
  }, [story]);

  // Мутація для кнопки "Зберегти"
  const mutation = useMutation({
    mutationFn: () => saveStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        // після успіху перезапитуємо деталі історії
        queryKey: ['story', storyId],
      });
      toast.success('Історія збережена!');
    },
    onError: () => {
      toast.error('Не вдалося зберегти історію');
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !story) {
    return (
      <MessageNoStories
        text="Історію не знайдено"
        buttonText="Повернутися до всіх історій"
      />
    );
  }

  console.log('story.img:', story?.img);

  return (
    <div className={css.container}>
      <h2 className={css.title}>{story.title}</h2>
      <div className={css.infoBlock}>
        <p className={css.author}>
          <span className={css.label}>Автор статті:</span>
          <span className={css.value}>{story.owner?.name || '–'}</span>
        </p>
        <p className={css.date}>
          <span className={css.label}>Опубліковано:</span>
          <span className={css.value}>
            {new Date(story.date).toLocaleDateString()}
          </span>
        </p>
        <p className={css.country}>
          <span className={css.value}>{story.category?.title || '–'}</span>
        </p>
      </div>

      {/* Image wrapper: for next/image fill the parent must be position:relative and have height */}
      <div
        className={css.imageWrapper}
        // inline style ensures parent has height for fill; you can move this to CSS module
        style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}
      >
        <Image
          src={imgSrc ?? '/default-avatar.png'}
          alt={story.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          // onError is supported in client components; fallback to local default
          onError={() => {
            if (imgSrc !== '/default-avatar.png')
              setImgSrc('/default-avatar.png');
          }}
          // временно отключаем оптимизацию если upstream иногда возвращает HTML/404 при SSR
          unoptimized
        />
      </div>

      <div className={css.articleBlock}>
        <p className={css.article}>{story.article}</p>

        <div className={css.savedBlock}>
          <h3 className={css.savedTitle}>Збережіть собі історію</h3>
          <p className={css.savedText}>
            Вона буде доступна у вашому профілі у розділі збережене
          </p>
          <button
            className={css.saveButton}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Зберігаємо...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  );
}
