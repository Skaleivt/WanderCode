'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStoryById, addStoryToSaved } from '@/lib/api/clientApi';
import { DetailedStory } from '@/types/story';
import Loader from '@/components/Loader/Loader';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import css from './StoryDetailsClient.client.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

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
    initialData: () =>
      queryClient.getQueryData<DetailedStory>(['story', storyId]),
    enabled: !!storyId,
  });

  useEffect(() => {
    if (story?.img) setImgSrc(story.img);
  }, [story]);

  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const mutation = useMutation({
    mutationFn: () => addStoryToSaved(storyId),
    onSuccess: () => {
      toast.success('Історія збережена!');
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      queryClient.invalidateQueries({ queryKey: ['savedStories'] }); // оновлюємо список збережених
    },
    onError: () => {
      toast.error('Не вдалося зберегти історію');
    },
  });

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.info('Будь ласка, увійдіть, щоб зберегти історію');
      router.push('/auth/login');
      return;
    }
    mutation.mutate();
  };

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
        <div className={css.leftBlock}>
          <p className={css.data}>
            <span className={css.label}>Автор статті:</span>
            <span className={css.value}>{story.ownerId?.name ?? '–'}</span>
          </p>
          <p className={css.data}>
            <span className={css.label}>Опубліковано:</span>
            <span className={css.value}>
              {story.date ? new Date(story.date).toLocaleDateString() : '–'}
            </span>
          </p>
        </div>
        <p className={css.country}>
          <span className={css.value}>{story.category?.name ?? '–'}</span>
        </p>
      </div>

      <div
        className={css.imageWrapper}
        style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}
      >
        <Image
          src={imgSrc}
          alt={story.title ? `Image for story: ${story.title}` : 'Story image'}
          fill
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
            onClick={handleSave}
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
