import type { TopicCategory, TopicCategoryTranslation } from '@/data/mock-topic-categories';
import { isValidCommunityLanguageCode } from '@/data/mock-community-languages';

export const TRANSLATION_EXPORT_COLUMNS = [
  'categoryId',
  'categoryKey',
  'defaultTitle',
  'defaultDescription',
  'languageCode',
  'translatedTitle',
  'translatedDescription',
] as const;

export type TranslationExportColumn = (typeof TRANSLATION_EXPORT_COLUMNS)[number];

export interface TranslationExportRow {
  categoryId: string;
  categoryKey: string;
  defaultTitle: string;
  defaultDescription: string;
  languageCode: string;
  translatedTitle: string;
  translatedDescription: string;
}

export interface TranslationImportRowResult {
  rowNumber: number;
  success: boolean;
  errors: string[];
  data?: TranslationExportRow;
}

export interface TranslationImportSummary {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  results: TranslationImportRowResult[];
}

function escapeCsvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

export function buildTranslationExportRows(
  categories: TopicCategory[],
  translations: TopicCategoryTranslation[]
): TranslationExportRow[] {
  const rows: TranslationExportRow[] = [];

  for (const category of categories) {
    const categoryTranslations = translations.filter(
      (t) => t.categoryId === category.id
    );

    if (categoryTranslations.length === 0) {
      rows.push({
        categoryId: category.id,
        categoryKey: category.key,
        defaultTitle: category.title,
        defaultDescription: category.description,
        languageCode: '',
        translatedTitle: '',
        translatedDescription: '',
      });
      continue;
    }

    for (const translation of categoryTranslations) {
      rows.push({
        categoryId: category.id,
        categoryKey: category.key,
        defaultTitle: category.title,
        defaultDescription: category.description,
        languageCode: translation.languageCode,
        translatedTitle: translation.title,
        translatedDescription: translation.description,
      });
    }
  }

  return rows;
}

export function exportTranslationsToCsv(rows: TranslationExportRow[]): string {
  const header = TRANSLATION_EXPORT_COLUMNS.join(',');
  const body = rows
    .map((row) =>
      TRANSLATION_EXPORT_COLUMNS.map((col) => escapeCsvValue(row[col] ?? '')).join(',')
    )
    .join('\n');

  return `${header}\n${body}\n`;
}

export function parseTranslationImportCsv(
  csvContent: string,
  categories: TopicCategory[]
): TranslationImportSummary {
  const lines = csvContent
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return {
      totalRows: 0,
      successfulRows: 0,
      failedRows: 0,
      results: [
        {
          rowNumber: 0,
          success: false,
          errors: ['File is empty'],
        },
      ],
    };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const missingColumns = TRANSLATION_EXPORT_COLUMNS.filter(
    (col) => !header.includes(col)
  );

  if (missingColumns.length > 0) {
    return {
      totalRows: 0,
      successfulRows: 0,
      failedRows: 1,
      results: [
        {
          rowNumber: 1,
          success: false,
          errors: [`Missing required columns: ${missingColumns.join(', ')}`],
        },
      ],
    };
  }

  const categoryIds = new Set(categories.map((c) => c.id));
  const results: TranslationImportRowResult[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row: Partial<Record<TranslationExportColumn, string>> = {};

    header.forEach((col, index) => {
      if (TRANSLATION_EXPORT_COLUMNS.includes(col as TranslationExportColumn)) {
        row[col as TranslationExportColumn] = values[index]?.trim() ?? '';
      }
    });

    const errors: string[] = [];
    const categoryId = row.categoryId ?? '';
    const languageCode = row.languageCode ?? '';
    const translatedTitle = row.translatedTitle ?? '';

    if (!categoryId) {
      errors.push('categoryId is required');
    } else if (!categoryIds.has(categoryId)) {
      errors.push(`Invalid categoryId: ${categoryId}`);
    }

    if (!languageCode) {
      errors.push('languageCode is required');
    } else if (!isValidCommunityLanguageCode(languageCode)) {
      errors.push(`Invalid languageCode: ${languageCode}`);
    }

    if (!translatedTitle.trim()) {
      errors.push('translatedTitle is required');
    }

    const data: TranslationExportRow = {
      categoryId,
      categoryKey: row.categoryKey ?? '',
      defaultTitle: row.defaultTitle ?? '',
      defaultDescription: row.defaultDescription ?? '',
      languageCode,
      translatedTitle,
      translatedDescription: row.translatedDescription ?? '',
    };

    results.push({
      rowNumber: i + 1,
      success: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : undefined,
    });
  }

  const successfulRows = results.filter((r) => r.success).length;

  return {
    totalRows: results.length,
    successfulRows,
    failedRows: results.length - successfulRows,
    results,
  };
}

export function downloadCsvFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
