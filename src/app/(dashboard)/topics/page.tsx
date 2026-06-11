'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { IWuTableColumnDef } from '@npm-questionpro/wick-ui-lib';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { EmptyState } from '@/components/ui/EmptyState';
import { TopicsPageShell } from '@/components/topics/TopicsPageShell';
import { TopicFormModal } from '@/components/topics/TopicFormModal';
import type { Topic } from '@/data/mock-topic-categories';
import { formatDateTime } from '@/data/mock-utils';
import {
  getActiveTopics,
  getTopicCategories,
  getTopicCategoryById,
} from '@/services/topic-category-translations';

const WuTable = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuTable })),
  { ssr: false }
);
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuInput = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuInput })),
  { ssr: false }
);

function StatusLabel({ status }: { status: Topic['status'] }) {
  const label = status === 'draft' ? 'Draft' : 'Active';
  return <span className="text-sm text-gray-800">{label}</span>;
}

export default function AllTopicsPage() {
  const { showToast } = useWuShowToast();
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Topic[]>([]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const topics = useMemo(() => {
    void refreshKey;
    return getActiveTopics();
  }, [refreshKey]);

  const categoryMap = useMemo(() => {
    void refreshKey;
    const map = new Map<string, string>();
    getTopicCategories().forEach((c) => map.set(c.id, c.title));
    return map;
  }, [refreshKey]);

  const columns: IWuTableColumnDef<Topic>[] = [
    {
      accessorKey: 'title',
      header: 'Topic',
      filterable: true,
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created by',
      filterable: true,
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.createdBy}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date/Time',
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      filterable: true,
      cell: ({ row }) => <StatusLabel status={row.original.status} />,
    },
    {
      accessorKey: 'likes',
      header: 'Likes',
      headerAlign: 'right',
      cellAlign: 'right',
      cell: ({ row }) => row.original.likes,
    },
    {
      accessorKey: 'dislikes',
      header: 'Dislikes',
      headerAlign: 'right',
      cellAlign: 'right',
      cell: ({ row }) => row.original.dislikes,
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
      headerAlign: 'right',
      cellAlign: 'right',
      cell: ({ row }) => row.original.comments,
    },
    {
      accessorKey: 'categoryId',
      header: 'Category',
      filterable: true,
      cell: ({ row }) => {
        const category =
          categoryMap.get(row.original.categoryId) ??
          getTopicCategoryById(row.original.categoryId)?.title ??
          '—';
        return <span className="text-sm text-gray-700">{category}</span>;
      },
    },
  ];

  function handleSummarize() {
    showToast({
      message: 'Topic summary is being generated',
      variant: 'success',
    });
  }

  return (
    <TopicsPageShell
      actions={
        <>
          <button
            type="button"
            onClick={handleSummarize}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <span className="wm-download text-base" />
            Summarize topics
          </button>
          <WuButton onClick={() => setIsCreateOpen(true)}>
            <span className="wm-add" /> Add topic
          </WuButton>
        </>
      }
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <WuInput
            variant="outlined"
            placeholder="Search by topic name"
            Icon={<span className="wm-search" />}
            iconPosition="left"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md flex-1"
          />
          <button
            type="button"
            className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            aria-label="Filter topics"
            title="Filter"
            onClick={() =>
              showToast({ message: 'Filters coming soon', variant: 'success' })
            }
          >
            <span className="wm-filter-list text-lg" />
          </button>
        </div>

        <WuTable
          data={topics as unknown[]}
          columns={columns as unknown as IWuTableColumnDef<unknown>[]}
          variant="striped"
          sort={{ enabled: true }}
          filterText={search}
          rowSelection={{
            isEnabled: true,
            selectedRows: selectedRows as unknown[],
            onRowSelect: (rows) =>
              setSelectedRows(rows as Topic[] | ((prev: Topic[]) => Topic[])),
            rowUniqueKey: 'id',
          }}
          NoDataContent={
            <EmptyState
              icon="wm-forum"
              title="No topics found"
              description="Create a topic or adjust your search."
              action={
                <WuButton onClick={() => setIsCreateOpen(true)}>Add topic</WuButton>
              }
            />
          }
        />
      </div>

      <TopicFormModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSaved={refresh}
      />
    </TopicsPageShell>
  );
}
