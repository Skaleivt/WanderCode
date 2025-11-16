// app/api/stories/[storyId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { nextServer } from '@/lib/api/api';

interface RouteParams {
  params: Promise<{ storyId: string }>;
}

// Helper to compile all cookies into a single string for the external API call
async function getServerCookiesString(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

// Generic error logging
function logErrorResponse(error: AxiosError) {
  console.error('API Proxy Error Status:', error.response?.status);
  console.error('API Proxy Error Data:', error.response?.data);
}

// GET /api/stories/[storyId]
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { storyId } = await params;

  try {
    const res = await nextServer.get(`/stories/${storyId}`, {
      headers: {
        Cookie: await getServerCookiesString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || { message: 'Server error during GET' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// PATCH /api/stories/[storyId]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { storyId } = await params;

  try {
    const formData = await req.formData();

    const res = await nextServer.patch(`/stories/${storyId}`, formData, {
      headers: {
        Cookie: await getServerCookiesString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || { message: 'Server error during PATCH' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// DELETE /api/stories/[storyId]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { storyId } = await params;

  try {
    const res = await nextServer.delete(`/stories/${storyId}`, {
      headers: {
        Cookie: await getServerCookiesString(),
      },
    });

    return new NextResponse(null, { status: res.status || 204 });
  } catch (error) {
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || { message: 'Server error during DELETE' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
