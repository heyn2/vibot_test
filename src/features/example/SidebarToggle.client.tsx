'use client';

import { useUiStore } from '@/shared/model/ui.store';

export default function SidebarToggle() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Sidebar: {sidebarOpen ? 'Open' : 'Closed'}
      </span>
      <button
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-black"
        onClick={toggleSidebar}
        type="button"
      >
        Toggle
      </button>
    </div>
  );
}
