'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import {
  buildTranslationExportRows,
  downloadCsvFile,
  exportTranslationsToCsv,
  parseTranslationImportCsv,
  type TranslationImportSummary,
} from '@/lib/topic-category-translation-import-export';
import {
  getAllCategoryTranslations,
  getTopicCategories,
  importCategoryTranslations,
} from '@/services/topic-category-translations';

const WuModal = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModal })),
  { ssr: false }
);
const WuModalHeader = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalHeader })),
  { ssr: false }
);
const WuModalContent = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalContent })),
  { ssr: false }
);
const WuModalFooter = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalFooter })),
  { ssr: false }
);
const WuModalClose = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalClose })),
  { ssr: false }
);
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);

type TranslationImportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
};

export function TranslationImportModal({
  open,
  onOpenChange,
  onImported,
}: TranslationImportModalProps) {
  const { showToast } = useWuShowToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<TranslationImportSummary | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setSummary(null);
      setFileName(null);
    }
    onOpenChange(isOpen);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const isCsv = file.name.toLowerCase().endsWith('.csv') || validTypes.includes(file.type);

    if (!isCsv) {
      showToast({
        message: 'Please upload a CSV file',
        variant: 'error',
      });
      event.target.value = '';
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? '');
      const parsed = parseTranslationImportCsv(content, getTopicCategories());
      setSummary(parsed);
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function handleImport() {
    if (!summary) return;

    const successfulRows = summary.results
      .filter((r) => r.success && r.data)
      .map((r) => r.data!);

    if (successfulRows.length === 0) {
      showToast({ message: 'No valid rows to import', variant: 'error' });
      return;
    }

    const { updated, created } = importCategoryTranslations(successfulRows);
    showToast({
      message: `Import complete: ${created} created, ${updated} updated`,
      variant: 'success',
    });
    onImported();
    handleOpenChange(false);
  }

  return (
    <WuModal open={open} onOpenChange={handleOpenChange} size="md">
      <WuModalHeader>Import Category Translations</WuModalHeader>
      <WuModalContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Upload a CSV file with columns: categoryId, categoryKey, defaultTitle,
            defaultDescription, languageCode, translatedTitle, translatedDescription.
          </p>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <WuButton variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <span className="wm-upload" /> Choose CSV File
            </WuButton>
            {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
          </div>

          {summary && (
            <div className="rounded-lg border border-gray-200 p-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Total rows</p>
                  <p className="font-semibold text-gray-900">{summary.totalRows}</p>
                </div>
                <div>
                  <p className="text-gray-500">Successful</p>
                  <p className="font-semibold text-green-700">{summary.successfulRows}</p>
                </div>
                <div>
                  <p className="text-gray-500">Failed</p>
                  <p className="font-semibold text-red-600">{summary.failedRows}</p>
                </div>
              </div>

              {summary.failedRows > 0 && (
                <div className="max-h-40 overflow-y-auto">
                  <p className="text-xs font-medium text-gray-700 mb-2">Validation errors</p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {summary.results
                      .filter((r) => !r.success)
                      .map((r) => (
                        <li key={r.rowNumber}>
                          Row {r.rowNumber}: {r.errors.join('; ')}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose variant="secondary">Cancel</WuModalClose>
        <WuButton
          onClick={handleImport}
          disabled={!summary || summary.successfulRows === 0}
        >
          Import {summary?.successfulRows ?? 0} Rows
        </WuButton>
      </WuModalFooter>
    </WuModal>
  );
}

export function exportCategoryTranslations(): void {
  const rows = buildTranslationExportRows(
    getTopicCategories(),
    getAllCategoryTranslations()
  );
  const csv = exportTranslationsToCsv(rows);
  const date = new Date().toISOString().slice(0, 10);
  downloadCsvFile(`topic-category-translations-${date}.csv`, csv);
}
