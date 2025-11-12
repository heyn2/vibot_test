import type { ReactNode } from 'react';
import QueryProvider from '@/shared/lib/query/QueryProvider';

export const metadata = { title: 'Vibot Admin' };

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
