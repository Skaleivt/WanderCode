// lib/api/clientApi.ts
'use client';
import { User } from '@/types/user';
import { StoriesResponse, Story, DetailedStory, Category } from '@/types/story';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export type { StoriesResponse, Story, DetailedStory, Category };

// Axios instance that uses relative '/api' path (proxied by Next)
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// ---- Types for queue and request with retry flag ----
type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

type AxiosRequestWithRetry = AxiosRequestConfig & {
  _retry?: boolean;
};

// ---- Refresh queue handling ----
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ---- Axios interceptor: if 401, try to refresh and retry original request ----
// Note: when calling refresh we use the global axios (not `api`) to avoid triggering this same interceptor.
api.interceptors.response.use(
  (response) => response,
  async (err: unknown) => {
    // Narrow unknown to AxiosError only after checking with axios.isAxiosError
    if (!axios.isAxiosError(err)) {
      return Promise.reject(err);
    }

    const error = err as AxiosError;
    const originalRequest = error?.config as AxiosRequestWithRetry | undefined;

    if (!error?.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // queue the request until refresh finished
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((e) => Promise.reject(e));
    }

    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        // Use global axios to perform refresh so it does not go through this interceptor again
        await axios.post('/api/auth/refresh', null, { withCredentials: true });
        processQueue(null, true);
        resolve(api(originalRequest));
      } catch (refreshError) {
        processQueue(refreshError, null);
        reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    });
  }
);

// ---- API wrappers / helpers ----

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

  const res = await fetch(`/api/stories?${params}`);
  if (!res.ok) throw new Error('Failed to load stories');

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
    // Use global axios for refresh on client to avoid accidental interceptor loops
    const res = await axios.post('/api/auth/refresh', null, {
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

export const fetchStoryById = async (id: string): Promise<DetailedStory> => {
  try {
    const res = await fetch(`/api/stories/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to load story: ${res.status}`);
    }

    const jsonRes = await res.json();

    return jsonRes.data;
  } catch (error) {
    console.error('fetchStoryById error:', error);
    throw new Error('Failed to load story (Client)');
  }
};

export const saveStory = async (id: string) => {
  try {
    const response = await api.post(`/stories/save/${id}`, {});
    return response.data;
  } catch (error: unknown) {
    let message = 'Failed to save story';
    if (error instanceof Error) {
      message = error.message || message;
    }
    throw new Error(message);
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

export interface OwnStoriesProp {
  page: number;
  perPage: number;
  filter: string;
}

export const fetchOwnStoriesClient = async ({
  page,
  perPage,
  filter,
}: OwnStoriesProp) => {
  try {
    const res = await api.get<StoriesResponse>('/stories', {
      params: {
        page,
        perPage,
        ownerId: filter,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export interface SavedStoriesProp {
  page: number;
  perPage: number;
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

export interface SavedStoriesResponse {
  data: OwnStoriesResponse;
}
export async function fetchOwnStories({ page, perPage }: SavedStoriesProp) {
  try {
    const res = await api.get<SavedStoriesResponse>('/stories/saved', {
      params: {
        page,
        perPage,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
