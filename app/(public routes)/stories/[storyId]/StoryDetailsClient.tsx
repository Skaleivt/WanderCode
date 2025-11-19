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

interface PageParams {
  storyId: string;
}

export function StoryDetailsClient({ storyId }: PageParams) {
  const queryClient = useQueryClient();
  const [imgSrc, setImgSrc] = useState<string>('/file.svg');

  const {
    data: story,
    isLoading,
    isError,
  } = useQuery<DetailedStory, Error>({
    queryKey: ['story', storyId],
    queryFn: () => fetchStoryById(storyId),
    // Використовуємо SSR data, щоб не робити повторний запит
    initialData: () =>
      queryClient.getQueryData<DetailedStory>(['story', storyId]),
    enabled: !!storyId, // запит тільки якщо storyId існує
  });

  useEffect(() => {
    if (story?.img) setImgSrc(story.img);
  }, [story]);

  useEffect(() => {
    setImgSrc(story?.img ?? '/default-avatar.png');
  }, [story]);

  // Мутація для кнопки "Зберегти"
  const mutation = useMutation({
    mutationFn: () => saveStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      toast.success('Історія збережена!');
    },
    onError: () => {
      toast.error('Не вдалося зберегти історію');
    },
  });

  if (isLoading) return <Loader />;

  if (isError || !story) {
    return (
      <MessageNoStories
        text="Історію не знайдено"
        buttonText="Повернутися до всіх історій"
      />
    );
  }

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
            {story.date ? new Date(story.date).toLocaleDateString() : '–'}
          </span>
        </p>
        <p className={css.country}>
          <span className={css.value}>{story.category?.title ?? '–'}</span>
        </p>
      </div>

      <div
        className={css.imageWrapper}
        style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}
      >
        <Image
          src={imgSrc}
          alt={story.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          onError={() => setImgSrc('/file.svg')}
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
      <p className={css.stories}>Популярні історії</p>
    </div>
  );
}
