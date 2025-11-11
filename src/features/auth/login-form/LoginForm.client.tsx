'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { login } from '@/entities/user/api/login.client';

export default function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await login({
        email: String(form.get('email')),
        password: String(form.get('password')),
      });
      router.replace(ROUTES.dashboard);
    } catch (err: unknown) {
      const message = err instanceof Error && err.message ? err.message : '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        required
        className="w-full border p-2 rounded"
        placeholder="이메일"
      />
      <input
        name="password"
        type="password"
        required
        className="w-full border p-2 rounded"
        placeholder="비밀번호"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button pending={pending} className="w-full">
        로그인
      </Button>
    </form>
  );
}
