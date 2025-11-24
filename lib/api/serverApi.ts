// lib/api/serverApi.ts

import { cookies } from 'next/headers';
import { api } from './api';
import {
  // Category,
  CategoryResponse,
  DetailedStory,
  StoriesResponse,
  Story,
} from '@/types/story';
import { UserResponse } from '@/types/user';
import { AxiosResponse } from 'axios';
import { OwnStoriesProp } from './clientApi';
// import { StoryWithStatus } from '@/components/StoriesList/StoriesList';
export const getStoriesServer = async ({
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
}) => {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: {
      page,
      perPage,
      filter,
      sortField,
      sortOrder,
    },
  });
  return response.data;
};

export const getServerCookies = async (): Promise<string> => {
  const cookieStore = await cookies();
  const cookieArray = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .filter(Boolean);

  return cookieArray.length > 0 ? cookieArray.join('; ') : '';
};

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const res = await api.get('/auth/refresh', {
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return res;
};

async function executeStoriesRequest({
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

  return response.data;
}
export async function fetchMyStoriesServer({
  page,
  perPage,
  filter,
}: OwnStoriesProp) {
  try {
    const res = await api.get<StoriesResponse>('/stories', {
      params: {
        page,
        perPage,
        ownerId: filter,
      },
      headers: {
        Cookie: await getServerCookies(),
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}

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
  const requestedPerPage = perPage || 4;
  const backendPerPage = 3;

  try {
    // 1. Query 1st page
    const response1 = await executeStoriesRequest({
      page: 1,
      perPage: backendPerPage,
      filter,
      sortField,
      sortOrder,
    }); // 2. Query 2nd page

    const response2 = await executeStoriesRequest({
      page: 2,
      perPage: backendPerPage,
      filter,
      sortField,
      sortOrder,
    });

    let storiesData: Story[] = [];

    const data1 = response1?.data?.data || [];
    const data2 = response2?.data?.data || []; // Concatenate and slice to the requested amount (4)

    storiesData = [...data1, ...data2];
    storiesData = storiesData.slice(0, requestedPerPage);

    const totalReturned = storiesData.length;

    const correctedResponse: StoriesResponse = {
      data: {
        totalItems: response1.data.totalItems || totalReturned,
        totalPages: response1.data.totalPages || 1,
        hasNextPage: response1.data.hasNextPage || false,
        hasPreviousPage: response1.data.hasPreviousPage || false,

        currentPage: page || 1,

        data: storiesData as Story[],
        page: page || 1,
        perPage: requestedPerPage,
      },
    };

    return correctedResponse;
  } catch {
    return {
      data: {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page || 1,
        page: page || 1,
        perPage: requestedPerPage,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

const PUBLIC_ROUTES = ['/', '/stories', '/travellers'];

export const getMeServer = async (
  pathname?: string
): Promise<UserResponse | null> => {
  if (!pathname) {
    return null;
  }
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(route)
    )
  ) {
    return null;
  }

  const cookieString = await getServerCookies();
  if (!cookieString) return null;

  try {
    const res = await api.get<UserResponse>('/users/current', {
      headers: { Cookie: cookieString },
    });
    return res.data;
  } catch (error) {
    console.error('Помилка getMeServer:', error);
    return null; // не кидаємо помилку на SSR
  }
};

export async function fetchCategoriesServer(): Promise<CategoryResponse> {
  try {
    const { data } = await api.get<CategoryResponse>(`/stories/categories`);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchStoryByIdServer(id: string): Promise<DetailedStory> {
  try {
    const res = await api.get(`/stories/${id}`);
    const storyData = res.data;

    if (!storyData) {
      throw new Error('Story Not Found (дані пусті)');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
}

export interface OwnStoriesResponse {
  stories: Story[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
