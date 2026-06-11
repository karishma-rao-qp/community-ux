import { describe, expect, it } from 'vitest';
import type { TopicCategory } from '@/data/mock-topic-categories';
import {
  buildTranslationExportRows,
  exportTranslationsToCsv,
  parseTranslationImportCsv,
} from '@/lib/topic-category-translation-import-export';

const categories: TopicCategory[] = [
  {
    id: 'cat-001',
    key: 'feedback',
    title: 'Feedback',
    description: 'Share feedback',
    criteria: '',
    topicCount: 1,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

const translations = [
  {
    id: 'tr-001',
    categoryId: 'cat-001',
    languageCode: 'es',
    title: 'Comentarios',
    description: 'Comparte comentarios',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('buildTranslationExportRows', () => {
  it('includes translation rows with identifiers', () => {
    const rows = buildTranslationExportRows(categories, translations);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      categoryId: 'cat-001',
      categoryKey: 'feedback',
      defaultTitle: 'Feedback',
      languageCode: 'es',
      translatedTitle: 'Comentarios',
    });
  });
});

describe('exportTranslationsToCsv', () => {
  it('produces CSV with required headers', () => {
    const rows = buildTranslationExportRows(categories, translations);
    const csv = exportTranslationsToCsv(rows);
    expect(csv).toContain('categoryId,categoryKey,defaultTitle');
    expect(csv).toContain('cat-001,feedback,Feedback');
  });
});

describe('parseTranslationImportCsv', () => {
  it('validates invalid category IDs and language codes', () => {
    const csv = `categoryId,categoryKey,defaultTitle,defaultDescription,languageCode,translatedTitle,translatedDescription
bad-id,feedback,Feedback,Share feedback,es,Título,Desc`;

    const summary = parseTranslationImportCsv(csv, categories);
    expect(summary.failedRows).toBe(1);
    expect(summary.results[0].errors[0]).toContain('Invalid categoryId');
  });

  it('accepts valid import rows', () => {
    const csv = `categoryId,categoryKey,defaultTitle,defaultDescription,languageCode,translatedTitle,translatedDescription
cat-001,feedback,Feedback,Share feedback,fr,Retours,Partagez vos retours`;

    const summary = parseTranslationImportCsv(csv, categories);
    expect(summary.successfulRows).toBe(1);
    expect(summary.results[0].data?.translatedTitle).toBe('Retours');
  });

  it('reports missing required columns', () => {
    const csv = `categoryId,languageCode
cat-001,es`;

    const summary = parseTranslationImportCsv(csv, categories);
    expect(summary.failedRows).toBe(1);
    expect(summary.results[0].errors[0]).toContain('Missing required columns');
  });
});
