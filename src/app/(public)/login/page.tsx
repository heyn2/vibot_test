import type { Metadata } from 'next';
import LoginForm from '@/features/auth/login-form/LoginForm.client';

export const metadata: Metadata = {
  title: '로그인 | VIBOT Admin',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F4F6FB] px-4 py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
