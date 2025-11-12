'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { login } from '@/entities/user/api/login.client';

// 스타일은 최소화(테스트 독립). 필요 시 기존 UI 컴포넌트로 교체 가능.
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password }, { remember });
      if (res) toast.success('로그인 성공!');
      // next 파라미터로 복귀 (없으면 /dashboard)
      const next = searchParams.get('next') || '/dashboard';
      router.replace(next);
    } catch (err) {
      console.error(err);
      toast.error('로그인 실패. 이메일 또는 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-center text-xl font-semibold mb-6">로그인</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-base font-medium">
                이메일
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vibot.com"
                  className="h-10 w-full rounded-md border border-[#E5E7EB] bg-[#F5F6F8] px-3 pl-10 text-base outline-none"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-base font-medium">
                비밀번호
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-md border border-[#E5E7EB] bg-[#F5F6F8] px-3 pl-10 text-base outline-none"
                  required
                />
              </div>
            </div>

            {/* 로그인 상태 유지 + 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember"
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
              >
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.currentTarget.checked)}
                  className="h-4 w-4 rounded-[4px] border border-[#E5E7EB] bg-[#F5F6F8]"
                />
                {/* 테스트와 동일한 라벨 문구 */}
                로그인 상태 유지
              </label>

              <button type="button" className="text-sm text-[#1846F2] hover:underline">
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-[#FFE812] hover:opacity-90 text-[#111827] font-medium transition-opacity disabled:opacity-60"
            >
              {loading ? (
                '로그인 중...'
              ) : (
                <span className="inline-flex items-center justify-center">
                  로그인 <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
