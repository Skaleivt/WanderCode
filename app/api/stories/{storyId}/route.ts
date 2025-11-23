import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AxiosError, isAxiosError } from 'axios';

import { api } from '../../api';

// ✅ ВЫПРАЎЛЕНЫ ІНТЭРФЕЙС
interface RouteParams {
  params: { storyId: string };
}

function logErrorResponse(error: AxiosError) {
  console.error('API Proxy Error Status:', error.response?.status);
  console.error('API Proxy Error Data:', error.response?.data);
}

// -----------------------------------------------------------
// GET /api/stories/[storyId]
// -----------------------------------------------------------
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { storyId } = params;
  const cookieStore = cookies();

  if (!storyId) {
    return NextResponse.json(
      { message: 'Story ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await api.get(`/stories/${storyId}`, {
      // 💡 Перадача кукі для падтрымання сесіі/аўтарызацыі
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
// PATCH /api/stories/[storyId] (Патэнцыйнае абнаўленне/захаванне)
// -----------------------------------------------------------
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // ✅ Выдалена 'await'
  const { storyId } = params;
  const cookieStore = cookies();

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
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  // ✅ Выдалена 'await'
  const { storyId } = params;
  const cookieStore = cookies();

  try {
    const res = await api.delete(`/stories/${storyId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

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
