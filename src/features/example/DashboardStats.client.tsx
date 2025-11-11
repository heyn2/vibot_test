'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/shared/config/query-keys';

type Stats = { users: number; docs: number };

async function fetchStats(): Promise<Stats> {
  // 샘플: 실제 API가 준비되면 axios/http 호출로 교체
  return Promise.resolve({ users: 12, docs: 34 });
}

export default function DashboardStats() {
  const qc = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: QK.dashboard(),
    queryFn: fetchStats,
    staleTime: 10_000,
  });

  return (
    <div className="rounded-md border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">통계</h2>
        <span className="text-xs text-zinc-500">{isFetching ? '갱신 중…' : '최신'}</span>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-600">불러오는 중…</p>
      ) : (
        <div className="flex gap-6 text-sm">
          <div>
            사용자: <b>{data?.users}</b>
          </div>
          <div>
            문서: <b>{data?.docs}</b>
          </div>
        </div>
      )}
      <div className="mt-3">
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          onClick={() => qc.invalidateQueries({ queryKey: QK.dashboard() })}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
