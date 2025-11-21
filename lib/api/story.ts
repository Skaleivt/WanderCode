// lib/api/story.ts

import type { StoriesResponse } from '@/types/story';
import { api } from './api';
import { AddStoryFormValues } from '@/components/StoriesForm/AddStoryForm';
import type { Story } from '@/types/story';
export const storiesKeys = {
  all: ['stories'] as const,
  saved: () => ['stories', 'saved'] as const,
  mine: () => ['stories', 'mine'] as const, // for detail / edit page
  detail: (id: string) => ['stories', 'detail', id] as const, // ✅ ЗМЕНА: Дадаем initialLimit і stepLimit у ключ для аўтаматычнага скіду!
  list: (filter?: string, initialLimit?: number, stepLimit?: number) =>
    ['stories', 'list', { filter, initialLimit, stepLimit }] as const,
};

// Function to fetch all stories with pagination and filtering
export async function getStories(
  page = 1,
  limit = 9,
  filter?: string // Category ID for filtering
): Promise<StoriesResponse> {
  const { data } = await api.get('/stories', {
    params: {
      page,
      perPage: limit,
      category: filter === 'all' ? undefined : filter,
    },
  });
  return data;
}

export async function getSavedStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
  const { data } = await api.get('/stories/saved', {
    params: { page, limit },
  });
  return data;
}

export async function getMyStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
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
  form.append('description', values.description);
  const res = await api.post('/stories', form);
  return res.data;
}
// Get one story for form prefill (Edit)
export async function getStoryById(storyId: string): Promise<Story> {
  const { data } = await api.get(`/stories/${storyId}`);
  // якщо бек повертає { data: {...} } → поміняй на return data.data;
  return data.data;
}

// Update existing story (PATCH)
export async function updateStory(
  storyId: string,
  values: AddStoryFormValues
): Promise<Story> {
  const form = new FormData();

  // Send file only if it is a new File
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
