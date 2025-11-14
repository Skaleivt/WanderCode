import { cookies } from 'next/headers';
import { nextServer } from './api';
import { StoriesResponse } from '@/types/story';
import { AxiosResponse } from 'axios';

async function getServerCookies(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const res = await nextServer.get('/auth/session', {
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
  sort,
}: {
  page?: number;
  perPage?: string;
  filter?: string;
  sort?: string;
}): Promise<StoriesResponse> {
  const response = await nextServer.get<StoriesResponse>(`/stories`, {
    params: {
      perPage,
      page,
      filter,
      sort,
    },
    // headers: {
    //   Cookie: await getServerCookies(),
    // },
  });

  return {
    ...response.data,
  };
}
