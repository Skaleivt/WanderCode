import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const publicRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const pathname = req.nextUrl.pathname;

  const isPublic = publicRoutes.some((url) => pathname.startsWith(url));
  const isPrivate = privateRoutes.some((url) => pathname.startsWith(url));

  if (isPrivate && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
