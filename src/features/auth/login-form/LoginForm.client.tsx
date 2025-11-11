'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { login } from '@/entities/user/api/login.client';
import { toast } from 'sonner';
import { cn } from '@/shared/ui/utils';

type LoginFormProps = {
  className?: string;
  cardClassName?: string;
};

export default function LoginForm(props: LoginFormProps = {}) {
  const { className, cardClassName } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password }, { remember });
      toast.success('로그인 성공!');
      console.log('Login result:', res);
      // TODO: 성공 후 라우팅/세션 처리
    } catch (err) {
      toast.error('로그인 실패. 이메일 또는 비밀번호를 확인하세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('w-full max-w-md', className)}
    >
      <Card
        className={cn(
          'space-y-8 rounded-[32px] border border-[#E5E7EB] bg-white px-10 py-12 text-left',
          'shadow-[0_25px_80px_rgba(15,23,42,0.12)]',
          cardClassName,
        )}
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <Image
            src="/login-illustration.svg"
            alt="업무 자동화를 돕는 Vibot"
            width={208}
            height={120}
            priority
            className="h-auto w-52"
          />
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[#111826]">Login</h2>
            <p className="text-sm text-[#6B7280]">VIBOT Admin Console에 오신 것을 환영합니다</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-[#111826]">
              이메일
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-10 placeholder-muted"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-semibold text-[#111826]">
              비밀번호
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 placeholder-muted"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(!!checked)}
              />
              <label htmlFor="remember" className="text-sm select-none cursor-pointer">
                로그인 상태 유지
              </label>
            </div>
            <button type="button" className="text-sm text-[var(--color-accent)] hover:underline">
              비밀번호 찾기
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-glow"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
        <div className="space-y-4 text-center">
          <div className="border-t border-[#E5E7EB]" />
          <p className="text-sm text-[var(--color-text-muted)]">
            계정이 없으신가요?{' '}
            <a
              href="/register"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              회원가입하기
            </a>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
