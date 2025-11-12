'use client';

import { useEffect } from 'react';

type ProtectedErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProtectedError({ error, reset }: ProtectedErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-app text-body">
      <div className="space-y-4 rounded-2xl border border-divider bg-surface p-8 shadow-card text-center max-w-md">
        <h2 className="text-xl font-semibold">콘솔을 불러오지 못했습니다</h2>
        <p className="text-sm text-muted">
          잠시 후 다시 시도하거나 문제가 계속된다면 관리자에게 문의해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-[#111826]"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
