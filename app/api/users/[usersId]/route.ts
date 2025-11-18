import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';
import { AxiosError } from 'axios';

interface RouteParams {
  params: { usersId: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { usersId } = await params;

  if (!usersId) {
    return NextResponse.json(
      { message: 'Traveller ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await api.get(`/users/${usersId}`);

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    const axiosError = error as AxiosError;
    logErrorResponse(axiosError);

    return NextResponse.json(
      axiosError.response?.data || {
        message: 'Server error during GET traveller profile',
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
