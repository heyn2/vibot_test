Vibot Admin — Next.js 16 + Tailwind v4 + TypeScript + React Query + Zustand

이 문서는 이 스택을 처음 쓰는 팀원을 위한 실전 가이드입니다. 핵심 원칙은 다음과 같습니다.

- 외부 백엔드 직결만 사용합니다(baseURL = NEXT_PUBLIC_API_BASE)
- UI는 엔티티 API만 호출합니다(axios/fetch 직접 호출 금지)
- 모킹은 엔티티 레이어에서 환경 변수로 전환합니다(NEXT_PUBLIC_USE_MOCK)

## Quick Start

- Requirements
  - Node >= 18.18 (package.json engines 참조)
  - npm 사용

- Environment
  - `.env.example`를 참고해 루트에 `.env.local` 생성
  - 외부 백엔드 루트 설정(슬래시 없이):
    - `NEXT_PUBLIC_API_BASE=http://localhost:4000`
  - 모킹 토글(선택):
    - `NEXT_PUBLIC_USE_MOCK=true|false`

- Run
  - `npm install`
  - `npm run dev` → 브라우저 `http://localhost:3000`

## Project Structure(핵심)

- App Router
  - `src/app/layout.tsx` — 전역 HTML 스켈레톤 + 글로벌 CSS 1회 임포트
  - `src/app/(public)/login/page.tsx`, `src/app/(public)/register/page.tsx` — 공개 라우트
  - `src/app/(protected)/layout.tsx` — 보호 레이아웃(React Query Provider)
  - `src/app/(protected)/dashboard/page.tsx` — 대시보드
  - `src/middleware.ts` — 쿠키 기반 접근 가드

- Shared(공용)
  - `src/shared/lib/axios.ts` — Axios 인스턴스(baseURL, withCredentials, 401 refresh)
  - `src/shared/lib/query/QueryProvider.tsx` — React Query Provider
  - `src/shared/config/env.ts` — ENV 래퍼(NEXT_PUBLIC_API_BASE, NEXT_PUBLIC_USE_MOCK)
  - `src/shared/config/query-keys.ts` — 쿼리 키 헬퍼(QK.\*)
  - `src/shared/styles/globals.css` — Tailwind v4 글로벌 스타일
  - `src/shared/ui/button.tsx` — 공용 버튼
  - `src/shared/model/ui.store.ts` — Zustand 전역 UI 상태

- Entities(도메인)
  - `src/entities/user/model/types.ts` — User 타입
  - `src/entities/user/api/login.client.ts` — 로그인 API(모킹 토글 지원)
  - `src/entities/user/api/register.client.ts` — 회원가입 API(모킹 토글 지원)

- Features(유즈케이스)
  - `src/features/auth/login-form/LoginForm.client.tsx` — 로그인 폼(UI + 엔티티 호출)
  - `src/features/auth/register-form/RegisterForm.client.tsx` — 회원가입 폼(UI + 엔티티 호출)
  - `src/features/example/*` — 상태/쿼리 데모(선택)

## Coding Conventions

- Import 경로: `@/*` alias 사용, 상위 상대경로(`../..`) 금지(린트로 강제)
- FSD 방향: shared → entities → features → app 권장
- 에러/로딩 UX: 필요 시 각 그룹에 `loading.tsx`/`error.tsx` 추가
- 커밋/포맷: pre-commit에서 `npx lint-staged` 실행

## Networking(Axios)

- 인스턴스: `src/shared/lib/axios.ts`
  - `baseURL=process.env.NEXT_PUBLIC_API_BASE`
  - `withCredentials=true`(쿠키 인증 시 필요)
  - 401 응답 시 `/auth/refresh` 호출 후 원요청 재시도

- 엔티티만 호출(중요)
  - UI/페이지에서는 axios/fetch 직접 호출 금지
  - 예: `registerUser()`/`login()` 같은 엔티티 함수만 사용

- 예시

```ts
// src/entities/user/api/register.client.ts
import http from '@/shared/lib/axios';

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
  company?: string;
  department?: string;
  phone?: string;
  termsAgree: boolean;
  csrf?: string;
};
export type RegisterResp = { userId: string; status: 'PENDING' };

export async function registerUser(body: RegisterBody) {
  const { data } = await http.post<RegisterResp>('/auth/register', body);
  return data;
}
```

## Data & State

- React Query(@tanstack/react-query)
  - Provider: `src/app/(protected)/layout.tsx`
  - 키: `src/shared/config/query-keys.ts`
  - 추천 전역 옵션(원하면 `QueryProvider`에 설정): `retry: false`, `refetchOnWindowFocus: false`, `staleTime: 5000`
  - 무효화 예:
    ```ts
    import { useQueryClient } from '@tanstack/react-query';
    import { QK } from '@/shared/config/query-keys';
    const qc = useQueryClient();
    qc.invalidateQueries({ queryKey: QK.dashboard() });
    ```

- Zustand(전역 UI 상태)
  - 스토어: `src/shared/model/ui.store.ts`
  - 사용 예:
    ```ts
    import { useUiStore } from '@/shared/model/ui.store';
    const open = useUiStore((s) => s.sidebarOpen);
    const toggle = useUiStore((s) => s.toggleSidebar);
    ```

## Styling(Tailwind v4)

- 글로벌 스타일 1회 임포트: `src/app/layout.tsx`
- 유틸리티 클래스 중심, 공통 UI는 `src/shared/ui/*`로 추출
- PostCSS 설정: `postcss.config.mjs`

## Scripts

- `npm run dev` — 개발 서버 실행
- `npm run build` — 프로덕션 빌드
- `npm run start` — 빌드 산출물 실행
- `npm run lint` — ESLint 실행
- `npm run format` — Prettier 포맷 적용

## Environment

- `.env.example`를 참고해 `.env.local` 작성
- 외부 API:
  - `NEXT_PUBLIC_API_BASE=https://api.example.com`(또는 `http://localhost:4000`)
- 모킹 토글:
  - `NEXT_PUBLIC_USE_MOCK=true` → 엔티티 레이어에서 가짜 응답
  - `NEXT_PUBLIC_USE_MOCK=false` → 실서버 호출
- 쿠키 인증 시 서버 설정 주의:
  - `Access-Control-Allow-Origin`에 FE 오리진 지정
  - `Access-Control-Allow-Credentials: true`
  - 쿠키: `SameSite=None; Secure`(+ Domain)

## API Strategy(고정)

- 이 프로젝트는 “외부 백엔드 직접 호출”만 사용합니다.
- 프록시/내부 `/api` 라우트는 사용하지 않습니다.
- 백엔드 미준비 시 `NEXT_PUBLIC_USE_MOCK=true`로 UI/상태 먼저 개발

## Troubleshooting

- 경로 모듈 인식 오류(`Cannot find module '@/...'`)
  - 파일 저장 후 에디터의 TS 서버 재시작(명령팔레트: TypeScript: Restart TS server)
  - 필요 시 dev 서버 재시작
- 4xx/5xx 에러가 계속 발생
  - 외부 API 미준비 시 정상. `NEXT_PUBLIC_USE_MOCK=true`로 모킹
  - 연결 시 `.env.local`의 `NEXT_PUBLIC_API_BASE` 확인
- 쿠키가 붙지 않음
  - axios는 withCredentials=true. 서버 CORS/쿠키 설정 확인(위 참고)
- Node 버전 불일치
  - `package.json`의 `engines`와 로컬 버전 맞추기
