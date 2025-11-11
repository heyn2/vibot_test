import SidebarToggle from '@/features/example/SidebarToggle.client';
import DashboardStats from '@/features/example/DashboardStats.client';

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">대시보드</h1>
      <SidebarToggle />
      <DashboardStats />
    </main>
  );
}
