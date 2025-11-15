'use client';
import { User } from '@/types/user';
import { nextServer } from './api';
import { StoriesResponse } from '@/types/story';

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthorizationRequest = {
  email: string;
  password: string;
};

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

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post(`/auth/register`, data);
  return {
    ...response.data,
  };
}

export async function loginUser(data: AuthorizationRequest): Promise<User> {
  const response = await nextServer.post(`/auth/login`, data);
  return {
    ...response.data,
  };
}
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/current');
  return data;
};
export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await nextServer.post('/auth/refresh');
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