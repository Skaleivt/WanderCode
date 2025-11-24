import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const nextUrl = request.nextUrl.searchParams.get('next') || '/';

    if (!refreshToken || !sessionId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const apiRes = await api.post('/auth/refresh', null, {
      headers: {
        Cookie: `refreshToken=${refreshToken}; sessionId=${sessionId}`,
      },
      withCredentials: true,
    });

    const setCookie = apiRes.headers['set-cookie'];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const res = NextResponse.redirect(new URL(nextUrl, request.url));

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken)
          res.cookies.set('accessToken', parsed.accessToken, {
            httpOnly: true,
            path: '/',
          });
        if (parsed.refreshToken)
          res.cookies.set('refreshToken', parsed.refreshToken, {
            httpOnly: true,
            path: '/',
          });
        if (parsed.sessionId)
          res.cookies.set('sessionId', parsed.sessionId, {
            httpOnly: true,
            path: '/',
          });
      }

      return res;
    }

    return NextResponse.redirect(new URL(nextUrl, request.url));
  } catch {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
