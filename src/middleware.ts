// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'access_token';
const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true';
const PUBLIC = new Set<string>(['/login', '/register', '/wait-approval']);
const PROTECTED_PREFIXES = ['/dashboard', '/admin'] as const;

export function middleware(req: NextRequest) {
  if (BYPASS_AUTH) return NextResponse.next();

  const url = req.nextUrl;
  const origin = url.origin;

  // ✅ 가공하지 않은 원본 경로+쿼리(소문자 변환/슬래시 제거 X)
  const rawPathWithQuery = url.pathname + url.search;

  // 정규화는 "매칭용"으로만 사용 (next 파라미터엔 절대 쓰지 않음)
  const pathForMatch = normalize(url.pathname);

  const hasSession = req.cookies.has(AUTH_COOKIE_NAME);
  const isPublic = PUBLIC.has(pathForMatch);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathForMatch.startsWith(p));

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  if (!hasSession && isProtected) {
    const loginUrl = new URL('/login', origin);
    // ✅ 원본 경로 그대로 보존 (예: /admin/docs?tab=permissions)
    if (pathForMatch !== '/login') {
      loginUrl.searchParams.set('next', rawPathWithQuery);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

function normalize(path: string) {
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path.toLowerCase();
}

export const config = {
  // ✅ 하위 경로까지 확실히 포함
  matcher: ['/login', '/register', '/wait-approval', '/dashboard/:path*', '/admin/:path*'],
};
