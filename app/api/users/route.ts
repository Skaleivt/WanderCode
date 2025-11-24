// app/api/users/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../api';
import { logErrorResponse } from '../../../lib/api/api';

interface CookieStoreWithGetAll {
  getAll: () => Array<{ name: string; value: string }>;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = (await cookies()) as unknown as CookieStoreWithGetAll;

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get('perPage') ?? 12);
    const filter = request.nextUrl.searchParams.get('filter') ?? undefined;

    type CookieItem = { name: string; value: string };

    const cookieString = cookieStore
      .getAll()
      .map((c: CookieItem) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await api.get('/users', {
      params: {
        page,
        perPage,
        filter,
      },
      headers: {
        Cookie: cookieString,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
