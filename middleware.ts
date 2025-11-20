import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const PUBLIC_ROUTES = [
  '/', // головна сторінка
  '/auth/login',
  '/auth/register',
  '/stories',
  '/travellers',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Пропускаємо системні файли
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Публічні маршрути не потребують авторизації
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Якщо accessToken є — пропускаємо
  if (accessToken) return NextResponse.next();

  // Якщо токена нема, але є refreshToken — пробуємо оновити сесію
  if (refreshToken) {
    const session = await checkServerSession();
    const setCookie = session.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path || '/',
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
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

  // Якщо немає токенів або рефреш не пройшов — редірект на логін
  return NextResponse.redirect(new URL('/auth/login', req.url));
}

export const config = {
  matcher: [
    '/profile/saved',
    '/profile/own',
    '/stories/create',
    '/stories/edit',
    '/api/:path*',
  ],
};
