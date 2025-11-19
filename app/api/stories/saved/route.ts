import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const res = await api.get('stories/saved', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    console.log('PROXY DEBUG: Successfully fetched owner stories (200 OK).');
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
