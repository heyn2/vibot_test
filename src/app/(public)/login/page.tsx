import LoginForm from '@/features/auth/login-form/LoginForm.client';
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">로그인</h1>
      <LoginForm />
    </main>
  );
}
