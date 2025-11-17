// lib/api/serverApi.ts
import { cookies } from 'next/headers';
import { api } from './api';
import { Category, StoriesResponse } from '@/types/story';
import { AxiosResponse } from 'axios';
import { User } from '@/types/user';

async function getServerCookies(): Promise<string> {
  // 💡 ВЫПРАЎЛЕННЕ: Карэктны выклік cookies() у асінхроннай функцыі
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll() // Дадаем тыпізацыю для пазбягання памылкі 7031
    .map(
      (cookie: { name: string; value: string }) =>
        `${cookie.name}=${cookie.value}`
    )
    .join('; '); // ДЭБАГ: Паказвае, што Next.js Server адпраўляе на Бэкэнд

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
      // Перадаем Cookie, каб бачыць захаваныя гісторыі, калі карыстальнік аўтэнтыфікаваны
      Cookie: await getServerCookies(),
    },
  });

  return {
    ...response.data,
  };
}

export const getMeServer = async (): Promise<User | null> => {
  try {
    // Выклік, які прыводзіць да памылкі 401, калі Cookie несапраўдныя
    const res = await api.get<User>('/users/current', {
      headers: {
        Cookie: await getServerCookies(), // Cookie лагуюцца ў гэтай функцыі
      },
    });

    // Калі атрымалі 200 OK
    console.log('SERVER DEBUG: User fetched successfully (200 OK).');

    return res.data;
  } catch (error) {
    // Гэта лагаванне паведаміць нам пра памылку 401
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
  const response = await api.get<CategoryResponse>(`/stories/categories`);

  return {
    ...response.data,
  };
}
