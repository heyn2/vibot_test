import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 개발 중엔 미들웨어 통과
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const { pathname, origin } = req.nextUrl;
  const isAuthed = req.cookies.get('access_token');

  if (isAuthed && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }
  if (!isAuthed && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', origin));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/login', '/register', '/dashboard', '/admin/:path*'] };
