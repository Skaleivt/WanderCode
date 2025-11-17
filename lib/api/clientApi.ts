// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { api } from './api';
import { StoriesResponse, Story, DetailedStory } from '@/types/story';
import axios from 'axios';

// ✅ РЭЭКСПАРТ: Робім імпартаваныя тыпы даступнымі для іншых модуляў
export type { StoriesResponse, Story, DetailedStory };

// ✅ ВЫПРАЎЛЕННЕ: Пашыраем StoriesPage для адпаведнасці структуры адказу і useInfiniteQuery
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
}: {
  pageParam: number;
  filter?: string;
  travellerId?: string;
}): Promise<StoriesPage> => {
  // Выкарыстоўваем адносны шлях да Next.js API Proxy Route Handler
  const res = await fetch(`/api/stories?page=${pageParam}&filter=${filter}`);
  if (!res.ok) throw new Error('Не вдалося завантажыць гісторыі');

  const fullResponse: StoriesResponse = await res.json();
  const data = fullResponse.data;

  return {
    stories: data.items,
    totalItems: data.totalItems,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    nextPage:
      data.currentPage < data.totalPages ? data.currentPage + 1 : undefined,
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

export const fetchStoryById = async (id: string): Promise<DetailedStory> => {
  try {
    const response = await api.get(`/stories/${id}`);

    const story = response.data.data;
    console.log('story::::', story);
    return {
      _id: story._id,
      img: story.img,
      title: story.title,
      article: story.article,
      date: story.date,
      favoriteCount: story.favoriteCount,
      owner: story.ownerId,
      category: story.category,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Помилка fetchStoryById:',
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error('Помилка fetchStoryById:', error.message);
    } else {
      console.error('Невідома памылка fetchStoryById');
    }
    throw new Error('Не вдалося завантажыць гісторыю');
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
