#!/usr/bin/env bash
set -euo pipefail

# === 디렉토리(괄호 경로는 반드시 따옴표) ===
mkdir -p "src/app/(public)/login" "src/app/(public)/register" "src/app/(public)/wait-approval"
mkdir -p "src/app/(protected)/dashboard" "src/app/(protected)/admin/docs" "src/app/(protected)/admin/permissions"
mkdir -p src/app/api/auth/{register,verify-email,refresh}
mkdir -p src/shared/{ui,lib,config,styles,types}
mkdir -p src/features/auth/{login-form,register-form}
mkdir -p src/features/docs/filter-bar
mkdir -p src/entities/{user,document}/{api,model}

# === Root layout ===
cat > src/app/layout.tsx <<'TSX'
import '@/shared/styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Vibot Admin' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900 dark:bg-black dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
TSX

# === PUBLIC ROUTES ===
cat > "src/app/(public)/login/page.tsx" <<'TSX'
export const dynamic = 'force-dynamic';
export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">로그인</h1>
      {/* features/auth/login-form/LoginForm.client.tsx 연결 예정 */}
    </main>
  );
}
TSX

cat > "src/app/(public)/register/page.tsx" <<'TSX'
export const dynamic = 'force-dynamic';
export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">회원가입</h1>
      {/* features/auth/register-form/RegisterForm.client.tsx 연결 예정 */}
    </main>
  );
}
TSX

cat > "src/app/(public)/wait-approval/page.tsx" <<'TSX'
export default function WaitApprovalPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-medium">승인 대기 중입니다</h1>
      <p className="mt-2 text-sm text-gray-600">관리자 승인 후 대시보드 접근이 가능합니다.</p>
    </main>
  );
}
TSX

# === PROTECTED ROUTES ===
cat > "src/app/(protected)/layout.tsx" <<'TSX'
import type { ReactNode } from 'react';
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <section className="min-h-dvh">{children}</section>;
}
TSX

cat > "src/app/(protected)/dashboard/page.tsx" <<'TSX'
export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">대시보드</h1>
      {/* RSC 카드 + 일부 CSR 인터랙션 후속 */}
    </main>
  );
}
TSX

cat > "src/app/(protected)/admin/docs/page.tsx" <<'TSX'
export default function AdminDocsPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">문서</h1>
      {/* RSC 목록 + features/docs/filter-bar/FilterBar.client.tsx */}
    </main>
  );
}
TSX

cat > "src/app/(protected)/admin/permissions/page.tsx" <<'TSX'
export default function AdminPermissionsPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">권한 관리</h1>
      {/* RSC 표 + CSR 인라인 수정 */}
    </main>
  );
}
TSX

# === API ROUTES (stub) ===
cat > src/app/api/auth/register/route.ts <<'TS'
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  // TODO: CSRF/validation + pending 생성
  return NextResponse.json({ userId: 'stub', status: 'PENDING' }, { status: 201 });
}
TS

cat > src/app/api/auth/verify-email/route.ts <<'TS'
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  // TODO: 이메일 토큰 검증
  return new NextResponse(null, { status: 204 });
}
TS

cat > src/app/api/auth/refresh/route.ts <<'TS'
import { NextResponse } from 'next/server';
export async function POST() {
  // TODO: RTR 로직으로 새 토큰 발급
  return new NextResponse(null, { status: 204 });
}
TS

# === MIDDLEWARE ===
cat > src/middleware.ts <<'TS'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const isAuthed = req.cookies.get('access_token'); // TODO: 실제 세션/서명 검증으로 교체

  if (isAuthed && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }
  if (!isAuthed && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', origin));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/login', '/register', '/dashboard', '/admin/:path*'] };
TS

# === SHARED CONFIG ===
cat > src/shared/config/routes.ts <<'TS'
export const ROUTES = {
  login: '/login',
  register: '/register',
  waitApproval: '/wait-approval',
  dashboard: '/dashboard',
  adminDocs: '/admin/docs',
  adminPermissions: '/admin/permissions',
} as const;
TS

cat > src/shared/config/query-keys.ts <<'TS'
export const QK = {
  dashboard: () => ['dashboard'] as const,
  docs: (f: object) => ['docs', 'list', f] as const,
  docDetail: (id: string) => ['docs', 'detail', id] as const,
};
TS

cat > src/shared/config/tags.ts <<'TS'
export const TAG = {
  dashboard: 'dashboard',
  docs: 'docs',
  doc: (id: string) => `doc:${id}`,
} as const;
TS

cat > src/shared/config/env.ts <<'TS'
export const ENV = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
TS

# === SHARED LIB ===
cat > src/shared/lib/api-client.ts <<'TS'
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_BASE}\${path}\`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
    ...init,
  });

  if (res.status === 401) {
    const r = await fetch(\`\${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh\`, {
      method: 'POST',
      credentials: 'include',
    });
    if (r.ok) {
      const retry = await fetch(\`\${process.env.NEXT_PUBLIC_API_BASE}\${path}\`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        cache: 'no-store',
        ...init,
      });
      if (!retry.ok) throw new Error(await retry.text());
      return retry.json() as Promise<T>;
    }
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
TS

# === SHARED UI PRIMITIVES ===
cat > src/shared/ui/button.tsx <<'TSX'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean };
export default function Button({ pending, className = '', children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ' +
        'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ' +
        className
      }
      aria-busy={pending ? 'true' : 'false'}
    >
      {pending ? '처리 중…' : children}
    </button>
  );
}
TSX

# === SHARED STYLES ===
cat > src/shared/styles/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

# === FEATURES (auth) ===
cat > src/features/auth/register-form/RegisterForm.client.tsx <<'TSX'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/button';
import { ROUTES } from '@/shared/config/routes';

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true); setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email')),
          password: String(form.get('password')),
          name: String(form.get('name')),
          termsAgree: Boolean(form.get('termsAgree')),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.replace(ROUTES.waitApproval);
    } catch (err: any) {
      setError(err?.message ?? '제출에 실패했습니다.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="email" type="email" required className="w-full border p-2 rounded" placeholder="이메일" />
      <input name="name" required className="w-full border p-2 rounded" placeholder="이름" />
      <input name="password" type="password" required className="w-full border p-2 rounded" placeholder="비밀번호" />
      <label className="flex items-center gap-2 text-sm">
        <input name="termsAgree" type="checkbox" /> 약관에 동의합니다
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button pending={pending} className="w-full">가입하기</Button>
    </form>
  );
}
TSX

cat > src/features/auth/login-form/LoginForm.client.tsx <<'TSX'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/button';
import { ROUTES } from '@/shared/config/routes';

export default function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true); setError(null);
    const form = new FormData(e.currentTarget);
    try {
      // TODO: /api/auth/login 구현 후 연동
      await new Promise(r => setTimeout(r, 400));
      router.replace(ROUTES.dashboard);
    } catch (err: any) {
      setError(err?.message ?? '로그인에 실패했습니다.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="email" type="email" required className="w-full border p-2 rounded" placeholder="이메일" />
      <input name="password" type="password" required className="w-full border p-2 rounded" placeholder="비밀번호" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button pending={pending} className="w-full">로그인</Button>
    </form>
  );
}
TSX

# === ENTITIES (types) ===
cat > src/entities/user/model/types.ts <<'TS'
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  status: 'PENDING' | 'ACTIVE';
};
TS

cat > src/entities/document/model/types.ts <<'TS'
export type DocumentMeta = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  author: string;
};
TS

echo "✅ 파일 생성 완료"
