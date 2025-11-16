// import { NextResponse } from 'next/server';
// import { api } from '../api';
// import { cookies } from 'next/headers';
// import { isAxiosError } from 'axios';
// import { logErrorResponse } from '../_utils/utils';

// export async function GET() {
//   try {
//     const cookieStore = await cookies();

//     const res = await api('/stories/categories', {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });

//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.status }
//       );
//     }

//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api'; 
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/categories', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    console.error('Categories error:', err);
    return NextResponse.json(
      { error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}