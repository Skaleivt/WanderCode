// app/api/stories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const filter = request.nextUrl.searchParams.get('filter') ?? undefined;
    const sortField =
      request.nextUrl.searchParams.get('sortField') ?? undefined;
    const sortOrder =
      request.nextUrl.searchParams.get('sortOrder') ?? undefined;

    const res = await api('/stories', {
      params: {
        page,
        perPage: 3,
        filter,
        sortField,
        sortOrder,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const formData = await request.formData();
    const res = await api.post('/stories', formData, {
      headers: {
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
