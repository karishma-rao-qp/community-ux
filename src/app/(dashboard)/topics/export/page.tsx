'use client';

import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { TopicsPageShell } from '@/components/topics/TopicsPageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { getActiveTopics } from '@/services/topic-category-translations';
import { formatDateTime } from '@/data/mock-utils';

const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuCard = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuCard })),
  { ssr: false }
);

export default function ExportTopicsPage() {
  const { showToast } = useWuShowToast();
  const topicCount = getActiveTopics().length;

  function handleExportCsv() {
    showToast({
      message: `Exported ${topicCount} topics to CSV`,
      variant: 'success',
    });
  }

  function handleExportExcel() {
    showToast({
      message: `Exported ${topicCount} topics to Excel`,
      variant: 'success',
    });
  }

  return (
    <TopicsPageShell>
      <div className="p-6">
        <WuCard rounded className="p-6 max-w-lg">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Export topics</h2>
          <p className="text-sm text-gray-600 mb-6">
            Download all active topics including metadata, engagement counts, and category
            assignments.
          </p>
          <div className="flex items-center gap-3">
            <WuButton variant="secondary" onClick={handleExportCsv}>
              <span className="wm-download" /> Export CSV
            </WuButton>
            <WuButton variant="secondary" onClick={handleExportExcel}>
              <span className="wm-download" /> Export Excel
            </WuButton>
          </div>
        </WuCard>

        {topicCount === 0 && (
          <div className="mt-8">
            <EmptyState
              icon="wm-download"
              title="Nothing to export"
              description="Add topics first, then return here to export them."
            />
          </div>
        )}
      </div>
    </TopicsPageShell>
  );
}
