import { describe, expect, it } from 'vitest';
import type { TopicCategory, TopicCategoryTranslation } from '@/data/mock-topic-categories';
import {
  getLocalizedCategory,
  hasTranslationFormErrors,
  validateTranslationForm,
} from '@/lib/topic-category-localization';

const baseCategory: TopicCategory = {
  id: 'cat-test',
  key: 'test-category',
  title: 'Default Title',
  description: 'Default Description',
  criteria: '',
  topicCount: 0,
  createdAt: '2025-01-01T00:00:00Z',
};

const translations: TopicCategoryTranslation[] = [
  {
    id: 'tr-es',
    categoryId: 'cat-test',
    languageCode: 'es',
    title: 'Título en Español',
    description: 'Descripción en Español',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tr-fr',
    categoryId: 'cat-test',
    languageCode: 'fr',
    title: 'Titre Français',
    description: '',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('getLocalizedCategory', () => {
  it('returns exact preferred language translation', () => {
    const result = getLocalizedCategory(
      baseCategory,
      translations,
      'es',
      'en-US',
      'en'
    );

    expect(result.title).toBe('Título en Español');
    expect(result.description).toBe('Descripción en Español');
    expect(result.usedFallback).toBe(false);
    expect(result.languageUsed).toBe('es');
  });

  it('falls back to browser locale when preferred language is missing', () => {
    const result = getLocalizedCategory(
      baseCategory,
      translations,
      'de',
      'fr-FR',
      'en'
    );

    expect(result.title).toBe('Titre Français');
    expect(result.description).toBe('Default Description');
    expect(result.usedFallback).toBe(false);
  });

  it('falls back to default category values when no translation exists', () => {
    const result = getLocalizedCategory(
      baseCategory,
      translations,
      'ja',
      'de-DE',
      'en'
    );

    expect(result.title).toBe('Default Title');
    expect(result.description).toBe('Default Description');
    expect(result.usedFallback).toBe(true);
    expect(result.languageUsed).toBe('en');
  });

  it('never returns blank title when translation title is empty', () => {
    const emptyTitleTranslation: TopicCategoryTranslation[] = [
      {
        ...translations[0],
        title: '   ',
      },
    ];

    const result = getLocalizedCategory(
      baseCategory,
      emptyTitleTranslation,
      'es',
      'es-ES',
      'en'
    );

    expect(result.title).toBe('Default Title');
    expect(result.usedFallback).toBe(true);
  });
});

describe('validateTranslationForm', () => {
  it('requires translated title', () => {
    const errors = validateTranslationForm({ title: '  ', description: '' });
    expect(errors.title).toBe('Translated title is required');
    expect(hasTranslationFormErrors(errors)).toBe(true);
  });

  it('passes valid form values', () => {
    const errors = validateTranslationForm({
      title: 'Valid title',
      description: 'Optional description',
    });
    expect(hasTranslationFormErrors(errors)).toBe(false);
  });

  it('rejects title over max length', () => {
    const errors = validateTranslationForm({
      title: 'a'.repeat(201),
      description: '',
    });
    expect(errors.title).toContain('200');
  });
});
