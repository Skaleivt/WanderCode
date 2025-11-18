// app/api/users/saved/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { storyId } = await req.json();

    if (!storyId) {
      return NextResponse.json(
        { message: 'Story ID is required' },
        { status: 400 }
      );
    }
    await api.post(
      '/users/saved',
      { storyId },
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

    return NextResponse.json(
      { message: 'Story added successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      logErrorResponse(error.response.data);

      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { storyId } = await req.json();

    if (!storyId) {
      return NextResponse.json(
        { message: 'Story ID is required' },
        { status: 400 }
      );
    }

    await api.delete('/users/saved', {
      data: { storyId },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(
      { message: 'Story removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      logErrorResponse(error.response.data);

      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
