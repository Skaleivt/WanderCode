// lib/api/story.ts

import type { StoriesResponse} from '@/types/story';
import { api } from './api';
import { AddStoryFormValues } from '@/components/StoriesForm/AddStoryForm';
import type { Story } from '@/types/story';
export const storiesKeys = {
  all: ['stories'] as const,
  saved: () => ['stories', 'saved'] as const,
  mine: () => ['stories', 'mine'] as const,
    // 🔹 для сторінки деталей / редагування
  detail: (id: string) => ['stories', 'detail', id] as const,
};

export async function getSavedStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
  // ✅ ВЫПРАЎЛЕННЕ: Выдалены пачатковы '/api' з шляху
  const { data } = await api.get('/stories/saved', {
    params: { page, limit },
  });
  return data;
}

export async function getMyStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
  // ✅ ВЫПРАЎЛЕННЕ: Выкарыстаны імпартаваны 'api' і выдалены пачатковы '/api'
  const { data } = await api.get('/stories/owner-stories', {
    params: { page, limit },
  });
  return data;
}

export async function createStory(values: AddStoryFormValues) {
  const form = new FormData();
  if (values.cover) form.append('cover', values.cover);
  form.append('title', values.title);
  form.append('category', values.category);
  form.append('description', values.description); // form.append('shortDesc', values.shortDesc ?? '');
  // Запыт адпраўляецца на Next.js API Route /api/stories
  const res = await api.post('/stories', form);
  return res.data;
}
// 🔹 Отримати одну історію для префілу форми (Edit)
export async function getStoryById(storyId: string): Promise<Story> {
  const { data } = await api.get(`/stories/${storyId}`);
  // якщо бек повертає { data: {...} } → поміняй на return data.data;
  return data;
}

// 🔹 Оновити існуючу історію (PATCH)
export async function updateStory(
  storyId: string,
  values: AddStoryFormValues
): Promise<Story> {
  const form = new FormData();

  // ⚠️ Надсилаємо файл тільки якщо це новий File
  if (values.cover instanceof File) {
    form.append('cover', values.cover);
  }

  form.append('title', values.title);
  form.append('category', values.category);
  form.append('description', values.description);

  const { data } = await api.patch(`/stories/${storyId}`, form);
  return data;
}
export async function getCategories() {
  const res = await api.get('/stories/categories');
  return res.data.data;
}
