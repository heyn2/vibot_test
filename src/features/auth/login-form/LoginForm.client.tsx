'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <input name="email" type="email" required className="input-base" placeholder="이메일" />
      <input
        name="password"
        type="password"
        required
        className="input-base"
        placeholder="비밀번호"
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={pending}
        aria-busy={pending ? 'true' : 'false'}
      >
        {pending ? '처리 중…' : '로그인'}
      </button>
    </form>
  );
}
