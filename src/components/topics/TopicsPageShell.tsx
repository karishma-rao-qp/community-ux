'use client';

import { TopicsSubNav } from '@/components/topics/TopicsSubNav';

type TopicsPageShellProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function TopicsPageShell({ actions, children }: TopicsPageShellProps) {
  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Topics</h1>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Help"
            title="Help"
          >
            <span className="wm-help-outline text-lg" />
          </button>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div className="flex flex-1 min-h-0">
        <TopicsSubNav />
        <div className="flex-1 min-w-0 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
