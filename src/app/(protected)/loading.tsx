export default function ProtectedLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app text-body">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[var(--color-primary)]" />
        <p className="text-sm text-muted">콘솔 데이터를 불러오는 중입니다…</p>
      </div>
    </div>
  );
}
