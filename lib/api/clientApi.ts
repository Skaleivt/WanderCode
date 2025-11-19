// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { api } from './api';
import { StoriesResponse, Story, DetailedStory, Category } from '@/types/story';

import { AxiosError } from 'axios';

export type { StoriesResponse, Story, DetailedStory, Category };

export type StoriesPage = {
  stories: Story[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | undefined;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthorizationRequest = {
  email: string;
  password: string;
};

const ITEMS_PER_PAGE = 9;

export async function fetchAllStoriesClient({
  page = 1,
  perPage = ITEMS_PER_PAGE,
  filter,
  sortField,
  sortOrder,
}: {
  page?: number;
  perPage?: number;
  filter?: string;
  sortField?: string;
  sortOrder?: string;
}): Promise<StoriesResponse> {
  const response = await api.get<StoriesResponse>('/stories', {
    params: {
      page,
      perPage,
      filter,
      sortField,
      sortOrder,
    },
  });

  return response.data;
}

// ✅ ВЫПРАЎЛЕННЕ ПАМЫЛКІ 2353: Дададзеныя perPage, sortField і sortOrder у тыпізацыю аргументаў
export const fetchStoriesPage = async ({
  pageParam,
  filter,
  travellerId,
  perPage, // ✅ ДАДАДЗЕНА
  sortField, // ✅ ДАДАДЗЕНА
  sortOrder, // ✅ ДАДАДЗЕНА
}: {
  pageParam: number;
  filter?: string;
  travellerId?: string;
  perPage?: number; // ✅ ДАДАДЗЕНА
  sortField?: string; // ✅ ДАДАДЗЕНА
  sortOrder?: string; // ✅ ДАДАДЗЕНА
}): Promise<StoriesPage> => {
  // Выкарыстоўваем адносны шлях да Next.js API Proxy Route Handler
  // 💡 ВЫПРАЎЛЕННЕ: Дадаем perPage і sortField/sortOrder у URL для перадачы ў Route Handler
  const params = new URLSearchParams({
    page: String(pageParam),
    ...(filter && { filter }),
    ...(travellerId && { travellerId }),
    ...(perPage && { perPage: String(perPage) }), // ПАВІНЕН БЫЦЬ ЛІК
    ...(sortField && { sortField }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  const res = await fetch(`/api/stories?${params}`);
  if (!res.ok) throw new Error('Не вдалося завантажыць гісторыі');

  const fullResponse: StoriesResponse = await res.json();
  const paginationData = fullResponse.data;

  return {
    stories: paginationData.data,
    totalItems: paginationData.totalItems,
    totalPages: paginationData.totalPages,
    currentPage: paginationData.page,
    nextPage:
      paginationData.page < paginationData.totalPages
        ? paginationData.page + 1
        : undefined,
  };
};

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await api.post(`/auth/register`, data, {
    withCredentials: true,
  });
  return {
    ...response.data,
  };
}

export async function loginUser(data: AuthorizationRequest): Promise<User> {
  const response = await api.post(`/auth/login`, data, {
    withCredentials: true,
  });
  return {
    ...response.data,
  };
}

export const getMe = async () => {
  const res = await api.get('/users/current', {
    withCredentials: true,
  });
  return res.data.data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await api.post('/auth/refresh', {
      withCredentials: true,
    });
    return res.status === 200;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export async function addStoryToSaved(storyId: string): Promise<void> {
  try {
    await api.post('/users/saved', { storyId });
  } catch (error: unknown) {
    let message = 'Не вдалося додати в збережені';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
  }
}

export async function removeStoryFromSaved(storyId: string): Promise<void> {
  try {
    await api.delete('/users/saved', { data: { storyId } });
  } catch (error: unknown) {
    let message = 'Не вдалося выдаліць із збережаных';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
  }
}

export async function toggleStoryBookmark(
  storyId: string,
  isCurrentlySaved: boolean
): Promise<void> {
  if (isCurrentlySaved) {
    await removeStoryFromSaved(storyId);
  } else {
    await addStoryToSaved(storyId);
  }
}

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    console.error('Помилка fetchUserById:', error);
    throw new Error('Не вдалося завантажыць дадзеныя карыстальніка');
  }
};

export const fetchStoryById = async (id: string): Promise<DetailedStory> => {
  try {
    const response = await api.get(`/stories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Помилка fetchStoryByIdServer:', error);
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error('Story Not Found (404)');
    }
    throw new Error('Не вдалося завантажити історію (SSR)');
  }
};

export const saveStory = async (id: string) => {
  try {
    const response = await api.post(`/stories/save/${id}`, {});
    return response.data;
  } catch (error: unknown) {
    let message = 'Не вдалося зберагчы гісторыю';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
  }
};
