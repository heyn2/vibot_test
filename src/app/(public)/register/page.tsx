import RegisterForm from '@/features/auth/register-form/RegisterForm.client';
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">회원가입</h1>
      <RegisterForm />
    </main>
  );
}
