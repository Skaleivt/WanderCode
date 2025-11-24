// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { api } from './api';
import { StoriesResponse, Story, DetailedStory, Category } from '@/types/story';

import axios, { AxiosError } from 'axios';

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

export const fetchStoriesPage = async ({
  pageParam,
  filter,
  travellerId,
  perPage = ITEMS_PER_PAGE,
  sortField,
  sortOrder,
}: {
  pageParam: number | undefined;
  filter?: string;
  travellerId?: string;
  perPage?: number;
  sortField?: string;
  sortOrder?: string;
}): Promise<StoriesPage> => {
  const page =
    Number(pageParam) > 0 && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;

  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    ...(filter && { filter }),
    ...(travellerId && { travellerId }),
    ...(sortField && { sortField }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  const url = `/api/stories?${params}`;

  try {
    console.log('fetchStoriesPage -> URL:', url);
    const res = await fetch(url);

    console.log('fetchStoriesPage -> status:', res.status, res.statusText);

    // Якщо не OK — виводимо тіло відповіді (text) для діагностики
    if (!res.ok) {
      const text = await res.text().catch(() => '[could not read body]');
      console.error('fetchStoriesPage -> non-ok response body:', text);
      throw new Error('Failed to load stories');
    }

    // Спробуємо розпарсити JSON і логнути перші ключі
    const fullResponse: StoriesResponse = await res.json();
    console.log(
      'fetchStoriesPage -> response JSON keys:',
      Object.keys(fullResponse || {})
    );
    console.log('fetchStoriesPage -> response preview:', {
      data: fullResponse?.data
        ? {
            page: fullResponse.data.page,
            totalPages: fullResponse.data.totalPages,
            totalItems: fullResponse.data.totalItems,
            sampleItem:
              (fullResponse.data.data && fullResponse.data.data[0]) || null,
          }
        : null,
    });

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
  } catch (err) {
    console.error('fetchStoriesPage -> unexpected error:', err);
    throw err; // прокинемо далі, щоб твій tоast або UI побачили помилку
  }
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
  try {
    const res = await api.get('/users/current', { withCredentials: true });
    return res.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return null;
      }
    }

    throw err;
  }
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
    let message = 'Failed to add to saved';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
  }
}

export async function removeStoryFromSaved(storyId: string): Promise<void> {
  try {
    await api.delete('/users/saved', {
      data: { storyId },
    });
  } catch (error: unknown) {
    let message = 'Failed to remove from saved';
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
    console.error('fetchUserById error:', error);
    throw new Error('Failed to load user data');
  }
};

export const fetchStoryById = async (id: string) => {
  if (!id) {
    console.error('fetchStoryById: storyId is undefined');
    return null;
  }

  try {
    const baseURL = api.defaults.baseURL;
    const fullUrl = `${baseURL}/stories/${id}`;
    console.log('API baseURL:', baseURL);
    console.log('Full request URL:', fullUrl);

    const response = await api.get(`/stories/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('fetchStoryById error:', error.message);
    } else {
      console.error('fetchStoryById error (unknown):', error);
    }
    return null;
  }
};

export const saveStory = async (storyId: string) => {
  try {
    const res = await api.post('/stories/saved', { storyId });
    return res.data;
  } catch (error) {
    throw new Error('Failed to save story');
  }
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/stories/categories');

    return Array.isArray(response.data)
      ? response.data
      : (response.data?.data ?? []);
  } catch (error) {
    console.error('Error in fetchAllCategories:', error);
    throw error;
  }
};
