import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');

    const res = await api.get('stories/saved', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        page,
        perPage,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
