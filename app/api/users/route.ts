// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../api';
import { logErrorResponse } from '../../../lib/api/api';
/**
 * Обробляє GET-запити до маршруту /api/users
 * Цей обробник виступає проксі між кліентом і вашим бекендом.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get('perPage') ?? 12);
    const filter = request.nextUrl.searchParams.get('filter') ?? undefined; // Зменены выклік: выкарыстоўваем api замест api

    const res = await api.get('/users', {
      params: {
        page,
        perPage,
        filter,
      },
      headers: {
        // Перадача кукаў для аўтэнтыфікацыі на бекэндзе
        Cookie: cookieStore.toString(),
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
