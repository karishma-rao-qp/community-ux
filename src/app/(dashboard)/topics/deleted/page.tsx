'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { IWuTableColumnDef } from '@npm-questionpro/wick-ui-lib';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { EmptyState } from '@/components/ui/EmptyState';
import { TopicsPageShell } from '@/components/topics/TopicsPageShell';
import type { Topic } from '@/data/mock-topic-categories';
import { formatDateTime } from '@/data/mock-utils';
import {
  getDeletedTopics,
  getTopicCategories,
  getTopicCategoryById,
} from '@/services/topic-category-translations';

const WuTable = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuTable })),
  { ssr: false }
);
const WuInput = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuInput })),
  { ssr: false }
);

export default function DeletedTopicsPage() {
  const { showToast } = useWuShowToast();
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Topic[]>([]);

  const topics = useMemo(() => getDeletedTopics(), []);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    getTopicCategories().forEach((c) => map.set(c.id, c.title));
    return map;
  }, []);

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
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => {
        const category =
          categoryMap.get(row.original.categoryId) ??
          getTopicCategoryById(row.original.categoryId)?.title ??
          '—';
        return <span className="text-sm text-gray-700">{category}</span>;
      },
    },
  ];

  return (
    <TopicsPageShell>
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
            className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Filter"
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
              icon="wm-delete"
              title="No deleted topics"
              description="Topics you delete will appear here."
            />
          }
        />
      </div>
    </TopicsPageShell>
  );
}
