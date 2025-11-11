'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { register } from '@/entities/user/api/register.client';

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await register({
        email: String(form.get('email')),
        password: String(form.get('password')),
        name: String(form.get('name')),
        termsAgree: Boolean(form.get('termsAgree')),
      });
      router.replace(ROUTES.waitApproval);
    } catch (err: unknown) {
      const message = err instanceof Error && err.message ? err.message : '제출에 실패했습니다.';
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
      <input name="name" required className="w-full border p-2 rounded" placeholder="이름" />
      <input
        name="password"
        type="password"
        required
        className="w-full border p-2 rounded"
        placeholder="비밀번호"
      />
      <label className="flex items-center gap-2 text-sm">
        <input name="termsAgree" type="checkbox" /> 약관에 동의합니다
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button pending={pending} className="w-full">
        가입하기
      </Button>
    </form>
  );
}
