import type { ReactNode } from 'react';
import QueryProvider from '@/shared/lib/query/QueryProvider';

export const metadata = { title: 'Vibot Admin' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900 dark:bg-black dark:text-gray-100">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
