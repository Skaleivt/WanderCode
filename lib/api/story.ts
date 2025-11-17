import axios from 'axios';
import type { StoriesResponse } from '@/types/story';
import { nextServer } from './api';
import { AddStoryFormValues } from '@/components/StoriesForm/AddStoryForm';

export const storiesKeys = {
  all: ['stories'] as const,
  saved: () => ['stories', 'saved'] as const,
  mine: () => ['stories', 'mine'] as const,
};

export async function getSavedStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
  const { data } = await nextServer.get('/api/stories/saved', {
    params: { page, limit },
  });
  return data;
}

export async function getMyStories(
  page = 1,
  limit = 9
): Promise<StoriesResponse> {
  const { data } = await axios.get('/api/stories/owner-stories', {
    params: { page, limit },
  });
  return data;
}

export async function createStory(values: AddStoryFormValues) {
  const form = new FormData();
  if (values.cover) form.append('cover', values.cover);
  form.append('title', values.title);
  form.append('category', values.category);
  form.append('body', values.body);
  form.append('shortDesc', values.shortDesc ?? '');

  const res = await nextServer.post('/stories', form);
  return res.data;
}
export async function getCategories() {
  const res = await nextServer.get('/stories/categories');
  return res.data.data;
}
