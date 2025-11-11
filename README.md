Vibot Admin — Next.js 16 + Tailwind v4 + TS + React Query + Zustand

## Getting Started

Requirements

- Node >= 18.18 (package.json engines 참조)
- npm (or your team’s package manager)

Environment

- 복제 후 `.env.example`를 참고해 `.env.local` 파일을 만듭니다.
- 백엔드가 준비되지 않았다면 `NEXT_PUBLIC_API_BASE`는 비워둡니다. 이 경우 내부 Next API(`/api/...`)를 사용합니다.
- 백엔드 연결 시 `NEXT_PUBLIC_API_BASE`를 API 서버의 public URL로 설정하세요.

Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Project Structure

- `src/app` — App Router. `(public)`/`(protected)` 라우트 그룹과 내부 API(`/api`) 포함
- `src/shared` — 공용 레이어(lib, ui, styles, config, model)
- `src/entities` — 도메인 엔티티(API, model/types)
- `src/features` — 유즈케이스 단위의 UI/로직 조합

Conventions

- 글로벌 CSS는 루트 레이아웃에서 1회 임포트
- 네트워킹: axios 인스턴스(`src/shared/lib/axios.ts`) 사용. 401 시 `/api/auth/refresh` 호출 후 재시도
- 폼/기능에서 엔티티 API를 통해 호출(직접 fetch 지양)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
