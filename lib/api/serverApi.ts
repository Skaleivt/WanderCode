// lib/api/serverApi.ts
import { cookies } from 'next/headers';
import { nextServer } from './api';
import { Category, StoriesResponse } from '@/types/story';
import { AxiosResponse } from 'axios';
import { User } from '@/types/user';

async function getServerCookies(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const res = await nextServer.get('/auth/refresh', {
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
  const response = await nextServer.get<StoriesResponse>(`/stories`, {
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
    const res = await nextServer.get<User>('/users/current', {
      headers: {
        Cookie: await getServerCookies(),
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user on server:', error);
    return null;
  }
};

export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[];
}
export async function fetchCategoriesServer(): Promise<CategoryResponse> {
  const response =
    await nextServer.get<CategoryResponse>(`/stories/categories`);

  return {
    ...response.data,
  };
}
