import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/stories'];
const publicRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Публічні маршрути доступні всім
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Для приватних маршрутів перевіряємо токени
  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        // Перевіряємо сесію тільки для приватних маршрутів
        const data = await checkServerSession();
        const setCookie = data.headers['set-cookie'];
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed['expires']),
            };
            if (parsed.accessToken)
              cookieStore.set('accessToken', parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set('refreshToken', parsed.refreshToken, options);
          }
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
        }
      }
      // Якщо немає токенів або сесія не вдалася — редірект на /sign-in
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // accessToken є — доступ дозволено
    return NextResponse.next();
  }

  // Інші маршрути доступні без перевірки
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/auth/login', '/auth/register'],
};
