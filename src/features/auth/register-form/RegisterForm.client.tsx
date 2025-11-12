'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { register } from '@/entities/user/api/register.client';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';

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
      <Input name="email" type="email" required placeholder="이메일" />
      <Input name="name" required placeholder="이름" />
      <Input name="password" type="password" required placeholder="비밀번호" />
      <label className="flex items-center gap-2 text-sm text-body">
        <Checkbox name="termsAgree" /> 약관에 동의합니다
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" fullWidth isLoading={pending} aria-busy={pending ? 'true' : 'false'}>
        가입하기
      </Button>
    </form>
  );
}
