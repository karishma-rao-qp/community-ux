'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { IWuTableColumnDef } from '@npm-questionpro/wick-ui-lib';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { EmptyState } from '@/components/ui/EmptyState';
import { TopicsPageShell } from '@/components/topics/TopicsPageShell';
import { CategoryFormModal } from '@/components/topics/CategoryFormModal';
import { CategoryTranslationModal } from '@/components/topics/CategoryTranslationModal';
import {
  TranslationImportModal,
  exportCategoryTranslations,
} from '@/components/topics/TranslationImportModal';
import type { TopicCategory } from '@/data/mock-topic-categories';
import { getCategoryTranslations, getTopicCategories } from '@/services/topic-category-translations';
import { truncate } from '@/data/mock-utils';

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
const WuMenu = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuMenu })),
  { ssr: false }
);
const WuMenuItem = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuMenuItem })),
  { ssr: false }
);

function TranslationCountBadge({ categoryId }: { categoryId: string }) {
  const count = getCategoryTranslations(categoryId).length;
  if (count === 0) {
    return <span className="text-xs text-gray-400">None</span>;
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
      {count} {count === 1 ? 'language' : 'languages'}
    </span>
  );
}

function RowActions({
  category,
  onEdit,
  onTranslate,
}: {
  category: TopicCategory;
  onEdit: (c: TopicCategory) => void;
  onTranslate: (c: TopicCategory) => void;
}) {
  return (
    <WuMenu
      Trigger={
        <button type="button" className="p-1 rounded-md hover:bg-gray-100">
          <span className="wm-more-vert text-gray-500" />
        </button>
      }
      align="end"
    >
      <WuMenuItem onSelect={() => onEdit(category)}>Edit category</WuMenuItem>
      <WuMenuItem onSelect={() => onTranslate(category)}>Manage translations</WuMenuItem>
    </WuMenu>
  );
}

export default function TopicCategoriesSettingsPage() {
  const { showToast } = useWuShowToast();
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TopicCategory | null>(null);
  const [translationTarget, setTranslationTarget] = useState<TopicCategory | null>(null);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const categories = useMemo(() => {
    void refreshKey;
    return getTopicCategories();
  }, [refreshKey]);

  const columns: IWuTableColumnDef<TopicCategory>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      filterable: true,
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-gray-600">{truncate(row.original.description, 80)}</span>
      ),
    },
    {
      accessorKey: 'topicCount',
      header: 'Topics',
      headerAlign: 'right',
      cellAlign: 'right',
      cell: ({ row }) => row.original.topicCount,
    },
    {
      accessorKey: 'id',
      header: 'Translations',
      cell: ({ row }) => <TranslationCountBadge categoryId={row.original.id} />,
    },
    {
      accessorKey: 'key',
      header: '',
      cellAlign: 'right',
      cell: ({ row }) => (
        <RowActions
          category={row.original}
          onEdit={setEditTarget}
          onTranslate={setTranslationTarget}
        />
      ),
    },
  ];

  function handleExport() {
    exportCategoryTranslations();
    showToast({ message: 'Translations exported', variant: 'success' });
  }

  return (
    <TopicsPageShell
      actions={
        <>
          <WuButton variant="secondary" onClick={() => setIsImportOpen(true)}>
            <span className="wm-upload" /> Import
          </WuButton>
          <WuButton variant="secondary" onClick={handleExport}>
            <span className="wm-download" /> Export
          </WuButton>
          <WuButton onClick={() => setIsCreateOpen(true)}>
            <span className="wm-add" /> Add Category
          </WuButton>
        </>
      }
    >
      <div className="p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Categories</h2>
        <p className="text-sm text-gray-500 mb-4">
          Organize topics into categories and manage translated labels for each community
          language.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <WuInput
            variant="outlined"
            placeholder="Search categories..."
            Icon={<span className="wm-search" />}
            iconPosition="left"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md flex-1"
          />
        </div>

        <WuTable
          data={categories as unknown[]}
          columns={columns as unknown as IWuTableColumnDef<unknown>[]}
          variant="striped"
          sort={{ enabled: true }}
          filterText={search}
          NoDataContent={
            <EmptyState
              icon="wm-folder-open"
              title="No categories yet"
              description="Create your first topic category to organize discussions."
              action={
                <WuButton onClick={() => setIsCreateOpen(true)}>Add Category</WuButton>
              }
            />
          }
        />
      </div>

      <CategoryFormModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSaved={refresh}
      />

      <CategoryFormModal
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        category={editTarget}
        onSaved={refresh}
      />

      <CategoryTranslationModal
        open={translationTarget !== null}
        onOpenChange={(open) => {
          if (!open) setTranslationTarget(null);
        }}
        category={translationTarget}
        onSaved={refresh}
      />

      <TranslationImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImported={refresh}
      />
    </TopicsPageShell>
  );
}
