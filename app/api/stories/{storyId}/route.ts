//api/stories/%7BstoryId%7D/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AxiosError, isAxiosError } from 'axios';

import { api } from '../../api';

// Avoid `any` — use a safe record type for params promoted to a Promise.
// Next's generated types expect a Promise, so make it Promise<Record<string, unknown>>
interface RouteParams {
  params: Promise<Record<string, unknown>>;
}

function logErrorResponse(error: AxiosError) {
  console.error('API Proxy Error Status:', error.response?.status);
  console.error('API Proxy Error Data:', error.response?.data);
}

// -----------------------------------------------------------
// GET /api/stories/[storyId]
// -----------------------------------------------------------
export async function GET(req: NextRequest, ctx: RouteParams) {
  const rawParams = await ctx.params;
  const storyId = String(rawParams?.storyId ?? '').trim();
  const cookieStore = cookies();

  if (!storyId) {
    return NextResponse.json(
      { message: 'Story ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await api.get(`/stories/${storyId}`, {
      // pass cookies from the incoming request so backend can authenticate
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (!isAxiosError(error)) {
      console.error('Non-Axios Error:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || {
        message: 'Server error during GET story details',
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// -----------------------------------------------------------
// PATCH /api/stories/[storyId]
// -----------------------------------------------------------
export async function PATCH(req: NextRequest, ctx: RouteParams) {
  const rawParams = await ctx.params;
  const storyId = String(rawParams?.storyId ?? '').trim();
  const cookieStore = cookies();

  if (!storyId) {
    return NextResponse.json(
      { message: 'Story ID is required' },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();

    const res = await api.patch(`/stories/${storyId}`, formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (!isAxiosError(error)) {
      console.error('Non-Axios Error:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || { message: 'Server error during PATCH' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// -----------------------------------------------------------
// DELETE /api/stories/[storyId]
// -----------------------------------------------------------
export async function DELETE(req: NextRequest, ctx: RouteParams) {
  const rawParams = await ctx.params;
  const storyId = String(rawParams?.storyId ?? '').trim();
  const cookieStore = cookies();

  if (!storyId) {
    return NextResponse.json(
      { message: 'Story ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await api.delete(`/stories/${storyId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // return 204 or the status the upstream returned
    return new NextResponse(null, { status: res.status || 204 });
  } catch (error) {
    if (!isAxiosError(error)) {
      console.error('Non-Axios Error:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || { message: 'Server error during DELETE' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
