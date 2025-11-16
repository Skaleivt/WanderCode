// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { nextServer } from './api';
import { StoriesResponse, Story } from '@/types/story';
import { QueryFunctionContext } from '@tanstack/react-query';

// --- NEW TYPE FOR useInfiniteQuery ---
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

// --- UPDATED FUNCTION: returns StoriesResponse ---
export async function fetchAllStoriesClient({
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

// --- NEW FUNCTION FOR useInfiniteQuery ---
export async function fetchStoriesPage(
  context: QueryFunctionContext<readonly unknown[], number>
): Promise<StoriesPage> {
  const pageParam = (context.pageParam ?? 1) as number;

  const response = await fetchAllStoriesClient({
    page: pageParam,
    perPage: ITEMS_PER_PAGE,
  });

  const { totalPages, page, data } = response.data;

  const nextPage = page < totalPages ? page + 1 : undefined;

  return {
    stories: data,
    nextPage: nextPage,
  };
}

// ... existing functions

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
