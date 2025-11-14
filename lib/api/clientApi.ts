'use client';
import { nextServer } from '@/lib/api/api';
import { StoriesResponse } from '@/types/story';

export async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error during session check:', error);
    return false;
  }
}

export async function fetchAllStoriesClient({
  page,
  perPage,
  filter,
  sort,
}: {
  page?: number;
  perPage?: string;
  filter?: string;
  sort?: string;
}): Promise<StoriesResponse> {
  const response = await nextServer.get<StoriesResponse>('/stories', {
    params: {
      page,
      perPage,
      filter,
      sort,
    },
  });

  return response.data;
}
