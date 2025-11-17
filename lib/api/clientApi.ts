// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { nextServer } from './api';
import { StoriesResponse, Story, DetailedStory } from '@/types/story';
import axios from 'axios';

export type StoriesPage = {
  stories: Story[];
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
  const response = await nextServer.get<StoriesResponse>('/stories', {
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
  filter: string;
}): Promise<StoriesPage> => {
  const res = await fetch(`/api/stories?page=${pageParam}&filter=${filter}`);
  if (!res.ok) throw new Error('Не ўдалося загрузіць гісторыі');
  return res.json();
};

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post(`/auth/register`, data, {
    withCredentials: true,
  });
  return {
    ...response.data,
  };
}

export async function loginUser(data: AuthorizationRequest): Promise<User> {
  const response = await nextServer.post(`/auth/login`, data, {
    withCredentials: true,
  });
  return {
    ...response.data,
  };
}

export const getMe = async () => {
  const res = await nextServer.get('/users/current', {
    withCredentials: true,
  });
  return res.data.data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await nextServer.post('/auth/refresh', {
      withCredentials: true,
    });
    return res.status === 200;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export async function addStoryToSaved(storyId: string): Promise<void> {
  try {
    await nextServer.post('/saved', { storyId });
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
    await nextServer.delete('/saved', { data: { storyId } });
  } catch (error: unknown) {
    let message = 'Не вдалося видалити із збережених';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
  }
}
export const fetchStoryById = async (id: string): Promise<DetailedStory> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
    );

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
      console.error('Невідома помилка fetchStoryById');
    }
    throw new Error('Не вдалося завантажити історію');
  }
};

export const saveStory = async (id: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stories/save/${id}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};
