// lib/api/serverApi.ts (Вяртаем да чыстага стану)

import { cookies } from 'next/headers';
import { api } from './api';
import { Category, DetailedStory, StoriesResponse } from '@/types/story';
import { User } from '@/types/user';
import { AxiosError, AxiosResponse } from 'axios';

async function getServerCookies(): Promise<string> {
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll()
    .map(
      (cookie: { name: string; value: string }) =>
        `${cookie.name}=${cookie.value}`
    )
    .join('; ');

  if (cookieString) {
    console.log('SERVER DEBUG: Cookies being sent to Backend:', cookieString);
  } else {
    console.log('SERVER DEBUG: No cookies found in request.');
  }

  return cookieString;
}

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const res = await api.get('/auth/refresh', {
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return res;
};

export async function fetchAllStoriesServer({
  page,
  perPage,
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
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: {
      page,
      perPage,
      filter,
      sortField,
      sortOrder,
    },
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return {
    ...response.data,
  };
}

export const getMeServer = async (): Promise<User | null> => {
  try {
    const res = await api.get<User>('/users/current', {
      headers: {
        Cookie: await getServerCookies(),
      },
    });

    console.log('SERVER DEBUG: User fetched successfully (200 OK).');

    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return null;
      }
      console.error('Failed to fetch user on server:', err.message);
      return null;
    }
    // Якщо помилка не AxiosError
    console.error('Unexpected error on server:', err);
    return null;
  }
};

// 🛑 Пакідаем функцыю тут, але яна не выклікаецца нідзе пасля адкату.
export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[];
}
export async function fetchCategoriesServer(): Promise<CategoryResponse> {
  const response = await api.get<CategoryResponse>(`/stories/categories`);

  return {
    ...response.data,
  };
}

export async function fetchStoryByIdServer(
  storyId: string
): Promise<DetailedStory> {
  try {
    if (!storyId) {
      throw new Error('storyId не передано');
    }

    const res = await api.get(`/stories/${storyId}`);
    // Логування для дебагу
    console.log('server fetchStoryByIdServer response:', res.data);

    const storyData = res.data?.data;

    // Перевірка, чи є story
    if (!storyData) {
      throw new Error('Story Not Found (дані пусті)');
    }

    // Додаткова перевірка полів, щоб TypeScript був задоволений
    const story: DetailedStory = {
      _id: storyData._id,
      img: storyData.img || '/file.svg',
      title: storyData.title || 'Без назви',
      article: storyData.article || '',
      category: {
        _id: storyData.category?._id || '',
        title: storyData.category?.title || '–',
      },
      owner: {
        _id: storyData.owner?._id || '',
        name: storyData.owner?.name || '–',
        avatarUrl: storyData.owner?.avatarUrl || '/file.svg',
      },
      date: storyData.date || new Date().toISOString(),
      favoriteCount: storyData.favoriteCount || 0,
    };

    return story;
  } catch (error) {
    console.error('Помилка fetchStoryByIdServer:', error);

    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error('Story Not Found (404)');
    }

    throw new Error('Не вдалося завантажити історію (SSR)');
  }
}
