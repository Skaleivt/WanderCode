import { NextResponse } from 'next/server';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

type Props = {
  params: Promise<{ travellerId: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { travellerId } = await params;
    const res = await api(`/users/${travellerId}`);
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
