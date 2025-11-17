import { NextResponse } from 'next/server';

import { api } from '../../api';

export async function GET() {
  try {
    const { data } = await api.get('/stories/categories');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
