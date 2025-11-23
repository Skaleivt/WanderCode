// app/(public routes)/stories/[storyId]/StoryDetailsClient.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStoryById, saveStory } from '@/lib/api/clientApi';
import css from './StoryDetailsClient.client.module.css';
import { DetailedStory } from '@/types/story';
import Loader from '@/components/Loader/Loader';
import { toast } from 'react-toastify';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/api/categories';
import Container from '@/components/Container/Container';

interface PageParams {
  storyId: string;
}

type OwnerShape = {
  _id?: string;
  name?: string;
  avatarUrl?: string;
};

// Safe helpers
function hasKey(obj: unknown, key: string): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    key in (obj as Record<string, unknown>)
  );
}

function asRecord(u: unknown): Record<string, unknown> {
  return u as unknown as Record<string, unknown>;
}

function normalizeOwner(story: DetailedStory): OwnerShape {
  const s = asRecord(story);

  if (hasKey(s, 'owner')) {
    const ownerVal = s['owner'];
    if (typeof ownerVal === 'object' && ownerVal !== null) {
      const o = ownerVal as Record<string, unknown>;
      return {
        _id: typeof o._id === 'string' ? (o._id as string) : undefined,
        name: typeof o.name === 'string' ? (o.name as string) : undefined,
        avatarUrl:
          typeof o.avatarUrl === 'string' ? (o.avatarUrl as string) : undefined,
      };
    }
  }

  if (hasKey(s, 'ownerId')) {
    const ownerIdVal = s['ownerId'];
    if (typeof ownerIdVal === 'object' && ownerIdVal !== null) {
      const o = ownerIdVal as Record<string, unknown>;
      return {
        _id: typeof o._id === 'string' ? (o._id as string) : undefined,
        name: typeof o.name === 'string' ? (o.name as string) : undefined,
        avatarUrl:
          typeof o.avatarUrl === 'string' ? (o.avatarUrl as string) : undefined,
      };
    }
  }

  return {};
}

export function StoryDetailsClient({ storyId }: PageParams) {
  const queryClient = useQueryClient();
  const [imgSrc, setImgSrc] = useState<string>('/file.svg');
  const [categoryName, setCategoryName] = useState<string>('–');

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

  useEffect(() => {
    if (!story?.category?._id) return;

    getCategories()
      .then((apiCategories) => {
        const categories: { _id: string; name: string }[] = apiCategories.map(
          (c) => ({
            _id: c._id,
            name: c.name,
          })
        );

        const cat = categories.find((c) => c._id === story.category._id);
        setCategoryName(cat?.name ?? '–');
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setCategoryName('–');
      });
  }, [story]);

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

  const owner = normalizeOwner(story);
  const authorName = owner.name ?? '–';

  return (
    <Container>
      <div className={css.container}>
        <h2 className={css.title}>{story.title}</h2>

        <div className={css.infoBlock}>
          <div className={css.leftBlock}>
            <div className={css.authorRow}>
              <div className={css.authorMeta}>
                <p className={css.data}>
                  <span className={css.label}>Автор статті:</span>
                  <span className={css.value}>{authorName}</span>
                </p>
                <p className={css.data}>
                  <span className={css.label}>Опубліковано:</span>
                  <span className={css.value}>
                    {story.date
                      ? new Date(story.date).toLocaleDateString()
                      : '–'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <p className={css.country}>
            <span className={css.value}>{categoryName}</span>
          </p>
        </div>

        <div
          className={css.imageWrapper}
          style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}
        >
          <Image
            src={imgSrc}
            alt={story.title ?? 'story image'}
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
    </Container>
  );
}
